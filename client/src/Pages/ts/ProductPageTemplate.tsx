import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductPageTemplate.css';
import { AiOutlineStar } from 'react-icons/ai';
const ProductWebsiteTemplate = () => {
  const { productId } = useParams();
  const [changingProductId, setChangingProductId] = useState(productId);
  const [details, setDetails] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<any[]>([]);
  const [abouts, setAbouts] = useState<any[]>([]);
  const [highResImages, setHighResImages] = useState<any[]>([]);
  const [productBasicInformations, setProductBasicInformations] = useState<any[]>([]);

  const clearStates = () => {
    setImages([]);
    setDetails([]);
    setTechnicalDetails([]);
    setAbouts([]);
    setHighResImages([]);
    setProductBasicInformations([]);
  };
  const fetchProductData = (
    requestOptions: RequestInit,
    url: string,
    setProductData: (arg0: never[]) => void,
  ) => {
    fetch(url + productId, requestOptions)
      .then(async response => await response.json())
      .then(data => {
        //If json is not empty set data, else set empty array
        if (data.length > 0) setProductData(data);
        else setProductData([]);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const toggleSelectedImage: MouseEventHandler = image => {
    //If there is any image that has class '.selected', remove that class from it.
    const selectedImage = document.querySelector('.selected');
    if (selectedImage) selectedImage?.classList.toggle('selected');

    //If there is any image that has class '.highresSelected', remove that class from it.
    const selectedHighresImage = document.querySelector('.highresSelected');
    if (selectedHighresImage) selectedHighresImage?.classList.toggle('highresSelected');

    //Toggle clicked image selected class
    (image.target as HTMLTextAreaElement).classList.toggle('selected');

    //Get current image but in high resolution and toggle class "highresSelected" to show it
    const highResImage = 'highres' + (image.target as HTMLTextAreaElement).id;
    document.getElementById(highResImage)?.classList.toggle('highresSelected');
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
      .then(() => {
        fetchProductData(requestOptions, '/api/ap/images/id/', setImages);
      })
      .then(() => {
        fetchProductData(requestOptions, '/api/ap/technicalDetails/id/', setTechnicalDetails);
      })
      .then(() => {
        fetchProductData(requestOptions, '/api/ap/details/id/', setDetails);
      })
      .then(() => {
        fetchProductData(requestOptions, '/api/ap/about/id/', setAbouts);
      })
      .then(() => {
        fetchProductData(requestOptions, '/api/ap/id/', setProductBasicInformations);
      })
      .then(() => {
        fetchProductData(requestOptions, '/api/ap/highResImages/id/', setHighResImages);
      })
      .catch(e => {
        console.log(e);
      });
  }, [productId]);
  return (
    <>
      <div id="productInformations">
        <h2>{productId}</h2>
        <br />
        <div id="images">
          <ul>
            {images.length < 3 ? (
              <li>loading data...</li>
            ) : (
              images.map((product, key) => (
                <li key={key}>
                  <img
                    src={product.product_thumb_image}
                    width={60}
                    onClick={toggleSelectedImage}
                    //First image will have 'selected' class
                    className={key > 0 ? '' : 'selected'}
                    //ID is used for determining what highres image should react render
                    id={'img' + key}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
        <div id="highresImages">
          <ul>
            {highResImages.length > 1
              ? highResImages.map((product, key) => (
                  <li key={key}>
                    <img
                      src={product.product_highres_image}
                      id={'highresimg' + key}
                      //Only first image will be visible to user.
                      className={key > 0 ? '' : 'highresSelected'}
                    />
                  </li>
                ))
              : false}
          </ul>
          <br />
        </div>
        <div id="productData">
          {
            //TODO Right now productBasicInformations will allways be bigger than 0, fix that
            productBasicInformations.length > 0
              ? productBasicInformations.map(product => (
                  <div id="productBasicInformations">
                    <h1>{product.product_name}</h1>
                    <div id="reviews">
                      <AiOutlineStar />
                      <AiOutlineStar />
                      <AiOutlineStar />
                      <AiOutlineStar />
                      <AiOutlineStar />
                      <h4>100 Reviews</h4>
                    </div>
                    <h3>
                      {product.product_sale_price == null
                        ? '0.00€'
                        : product.product_sale_price + '€'}
                    </h3>
                  </div>
                ))
              : false
          }
          <div id="productDetails">
            <h2>THE DETAILS</h2>
            {details.length > 1
              ? details.map(product => (
                  <ol>
                    <li key={product._id}>
                      <span>
                        {product.product_detail_name}: {product.product_detail}
                      </span>
                    </li>
                  </ol>
                ))
              : false}
          </div>
          <ul>
            {technicalDetails.length > 1
              ? technicalDetails.map(product => (
                  <table>
                    <tr>
                      <th>{product.product_technical_detail_name}: </th>
                      <td>{product.product_technical_detail}</td>
                    </tr>
                  </table>
                ))
              : false}
          </ul>
          <br />
          <ul>
            {abouts.length > 1
              ? abouts.map(product => <li key={product._id}>{product.product_about}</li>)
              : false}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProductWebsiteTemplate;
