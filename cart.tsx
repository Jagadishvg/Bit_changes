import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';
import { CartContext } from '@my-scope/context.cart';
import { OfferBanner } from '@my-scope/components.offer-banner';
import { AddCoupon } from '@my-scope/components.add-coupon';
import { Summary } from '@my-scope/components.summary';
import { CartItem } from '@my-scope/components.cart-item';
import { CardSection } from '@my-scope/components.card-section';

export function Cart() {
  const [cartData, setCartData] = useState({
    offerBanner: {},
    cartSection: {},
    sections: [],
    summaryData: {},
  });

  useEffect(() => {
    fetch('http://127.0.0.1:5500/my-scope/assets/cart.json')
      .then((response) => response.json())
      .then((jsonData) => setCartData(jsonData))
      .catch((error) => console.error('Error:', error));
  }, []);

  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

  const calculateShippingCost = () => {
    return "$5";
  };

  const calculateTotalPrice = () => {
    const totalPrice = cart.reduce((total, item) => {
      console.log((item.productDetails.discountPrice.slice(1)) * item.quantity);
      return total + (item.productDetails.discountPrice.slice(1) * item.quantity);
    }, 0).toFixed(2);
    console.log('Total Price:', totalPrice);
    return totalPrice;
  };

  const calculateDiscount = () => {
    const discountPerItem = 2;
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const discount = (totalItems * discountPerItem).toFixed(2);
    return `$${discount}`;
  };

  const calculateTotal = () => {
    const totalPrice = parseFloat(calculateTotalPrice());
    const discount = parseFloat(calculateDiscount().slice(1));
    const shipping = parseFloat(calculateShippingCost().slice(1)); // Parse shipping cost as a number
    const total = (totalPrice + shipping - discount).toFixed(2);
    return `$${total}`;
  };
  
  return (
    <div className="mt-5">
      <OfferBanner offerBanner={cartData.offerBanner} />
      <section className="container py-4 py-lg-5">
        <NavLink to="/" className="link">
          <FontAwesomeIcon icon={faAngleLeft} className="me-3" />Keep Shopping
        </NavLink>
        <h1 className="mb-4 mb-lg-5">{cartData.cartSection.title}</h1>
        <div className="row gy-4 gx-5">
          <div className="col-12 col-md-6 col-lg-8">
            {cart && cart.map((cart1) => <CartItem itemData={cart1} key={cart1.productId} />)}
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <AddCoupon />
            <hr />
            <Summary
                summaryData={{
                  totalPrice: cart.length > 0 ? `$${calculateTotalPrice()}` : "$0",
                  totalShipinPrice: cart.length > 0 ? calculateShippingCost() : "$0",
                  discountApplied: cart.length > 0 ? calculateDiscount() : "$0",
                  total: cart.length > 0 ? calculateTotal() : "$0",
                }}
              />
            <div className="d-grid gap-2">
              <button className="btn btn-primary full-width mt-4">Proceed To Checkout</button>
            </div>
          </div>
        </div>
      </section>
      <hr className="container" />
      {cartData.sections &&
        cartData.sections.length > 0 &&
        cartData.sections.map((section, index) => (
          <CardSection sectionData={section} key={index} />
        ))}
    </div>
  );
}
