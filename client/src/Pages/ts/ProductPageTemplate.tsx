import React, { MouseEventHandler, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AiOutlineStar, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import axios, { AxiosError } from 'axios';
// @ts-ignore
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { AuthContext } from '../../components/ts/AuthContext';
import { IUser, AuthContextType } from '../../@types/AuthContext';
import LineChart from '../../components/ts/LineChart';
import {
  IProduct,
  IProductAbouts,
  IProductDetails,
  IProductHighResImages,
  IProductImages,
  IProductPrice,
  IProductTechnicalDetails,
} from '../../@types/ProductPageTemplate';
import '../css/ProductPageTemplate.css';

const ProductWebsiteTemplate = () => {
  const { product_id } = useParams();
  const { authState } = useContext(AuthContext) as AuthContextType;
  // TODO fix this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [changingProductId, setChangingProductId] = useState(product_id);
  const [isProudctInFavourites, setIsProudctInFavourites] = useState<boolean>(false);
  const [changingFavouriteStatus, setChangingFavouriteStatus] = useState<boolean>(false);
  const [images, setImages] = useState<IProductImages[]>([]);
  const [details, setDetails] = useState<IProductDetails[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<IProductTechnicalDetails[]>([]);
  const [abouts, setAbouts] = useState<IProductAbouts[]>([]);
  const [highResImages, setHighResImages] = useState<IProductHighResImages[]>([]);
  const [productBasicInformations, setProductBasicInformations] = useState<IProduct[]>([]);
  const [prices, setPrices] = useState<IProductPrice[]>([]);
  // TODO remove charts data for prices
  const [chartsData, setChartsData] = useState<IProductPrice[]>([]);

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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const getProductData = (url: string, setProductData: (arg0: never[]) => void) => {
    axios
      .get(url + product_id)
      .then(async response => response.data)
      .then(response_data => {
        // If json is not empty set data, else set empty array
        if (response_data.data) setProductData(response_data.data);
        else setProductData([]);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const toggleSelectedImage: MouseEventHandler = image => {
    // If there is any image that has class '.selected', remove that class from it.
    const selectedImage = document.querySelector('.selected');
    if (selectedImage) selectedImage?.classList.toggle('selected');

    // If there is any image that has class '.highresSelected', remove that class from it.
    const selectedHighresImage = document.querySelector('.highresSelected');
    if (selectedHighresImage) selectedHighresImage?.classList.toggle('highresSelected');

    // Toggle clicked image selected class
    (image.target as HTMLTextAreaElement).classList.toggle('selected');

    // Get current image but in high resolution and toggle class "highresSelected" to show it
    const highResImage = `highres${(image.target as HTMLTextAreaElement).id}`;
    document.getElementById(highResImage)?.classList.toggle('highresSelected');
  };

  const hideContent = (class_name: string) => {
    const expanded = document.querySelector('.expand');
    /*
    This is used to toggle off item when another one is about to toggle on
    If there is an item with "expand" class AND if "className" string ISN'T in "expanded" string
    Example: expanded = "productDetailsContent expanded" classname = "productDetailsContent" | true
    Example: expanded = "productAboutContent expanded" and classname = "productDetailsContent"| false
    */
    if (expanded)
      if (!expanded?.className.includes(class_name)) expanded?.classList.toggle('expand');

    const content = document.querySelector(`.${class_name}`);
    content?.classList.toggle('expand');
  };

  const checkIfItemIsInFavourites = async () => {
    await axios
      // Ex. url = /api/favourites/62cf26e4d9db05c765c888ee/B014I8SIJY
      .get(`/api/favourites/check/${authState._id}/${product_id}`)
      .then(response => response.data)
      .then(response_data => {
        response_data.data ? setIsProudctInFavourites(true) : setIsProudctInFavourites(false);
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  // This function is used to add or remove product from favourites
  const addOrRemoveFromFavourites = async (user_id: IUser['_id']) => {
    setChangingFavouriteStatus(true);
    await checkIfItemIsInFavourites();
    axios
      .request({
        method: isProudctInFavourites ? 'delete' : 'post',
        url: '/api/favourites/',
        data: {
          user_id,
          product_id,
        },
      })
      .then(response => response.data)
      .then(async response_data => {
        if (response_data.message) {
          await checkIfItemIsInFavourites();
          !isProudctInFavourites
            ? alertify.success(response_data.message)
            : alertify.error(response_data.message);
        }
        setChangingFavouriteStatus(false);
      });
  };

  useEffect(() => {
    setChangingProductId(product_id);
    clearStates();
    axios
      .get(`/api/ap/images/id/${product_id}`)
      .then(async response => response.data)
      .then(response_data => {
        if (response_data.data) setImages(response_data.data);
        else Promise.reject(response_data.message);
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
                <li key={product.product_thumb_image}>
                  <img
                    src={product.product_thumb_image}
                    width={70}
                    onClick={toggleSelectedImage}
                    // First image will have 'selected' class (visible to user)
                    className={key > 0 ? '' : 'selected'}
                    // ID is used for determining what highres image should be rendered
                    id={`img${key}`}
                    alt="thumb_image"
                  />
                </li>
              ))
            ) : (
              // Skeleton loading setup for price chart
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
                <li key={product.product_highres_image}>
                  <a href={product.product_highres_image} target="_blank" rel="noreferrer">
                    <img
                      src={product.product_highres_image}
                      id={`highresimg${key}`}
                      // First image will have 'selected' class (visible to user)
                      className={key > 0 ? '' : 'highresSelected'}
                      alt="high_resolution_image"
                    />
                  </a>
                </li>
              ))
            ) : (
              // Skeleton loading setup for price chart
              <li>
                <div className="skeleton-highresimage skeleton-loading" />
              </li>
            )}
          </ul>
          <br />
        </div>
        <div id="productData">
          {
            // TODO Right now productBasicInformations will allways be bigger than 0, fix that
            productBasicInformations.length > 0 ? (
              productBasicInformations.map(product => (
                <div id="productBasicInformations" key={product._id}>
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
                  <div className="center">
                    <h3>
                      {product.product_sale_price ? `${product.product_sale_price}€` : '0.00€'}
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
                <div className="center">
                  <div className="skeleton-small-text skeleton-loading" />
                </div>
              </div>
            )
          }
          {details.length > 1 ? (
            <div className="productDetails">
              <div className="productDetailsHeaderAndButton">
                <h2>DETAILS</h2>
                <button type="button" onClick={() => hideContent('productDetailsContent')}>
                  -
                </button>
              </div>
              <div className="productDetailsContent">
                <ol>
                  {details.map(product => (
                    <li key={product.product_detail_name}>
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
                <button type="button" onClick={() => hideContent('productTechnicalDetailsContent')}>
                  -
                </button>
              </div>
              <div className="productTechnicalDetailsContent">
                <ol>
                  {technicalDetails.map(product => (
                    <li key={product.product_technical_detail_name}>
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
                <button type="button" onClick={() => hideContent('productAboutContent')}>
                  -
                </button>
              </div>
              <div className="productAboutContent">
                <ol>
                  {abouts.map(product => (
                    <li key={product.product_about}>
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
                type="button"
                disabled={changingFavouriteStatus}
                onClick={() => addOrRemoveFromFavourites(authState._id)}
              >
                <AiFillHeart className="favImage" />
              </button>
            ) : (
              <button
                type="button"
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
          <LineChart data={chartsData} />
        ) : (
          // Skeleton loading setup for price chart
          <div id="priceChart">
            <div className="center">
              <div className="skeleton-small-text skeleton-loading" />
            </div>
            <div className="center">
              <div className="skeleton-chart skeleton-loading" />
            </div>
            <div className="center">
              <div className="skeleton-small-text skeleton-loading" />
            </div>
            <div className="center">
              <div className="skeleton-small-text skeleton-loading" />
              <div className="skeleton-small-text skeleton-loading" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductWebsiteTemplate;
