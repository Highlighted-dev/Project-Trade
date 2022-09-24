import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { authContext } from '../../components/ts/AuthContext';
import { IUser, AuthContextType } from '../../@types/AuthContext';
import { IProduct } from '../../@types/ProductPageTemplate';
import { IUserFavourites } from '../../@types/Favourites';
import '../css/Favourites.css';

const Favourites = () => {
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

  // Get user favourites from database
  const getFavouritesFromUser = async (user_id: IUser['_id']) => {
    if (user_id) {
      axios
        .get(`/api/favourites/${user_id}`)
        .then(response => response.data)
        .then(async response_data => {
          getDataAboutFavourite(response_data.data.map((item: IUserFavourites) => item.product_id));
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
    <div className="center">
      <div id="favouritesPanel">
        <h1>Favourites</h1>
        <ul>
          {loading ? (
            <li>loading data...</li>
          ) : (
            favouritesData.map((product: IProduct) => (
              <li key={product.product_id} className="favourite">
                <Link to={`/Product/${product.product_id}`}>
                  <div className="image">
                    <img src={product.product_image} alt="product_image" />
                  </div>
                  <h2 className="text">{product.product_name}</h2>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Favourites;
