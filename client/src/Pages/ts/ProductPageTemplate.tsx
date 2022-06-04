import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductPageTemplate.css';
const ProductWebsiteTemplate = () => {
  const { productId } = useParams();
  const [changingProductId, setChangingProductId] = useState(productId);
  const [details, setDetails] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<any[]>([]);
  const [abouts, setAbouts] = useState<any[]>([]);
  const [highResImages, setHighResImages] = useState<any[]>([]);

  const clearStates = () => {
    setImages([]);
    setDetails([]);
    setTechnicalDetails([]);
    setAbouts([]);
    setHighResImages([]);
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
        console.error(e);
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
      //Get product data with "x" name from api
      .then(data => {
        fetchProductData(requestOptions, '/api/ap/images/id/', setImages);
      })
      .then(data => {
        fetchProductData(requestOptions, '/api/ap/technicalDetails/id/', setTechnicalDetails);
      })
      .then(data => {
        fetchProductData(requestOptions, '/api/ap/details/id/', setDetails);
      })
      .then(data => {
        fetchProductData(requestOptions, '/api/ap/about/id/', setAbouts);
      })
      .then(data => {
        fetchProductData(requestOptions, '/api/ap/highResImages/id/', setHighResImages);
      })
      .catch(e => {
        console.log(e);
      });
  }, [productId]);

  return (
    <div>
      <h2>{productId}</h2>
      <br />
      <div id="main">
        <div id="images">
          <ul>
            {images.length < 3 ? (
              <li>loading data...</li>
            ) : (
              images.map(product => (
                <li key={product._id}>
                  <img src={product.product_thumb_image} />
                </li>
              ))
            )}
          </ul>
          <br />
        </div>
        <ul>
          {details.length < 3
            ? false
            : details.map(product => (
                <li key={product._id}>
                  {product.product_detail_name}: {product.product_detail}
                </li>
              ))}
        </ul>
        <ul>
          {technicalDetails.length < 3
            ? false
            : technicalDetails.map(product => (
                <li key={product._id}>
                  {product.product_technical_detail_name}: {product.product_technical_detail}
                </li>
              ))}
        </ul>
        <br />
        <ul>
          {abouts.length < 3
            ? false
            : abouts.map(product => <li key={product._id}>{product.product_about}</li>)}
        </ul>
        <ul>
          {highResImages.length < 3
            ? false
            : highResImages.map(product => (
                <li key={product._id}>
                  {' '}
                  <img src={product.product_highres_image} />
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductWebsiteTemplate;
