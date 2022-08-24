import { Key, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../components/ts/AuthContext';
import '../css/Favourites.css';

const Favourites = () => {
  interface IProduct {
    product_name: string;
    product_id: string;
    product_image: string;
  }

  const { authState } = useContext(AuthContext);
  const [favourites, setFavourites] = useState<any[]>([]);
  const [favouritesData, setFavouritesData] = useState<any[]>([]);

  //Get user favourites from database
  const getFavourites = async (user_id: string) => {
    const response = await fetch('/api/favourites/get/' + user_id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    setFavourites(responseData.data);
    favourites.forEach((favourite: any) => {
      getDataAboutFavourite(favourite.product_id);
    });
  };

  //Get product data with "x" id from api
  const getDataAboutFavourite = async (id: any) => {
    fetch('/api/ap/id/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async response => {
      const responseData = await response.json();

      //This will search if there is already product with same id in favouritesData. Favouritesdata is object of array of objects.
      var isItemInFavourites =
        false ||
        favouritesData.some(object =>
          object.some((item: { product_id: any }) => {
            if (item.product_id == id) return true;
          }),
        );
      //Add product data to favouritesData
      if (!isItemInFavourites) {
        setFavouritesData(favouritesData => [...favouritesData, responseData.data]);
      }
    });
  };

  useEffect(() => {
    getFavourites(authState._id);
  }, [
    //authState._id  makes it re-render when authState changes. This is because authState._id changes to null when user refreshes the page.
    authState._id,
  ]);

  useEffect(() => {
    if (favourites.length > 0) {
      favourites.map((favourite: any) => {
        getDataAboutFavourite(favourite.product_id);
      });
    }
  }, [favourites]);
  return (
    <div id="favouritesPanel">
      <h1>Favourites</h1>
      <ul>
        {favouritesData.length < 1 ? (
          <li>loading data...</li>
        ) : (
          favouritesData.map(object =>
            object.map((product: IProduct, key: Key) => (
              <li key={key} className="favourite">
                <Link to={'/Product/' + product.product_id}>
                  <div className="image">
                    <img src={product.product_image} />
                  </div>
                  <h2 className="text">{product.product_name}</h2>
                </Link>
              </li>
            )),
          )
        )}
      </ul>
    </div>
  );
};

export default Favourites;
