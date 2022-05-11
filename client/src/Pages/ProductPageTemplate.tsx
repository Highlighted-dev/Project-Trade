import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductWebsiteTemplate = () => {
  const { productId } = useParams();
  const [isFetching, setIsFetching] = useState(true);
  const [details, setDetails] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<any[]>([]);
  useEffect(() => {
    if (isFetching) {
      const searchbar = document.querySelector('.searchBar');
      const requestOptions = {
        method: 'GET',
      };
      //Get product data with "x" name from api
      //TODO Change this to one big request?
      fetch('/api/ap/details/id/' + productId, requestOptions)
        .then(async response => setDetails(await response.json()))
        .catch(e => {
          console.log(e);
        });
      fetch('/api/ap/images/id/' + productId, requestOptions)
        .then(async response => setImages(await response.json()))
        .catch(e => {
          console.log(e);
        });
      fetch('/api/ap/technicalDetails/id/' + productId, requestOptions)
        .then(async response => setTechnicalDetails(await response.json()))
        .catch(e => {
          console.log(e);
        });
      setIsFetching(false);
    }
  });
  return (
    <div>
      <h2>{productId}</h2>
      <br />
      <ul>
        {details.map(product => (
          <li key={product.product_id}>
            {product.product_detail_name}: {product.product_detail}
          </li>
        ))}
      </ul>
      <ul>
        {images.map(product => (
          <li key={product.product_id}>
            image: <img src={product.product_image} />
          </li>
        ))}
      </ul>
      <ul>
        {technicalDetails.map(product => (
          <li key={product.product_id}>
            {product.product_technical_detail_name}: {product.product_technical_detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductWebsiteTemplate;
