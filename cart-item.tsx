import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '@my-scope/context.cart';

type CartItemProps = {
  itemData: {
    productId: string;
    imageSrc: string;
    imageAltText: string;
    productDetails: { productName: string; offers: string; discountPrice: string };
    quantity: string;
  };
};

export function CartItem({ itemData }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);

  return (
    <section>
      <div className="cart-item">
        <div className="row gy-2">
          <div className="col-12 col-sm-4 col-md-12 col-lg-4">
            <img src={itemData.imageSrc} alt={itemData.imageAltText} />
          </div>

          <div className="col-12 col-sm-8 col-md-12 col-lg-8 d-flex flex-column">
            <div className="flex-grow-1 d-flex">
              <div className="flex-grow-1">
                <div className="fs-5 fw-bold">{itemData.productDetails.productName}</div>
                <span className="description">{itemData.productDetails.offers}</span>
              </div>

              <div>
                <div className="fs-3">{itemData.productDetails.discountPrice}</div>
              </div>
            </div>

            <div className="d-inline-flex align-items-center mt-3">
              <div className="d-inline-flex align-items-center flex-grow-1 me-3">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => decreaseQuantity(itemData.productId)}
                >
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <span className="p-3 fw-bold fs-5">{itemData.quantity}</span>
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => increaseQuantity(itemData.productId)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>

              <a className="link me-4" href="#">
                <i className="far fa-heart"></i>
              </a>

              <span>
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => removeFromCart(itemData.productId)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>{' '}
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </section>
  );
}
