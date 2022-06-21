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
  const hideContent = (className: string) => {
    const expanded = document.querySelector('.expand');
    /*
    This is used to toggle off item when another one is about to toggle on
    If there is an item with "expand" class AND if "className" string ISN'T in "expanded" string
    Example: expanded = "productDetailsContent expanded" classname = "productDetailsContent" | true
    Example: expanded = "productAboutContent expanded" and classname = "productDetailsContent"| false
    */
    if (expanded)
      if (!expanded?.className.includes(className)) expanded?.classList.toggle('expand');

    const content = document.querySelector(`.${className}`);
    content?.classList.toggle('expand');
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
        <div id="images">
          <ul>
            {images.length < 3 ? (
              <li>loading data...</li>
            ) : (
              images.map((product, key) => (
                <li key={key}>
                  <img
                    src={product.product_thumb_image}
                    width={70}
                    onClick={toggleSelectedImage}
                    //First image will have 'selected' class (visible to user)
                    className={key > 0 ? '' : 'selected'}
                    //ID is used for determining what highres image should be rendered
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
                      //First image will have 'selected' class (visible to user)
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
                      <AiOutlineStar className="icons" />
                      <AiOutlineStar className="icons" />
                      <AiOutlineStar className="icons" />
                      <AiOutlineStar className="icons" />
                      <AiOutlineStar className="icons" />
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
          {details.length > 1 ? (
            <div className="productDetails">
              <div className="productDetailsHeaderAndButton">
                <h2>THE DETAILS</h2>
                <button onClick={() => hideContent('productDetailsContent')}>-</button>
              </div>
              <div className="productDetailsContent">
                <ol>
                  {details.map(product => (
                    <li key={product._id}>
                      <span>
                        {product.product_detail_name}: {product.product_detail}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            false
          )}

          {technicalDetails.length > 1 ? (
            <div className="productTechnicalDetails">
              <div className="productTechnicalDetailsHeaderAndButton">
                <h2>THE DETAILS</h2>
                <button onClick={() => hideContent('productTechnicalDetailsContent')}>-</button>
              </div>
              <div className="productTechnicalDetailsContent">
                <ol>
                  {technicalDetails.map(product => (
                    <li key={product._id}>
                      <span>
                        {product.product_technical_detail_name}: {product.product_technical_detail}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            false
          )}

          {abouts.length > 1 ? (
            <div className="productAbout">
              <div className="productAboutHeaderAndButton">
                <h2>ABOUT</h2>
                <button onClick={() => hideContent('productAboutContent')}>-</button>
              </div>
              <div className="productAboutContent">
                <ol>
                  {abouts.map(product => (
                    <li key={product._id}>
                      <span>{product.product_about}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            false
          )}
        </div>
      </div>
    </>
  );
};

export default ProductWebsiteTemplate;
