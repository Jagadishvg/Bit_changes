import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { SearchContext } from '@my-scope/context.search';
import { PlainCard } from "@my-scope/components.plain-card";
import { Cards } from "@my-scope/components.cards";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark
} from '@fortawesome/free-solid-svg-icons';

export type SearchProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function Search({ children }: SearchProps) {
  const { search, searchTerm, setSubcategory, selectedSubcategories } = useContext(SearchContext);
  const [homeData, setData] = useState({ featureSection: {} });
  const [mockData, setMockData] = useState({ all_items: [] });
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  const [selectedPriceRangeText, setSelectedPriceRangeText] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch('http://127.0.0.1:5500/my-scope/assets/Mock_plants.json')
      .then((response) => response.json())
      .then((data) => setMockData(data))
      .catch((error) => console.error('Error fetching mock data:', error));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5500/my-scope/assets/home2.json')
    .then((response) => response.json())
    .then((jsonData) => setData(jsonData))
    .catch((error) => console.error('Error:', error));
  }, []);

  const handlePriceRangeChange = (range) => {
    if (selectedPriceRanges.includes(range)) {
      setSelectedPriceRanges(selectedPriceRanges.filter((selectedRange) => selectedRange !== range));
    }
    else { setSelectedPriceRanges([...selectedPriceRanges, range]); }

    const newSelectedRanges = [...selectedPriceRanges];
    if (newSelectedRanges.includes(range)) {
      newSelectedRanges.splice(newSelectedRanges.indexOf(range), 1);
    } else { newSelectedRanges.push(range); }
    setSelectedPriceRanges(newSelectedRanges);
    setIsPriceFilterActive(newSelectedRanges.length > 0);

    setSelectedPriceRangeText(newSelectedRanges.join(', '))
  };
  const handleBadgeRemove = () => {
    setSelectedPriceRanges([]);
    setIsPriceFilterActive(false);
    setSelectedPriceRangeText('');
  };
  const filteredProducts = search.filter((product) => {
    console.log('Product:', product);
    console.log('Selected Subcategories:', selectedSubcategories);
  
    if (selectedSubcategories.length === 0 || selectedSubcategories.includes(product.productDetails.category)) {
      if (selectedPriceRanges.length === 0) {
        return true;
      }
  
      const price = parseFloat((product.productDetails.price).replace(/[^0-9.]/g, '')) || 0;
      console.log('Price:', price);
  
      return selectedPriceRanges.some((range) => {
        const [min, max] = range.split('-').map(Number);
        console.log('Range:', range, 'Min:', min, 'Max:', max);
        return price >= min && price <= max;
      });
    }
  
    return false;
  });
  
  console.log('Filtered Products:', filteredProducts);
  const gridClass = homeData.featureSection && homeData.featureSection.cardSize && homeData.featureSection.cardSize === 'small' ? 'col-6 col-lg-2 col-md-3 col-sm-4' : 'col-12 col-lg-4 col-md-6 col-sm-6'

  const subcategories = [...new Set(mockData.all_items.map((item) => item.productDetails.category))];

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };

  const startIndex = pageNumber * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className='pt-4'>
      <section className="container pt-5 mt-5">
        <a className="link" href="#">
          <i className="fas fa-angle-left me-3 my-3 pt-5 my-lg-4"></i>Back to
          previous page
        </a>

        <div className="row">
          <div className="col-12 col-md-4 col-lg-3 mt-3 pb-4 pb-lg-5">
            <div className="fs-5 mb-3 fw-bold">Filter By Categories</div>
            <ul className="list-group">
              {subcategories.map((subcategory) => (
                <li
                  key={subcategory}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                >
                  <label className="form-check" style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      value={subcategory}
                      checked={selectedSubcategories.includes(subcategory)}
                      onChange={() => setSubcategory(subcategory)}
                    />
                    {subcategory}
                  </label>
                </li>
              ))}
            </ul>
            <div className="fs-5 mt-4 mb-2 fw-bold">More Filters</div>
            {isPriceFilterActive && (
              <span className="col-12 ms-1" role="button" onClick={handleBadgeRemove}>
                Clear All Filters                 </span>)}
            <div className="accordion mt-1" id="accordionFlushExample">
              <div className="accordion-item">
                <div className="accordion-header" id="flush-headingOne">
                  <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne"            >
                    Price Range
                  </button>
                </div>
                <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample"          >
                  <div className="accordion-body">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="priceRange0-250" checked={selectedPriceRanges.includes('0-250')} onChange={() => handlePriceRangeChange('0-250')} />
                      <label className="form-check-label" htmlFor="priceRange0-250">
                        0-250
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="priceRange250-500" checked={selectedPriceRanges.includes('250-500')} onChange={() => handlePriceRangeChange('250-500')} />
                      <label className="form-check-label" htmlFor="priceRange250-500">
                        250-500
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-8 col-lg-9 pb-5 pb-lg-5">
            <div className="mb-4 d-flex align-items-center">
                <span className="fw-bold me-2 mb-1" style={{ fontSize: '1.15rem' }}>Search Results For:</span>
                <h1 className="fw-bold me-2 mb-1" style={{ fontSize: '1.5rem', marginBottom: '0', marginTop: '0' }}>
                  {searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)}
                </h1>
            </div>
            <div className="mb-5 mb-lg-0">
              <span className="fw-bold me-4 mb-2">Filters Applied:</span>
              {isPriceFilterActive && (
                <span className="badge bg-info text-black me-2 b-2">
                  {selectedPriceRangeText}
                  <span className="badge-remove-icon ms-1" onClick={handleBadgeRemove}>
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                </span>
              )}
              {selectedSubcategories.length > 0 && (
                <>
                  {selectedSubcategories.map((subcategory, index) => (
                    <span key={index} className="badge bg-info text-black me-3">
                      {subcategory}
                      <span className="badge-remove-icon ms-1" onClick={() => setSubcategory(null)}>
                        <FontAwesomeIcon icon={faXmark} />
                      </span>
                    </span>
                  ))}
                </>
              )}
            </div>
            <div className="row gy-4 mt-2">
                {paginatedProducts.map((section, index) => (
                  <div className={gridClass} key={section.title}>
                    <PlainCard cardData={section} cardShape={homeData.featureSection.cardShape} />
                  </div>
                ))}
              </div>
              {filteredProducts.length !== 0 && (
                <div className="mt-5 d-flex justify-content-center">
                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      <li className={`page-item ${pageNumber === 0 ? 'disabled' : ''}`}>
                        <button className="page-link" aria-label="Previous" onClick={() => changePage({ selected: pageNumber - 1 })}>
                          <span aria-hidden="true">&laquo;</span>
                        </button>
                      </li>
                      {[...Array(pageCount)].map((_, index) => (
                        <li key={index} className={`page-item ${index === pageNumber ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => changePage({ selected: index })}>
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${pageNumber === pageCount - 1 ? 'disabled' : ''}`}>
                        <button className="page-link" aria-label="Next" onClick={() => changePage({ selected: pageNumber + 1 })}>
                          <span aria-hidden="true">&raquo;</span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
        </div>
        <hr />
      </section>
    </div>
  );
}
