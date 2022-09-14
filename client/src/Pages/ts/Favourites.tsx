import { Key, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext, { IUser } from '../../components/ts/AuthContext';
import '../css/Favourites.css';
import axios, { AxiosError } from 'axios';

const Favourites = () => {
  interface IProduct {
    product_name: string;
    product_id: string;
    product_image: string;
  }

  const { authState } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [favouritesData, setFavouritesData] = useState<any[]>([]);

  //Get user favourites from database
  const getFavouritesFromUser = async (user_id: IUser['_id']) => {
    if (user_id) {
      axios
        .get('/api/favourites/' + user_id)
        .then(response => response.data)
        .then(async responseData => {
          getDataAboutFavourite(responseData.data.map((item: any) => item.product_id));
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  };

  //Get data about user favourite products (ex. product name, product image)
  const getDataAboutFavourite = async (product_id_array: Array<any>) => {
    axios
      .get('/api/ap/array/', { params: { array: product_id_array } })
      .then(response => response.data)
      .then(responseData => {
        setFavouritesData(responseData);
        setLoading(false);
      });
  };

  useEffect(() => {
    getFavouritesFromUser(authState._id);
  }, [
    //authState._id  makes it re-render when authState changes. This is because authState._id changes to null when user refreshes the page.
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
            favouritesData.map((product: IProduct, key: Key) => (
              <li key={key} className="favourite">
                <Link to={'/Product/' + product.product_id}>
                  <div className="image">
                    <img src={product.product_image} />
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
