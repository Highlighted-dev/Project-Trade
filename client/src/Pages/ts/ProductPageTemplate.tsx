import React, { MouseEventHandler, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductPageTemplate.css';
import { AiOutlineStar, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import AuthContext from '../../components/ts/AuthContext';
var alertify = require('alertifyjs');
import 'alertifyjs/build/css/alertify.css';
import LineChart from '../../components/ts/LineChart';
import axios, { AxiosError } from 'axios';

const ProductWebsiteTemplate = () => {
  const { product_id } = useParams();
  const { authState } = useContext(AuthContext);
  const [changingProductId, setChangingProductId] = useState(product_id);
  const [isProudctInFavourites, setIsProudctInFavourites] = useState<boolean>(false);
  const [changingFavouriteStatus, setChangingFavouriteStatus] = useState<boolean>(false);
  const [details, setDetails] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<any[]>([]);
  const [abouts, setAbouts] = useState<any[]>([]);
  const [highResImages, setHighResImages] = useState<any[]>([]);
  const [productBasicInformations, setProductBasicInformations] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [chartsData, setChartsData] = useState<any[]>([]);

  const clearStates = () => {
    setImages([]);
    setDetails([]);
    setTechnicalDetails([]);
    setAbouts([]);
    setHighResImages([]);
    setProductBasicInformations([]);
    setPrices([]);
    setChartsData([]);
  };
  const getProductData = (url: string, setProductData: (arg0: never[]) => void) => {
    axios
      .get(url + product_id)
      .then(async response => await response.data)
      .then(responseData => {
        //If json is not empty set data, else set empty array
        if (responseData.data) setProductData(responseData.data);
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

  const checkIfItemIsInFavourites = async () => {
    await axios
      //Ex. url = /api/favourites/62cf26e4d9db05c765c888ee/B014I8SIJY
      .get('/api/favourites/check/' + authState._id + '/' + product_id)
      .then(response => response.data)
      .then(responseData => {
        responseData.data ? setIsProudctInFavourites(true) : setIsProudctInFavourites(false);
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  //This function is used to add or remove product from favourites
  const addOrRemoveFromFavourites = async (user_id: string) => {
    setChangingFavouriteStatus(true);
    await checkIfItemIsInFavourites();
    axios
      .request({
        method: isProudctInFavourites ? 'delete' : 'post',
        url: '/api/favourites/',
        data: {
          user_id: user_id,
          product_id: product_id,
        },
      })
      .then(response => response.data)
      .then(async responseData => {
        if (responseData.message) {
          await checkIfItemIsInFavourites();
          !isProudctInFavourites
            ? alertify.success(responseData.message)
            : alertify.error(responseData.message);
        }
        setChangingFavouriteStatus(false);
      });
  };

  useEffect(() => {
    setChangingProductId(product_id);
    clearStates();
    axios
      .get('/api/ap/images/id/' + product_id)
      .then(async response => response.data)
      .then(responseData => {
        if (responseData.data) {
          setImages(responseData.data);
        } else return Promise.reject(responseData.message);
      })
      .then(() => {
        getProductData('/api/ap/technicalDetails/id/', setTechnicalDetails);
      })
      .then(() => {
        getProductData('/api/ap/details/id/', setDetails);
      })
      .then(() => {
        getProductData('/api/ap/about/id/', setAbouts);
      })
      .then(() => {
        getProductData('/api/ap/id/', setProductBasicInformations);
      })
      .then(() => {
        checkIfItemIsInFavourites();
      })
      .then(() => {
        getProductData('/api/ap/prices/id/', setPrices);
      })
      .then(() => {
        getProductData('/api/ap/highResImages/id/', setHighResImages);
      })
      .catch(e => {
        console.log(e);
      });
  }, [product_id]);
  useEffect(() => {
    checkIfItemIsInFavourites();
  }, [authState]);
  useEffect(() => {
    if (prices.length > 0) {
      setChartsData(prices);
    }
  }, [prices]);
  return (
    <div id="productPage">
      <div id="productInformations">
        <div id="images">
          <ul>
            {images.length > 2 ? (
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
            ) : (
              <>
                <li>
                  <div className="skeleton-images skeleton-loading" />
                </li>
                <li>
                  <div className="skeleton-images skeleton-loading" />
                </li>
                <li>
                  <div className="skeleton-images skeleton-loading" />
                </li>
                <li>
                  <div className="skeleton-images skeleton-loading" />
                </li>
                <li>
                  <div className="skeleton-images skeleton-loading" />
                </li>
              </>
            )}
          </ul>
        </div>
        <div id="highresImages">
          <ul>
            {highResImages.length > 0 ? (
              highResImages.map((product, key) => (
                <li key={key}>
                  <img
                    src={product.product_highres_image}
                    id={'highresimg' + key}
                    //First image will have 'selected' class (visible to user)
                    className={key > 0 ? '' : 'highresSelected'}
                  />
                </li>
              ))
            ) : (
              <li>
                <div className={'skeleton-highresimage skeleton-loading'} />
              </li>
            )}
          </ul>
          <br />
        </div>
        <div id="productData">
          {
            //TODO Right now productBasicInformations will allways be bigger than 0, fix that
            productBasicInformations.length > 0 ? (
              productBasicInformations.map(product => (
                <div id="productBasicInformations">
                  <div id="productBasicInformationsText">
                    <h1>{product.product_name}</h1>
                  </div>
                  <div id="reviews">
                    <AiOutlineStar className="icons" />
                    <AiOutlineStar className="icons" />
                    <AiOutlineStar className="icons" />
                    <AiOutlineStar className="icons" />
                    <AiOutlineStar className="icons" />
                    <h4>100 Reviews</h4>
                  </div>
                  <div id="price">
                    <h3>
                      {product.product_sale_price ? product.product_sale_price + '€' : '0.00€'}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <div id="productBasicInformations">
                <div id="productBasicInformationsText">
                  <div className="skeleton-text skeleton-loading" />
                  <div className="skeleton-text skeleton-loading" />
                  <div className="skeleton-text skeleton-loading" />
                </div>
                <div id="reviews">
                  <div className="skeleton-ratings skeleton-loading" />
                </div>
                <div id="price">
                  <div className="skeleton-price skeleton-loading" />
                </div>
              </div>
            )
          }
          {details.length > 1 ? (
            <div className="productDetails">
              <div className="productDetailsHeaderAndButton">
                <h2>DETAILS</h2>
                <button onClick={() => hideContent('productDetailsContent')}>-</button>
              </div>
              <div className="productDetailsContent">
                <ol>
                  {details.map((product, key) => (
                    <li key={key}>
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
                <h2>TECHNICAL DETAILS</h2>
                <button onClick={() => hideContent('productTechnicalDetailsContent')}>-</button>
              </div>
              <div className="productTechnicalDetailsContent">
                <ol>
                  {technicalDetails.map((product, key) => (
                    <li key={key}>
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
                  {abouts.map((product, key) => (
                    <li key={key}>
                      <span>{product.product_about}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            false
          )}
          <div id="favourites">
            {isProudctInFavourites ? (
              <button
                disabled={changingFavouriteStatus}
                onClick={() => addOrRemoveFromFavourites(authState._id)}
              >
                <AiFillHeart className="favImage" />
              </button>
            ) : (
              <button
                disabled={changingFavouriteStatus}
                onClick={() => addOrRemoveFromFavourites(authState._id)}
              >
                <AiOutlineHeart className="favImage" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div id="productPriceDiv">
        {chartsData.length > 0 ? (
          <>
            <LineChart data={chartsData} />
          </>
        ) : (
          <h1>loading...</h1>
        )}
      </div>
    </div>
  );
};

export default ProductWebsiteTemplate;
