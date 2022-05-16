import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductWebsiteTemplate = () => {
  const { productId } = useParams();
  const [changingProductId, setChangingProductId] = useState(productId);
  const [details, setDetails] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<any[]>([]);
  useEffect(() => {
    setChangingProductId(productId);
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
  }, [productId]);

  return (
    <div>
      <h2>{productId}</h2>
      <br />
      <ul>
        {details.map(product => (
          <li key={product._id}>
            {product.product_detail_name}: {product.product_detail}
          </li>
        ))}
      </ul>
      <ul>
        {images.length > 0 ? (
          images.map(product => (
            <li key={product._id}>
              image: <img src={product.product_image} />
            </li>
          ))
        ) : (
          <li>XD</li>
        )}
      </ul>
      <ul>
        {technicalDetails.map(product => (
          <li key={product._id}>
            {product.product_technical_detail_name}: {product.product_technical_detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductWebsiteTemplate;
