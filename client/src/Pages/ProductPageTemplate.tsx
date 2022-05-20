import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductWebsiteTemplate = () => {
  const { productId } = useParams();
  const [changingProductId, setChangingProductId] = useState(productId);
  const [details, setDetails] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<any[]>([]);
  const [about, setAbout] = useState<any[]>([]);

  const clearStates = () => {
    setImages([]);
    setDetails([]);
    setTechnicalDetails([]);
    setAbout([]);
  };
  const fetchProductData = (
    requestOptions: RequestInit,
    url: string,
    setProductData: (arg0: never[]) => void,
  ) => {
    fetch(url + productId, requestOptions)
      .then(async response => await response.json())
      .then(data => {
        //If json is not empty
        if (data.length > 2) setProductData(data);
        else setProductData([]);
      })
      .catch(e => {
        console.log(e);
      });
    fetch('/api/ap/about/id/' + productId, requestOptions)
      .then(async response => await response.json())
      .then(data => {
        setAbout(data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  useEffect(() => {
    setChangingProductId(productId);
    clearStates();
    const requestOptions = {
      method: 'GET',
    };

    fetch('/api/ap/checkProduct/id/' + productId, requestOptions)
      .then(async response => {
        if (response.status === 200) {
          return true;
        } else {
          return Promise.reject();
        }
      })
      .then(data => {
        console.log(data);
      })
      .catch(e => {
        console.log(e);
      });

    //Get product data with "x" name from api
    fetchProductData(requestOptions, '/api/ap/images/id/', setImages);
    fetchProductData(requestOptions, '/api/ap/technicalDetails/id/', setTechnicalDetails);
    fetchProductData(requestOptions, '/api/ap/details/id/', setDetails);
    fetchProductData(requestOptions, '/api/ap/about/id/', setAbout);
  }, [productId]);

  return (
    <div>
      <h2>{productId}</h2>
      <br />
      <ul>
        {details.length < 3 ? (
          <li>loading data...</li>
        ) : (
          details.map(product => (
            <li key={product._id}>
              {product.product_detail_name}: {product.product_detail}
            </li>
          ))
        )}
      </ul>
      <ul>
        {images.length < 3 ? (
          <li>loading data...</li>
        ) : (
          images.map(product => (
            <li key={product._id}>
              image: <img src={product.product_image} />
            </li>
          ))
        )}
      </ul>
      <ul>
        {details.length < 3 ? (
          <li>loading data...</li>
        ) : (
          technicalDetails.map(product => (
            <li key={product._id}>
              {product.product_technical_detail_name}: {product.product_technical_detail}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ProductWebsiteTemplate;
