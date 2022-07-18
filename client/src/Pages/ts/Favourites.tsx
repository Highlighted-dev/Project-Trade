import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../components/ts/AuthContext';

const Favourites = () => {
  const { authState } = useContext(AuthContext);
  const [favourites, setFavourites] = useState<any[]>([]);
  const getFavourites = async (user_id: string) => {
    const response = await fetch('/api/favourites/get/' + user_id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    setFavourites(responseData.data);
  };
  useEffect(() => {
    getFavourites(authState._id);
  }, []);
  return (
    <div>
      <h1>Favourites</h1>
      <ul>
        {favourites.length < 2 ? (
          <li>loading data...</li>
        ) : (
          favourites.map((item, key) => (
            <li key={key}>
              <h2>{item.product_id}</h2>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Favourites;
