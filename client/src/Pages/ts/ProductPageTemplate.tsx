import React, { MouseEventHandler, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductPageTemplate.css';
import { AiOutlineStar, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import AuthContext from '../../components/ts/AuthContext';
var alertify = require('alertifyjs');
import 'alertifyjs/build/css/alertify.css';
import LineChart from '../../components/ts/LineChart';

const ProductWebsiteTemplate = () => {
  const { productId } = useParams();
  const { authState } = useContext(AuthContext);
  const [changingProductId, setChangingProductId] = useState(productId);
  const [isProudctInFavourites, setIsProudctInFavourites] = useState<boolean>(false);
  const [details, setDetails] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [technicalDetails, setTechnicalDetails] = useState<any[]>([]);
  const [abouts, setAbouts] = useState<any[]>([]);
  const [highResImages, setHighResImages] = useState<any[]>([]);
  const [productBasicInformations, setProductBasicInformations] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [chartsPriceData, setChartsPriceData] = useState<any>([]);
  const [chartsLabels, setChartsLabels] = useState<any>([]);
  const [chartsSetupDone, setChartsSetupDone] = useState<boolean>(false);

  const clearStates = () => {
    setImages([]);
    setDetails([]);
    setTechnicalDetails([]);
    setAbouts([]);
    setHighResImages([]);
    setProductBasicInformations([]);
    setPrices([]);
    setChartsPriceData([]);
    setChartsLabels([]);
  };
  const fetchProductData = (
    requestOptions: RequestInit,
    url: string,
    setProductData: (arg0: never[]) => void,
  ) => {
    fetch(url + productId, requestOptions)
      .then(async response => await response.json())
      .then(data => {
        //If json is not empty set data, else set empty array\

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

  const itemCheck = async (user_id: string) => {
    //Check if item is in favourites
    const response = await fetch('/api/favourites/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        product_id: productId,
      }),
    });
    //Response 200 means that item is already in favourites
    if (response.status == 200) return true;
    return false;
  };

  //This function is used to add or remove product from favourites
  const addOrRemoveFromFavourites = async (user_id: string) => {
    //Check if item is in favourites
    const isInFavourites = await itemCheck(user_id);
    const url = '/api/favourites/' + (isInFavourites ? 'remove' : 'add');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user_id,
        product_id: productId,
      }),
    });
    const responseData = await response.json();
    //Change favourite icon after adding or removing item from favourites
    changeFavouritesIcon(user_id);
    !isInFavourites ? alertify.success(responseData.message) : alertify.error(responseData.message);
  };

  //This function is used to change favourites icon. If item is in favourites, change icon to white filled heart, else change to white outline heart
  const changeFavouritesIcon = async (user_id: string) => {
    if (await itemCheck(user_id)) setIsProudctInFavourites(true);
    else setIsProudctInFavourites(false);
  };

  const setUpPriceChart = () => {
    setChartsSetupDone(false);
    if (prices.length > 0) {
      console.log('tst');
      const labels = prices.map(price => price.product_price_date);
      setChartsLabels(labels);
      const data = prices.map(price => price.product_price);
      setChartsPriceData(data);
      setChartsSetupDone(true);
    }
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
        fetchProductData(requestOptions, '/api/ap/prices/id/', setPrices);
      })
      .then(() => {
        fetchProductData(requestOptions, '/api/ap/highResImages/id/', setHighResImages);
      })
      .catch(e => {
        console.log(e);
      });
  }, [productId]);
  useEffect(() => {
    changeFavouritesIcon(authState._id);
  }, [authState]);
  useEffect(() => {
    setUpPriceChart();
  }, [prices]);
  return (
    <div id="productPage">
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
            {highResImages.length > 2 ? (
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
              <li>loading...</li>
            )}
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
              <AiFillHeart
                className="favImage"
                onClick={() => addOrRemoveFromFavourites(authState._id)}
              />
            ) : (
              <AiOutlineHeart
                className="favImage"
                onClick={() => addOrRemoveFromFavourites(authState._id)}
              />
            )}
          </div>
        </div>
      </div>
      <div id="productPriceDiv">
        {prices.length > 0 && chartsSetupDone ? (
          <>
            <LineChart data={chartsPriceData} labels={chartsLabels} />
          </>
        ) : (
          <h1>loading...</h1>
        )}
      </div>
    </div>
  );
};

export default ProductWebsiteTemplate;
