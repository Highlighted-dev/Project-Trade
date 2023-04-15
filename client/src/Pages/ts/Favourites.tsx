import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { AiOutlineEuroCircle, AiOutlineCalendar, AiOutlineHeart } from 'react-icons/ai';
import { authContext } from '../../components/ts/AuthContext';
import { IUser, AuthContextType } from '../../@types/AuthContext';
import { IProduct } from '../../@types/ProductPageTemplate';
import { IUserFavourites } from '../../@types/Favourites';
import '../css/Favourites.css';

function Favourites() {
  const { authState } = useContext(authContext) as AuthContextType;
  const [loading, setLoading] = useState<boolean>(true);
  const [favouritesData, setFavouritesData] = useState<IProduct[]>([]);

  // Get data about user favourite products (ex. product name, product image)
  const getDataAboutFavourite = async (product_id_array: Array<string>) => {
    axios
      .get('/api/ap/array/', { params: { array: product_id_array } })
      .then(response => response.data)
      .then(response_data => {
        setFavouritesData(response_data);
        setLoading(false);
      });
  };

  // Get user favourites from db
  const getFavouritesFromUser = async (user_id: IUser['_id']) => {
    if (user_id) {
      axios
        .get(`/api/favourites/${user_id}`)
        .then(response => response.data)
        .then(async response_data => {
          if (response_data.data.length > 0) {
            getDataAboutFavourite(
              response_data.data.map((item: IUserFavourites) => item.product_id),
            );
          }
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    getFavouritesFromUser(authState._id);
  }, [
    // authState._id  makes it re-render when authState changes. This is because authState._id changes to null when user refreshes the page.
    authState._id,
  ]);
  return (
    <div id="favouritesPanel">
      <ul>
        <h1 className="favourites_header">Favourites</h1>
        {loading ? (
          <li>loading data...</li>
        ) : (
          favouritesData.map((product: IProduct) => (
            <li key={product.product_id} className="product_tile">
              <div className="column">
                <Link to={`/Product/${product.product_id}`}>
                  <div className="product_containter">
                    <div className="paneltile">
                      <div className="image">
                        <div className="image_scaling">
                          <img src={product.product_image} alt="product_image" />
                        </div>
                      </div>
                      <div className="product_name">
                        <div className="favourite_button">
                          <a href="#">
                            <AiOutlineHeart size="40" />
                          </a>
                        </div>
                        {product.product_name.length < 100
                          ? product.product_name
                          : `${product.product_name.substring(0, 100)}...`}
                      </div>
                      <div className="prices">
                        <div className="price">
                          <AiOutlineEuroCircle className="icon" />
                          100
                        </div>
                        <div className="lowest_price_past_month">
                          <AiOutlineCalendar className="icon" /> 120
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
export default Favourites;
