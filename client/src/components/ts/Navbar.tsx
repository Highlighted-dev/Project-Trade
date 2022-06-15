import React, { ChangeEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import { FC } from 'react';
import {
  AiFillBank,
  AiOutlineSearch,
  AiOutlineMenu,
  AiOutlineUser,
  AiOutlineBarChart,
  AiOutlineShoppingCart,
  AiOutlineHeart,
} from 'react-icons/ai';
import { BsChatDots, BsGrid } from 'react-icons/bs';
import { BiCog } from 'react-icons/bi';
import '../css/navbar.css';
import { Link } from 'react-router-dom';

const Navbar: FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');
  const [isFetching, setIsFetching] = React.useState(false);

  useEffect(() => {
    if (isFetching) {
      const searchbar = document.querySelector('.searchBar');
      const requestOptions = {
        method: 'GET',
      };
      //Fetch request is only made if searchWord is not empty string
      if (searchWord != '') {
        //Get product data with "x" name from api
        fetch('/api/ap/name/' + searchWord, requestOptions)
          .then(async response => setData(await response.json()))
          .catch(() => {
            //Delete all data if there is nothing found in database and hide searchbox
            setData(['{}']), searchbar?.classList.remove('active');
          });
      } else {
        setData(['{}']), searchbar?.classList.remove('active');
      }

      setIsFetching(false);
    }
  }, [searchWord]);

  const toggleMenu: MouseEventHandler = () => {
    const sidebar = document.querySelector('.sidebar');
    const navbar = document.querySelector('.navbar');
    sidebar?.classList.toggle('active');
    navbar?.classList.toggle('active');
  };

  //Perform search every time user input changes
  const search: ChangeEventHandler = () => {
    const searchbar = document.querySelector('.searchBar');
    searchbar?.classList.add('active');
    setIsFetching(true);
  };
  return (
    <div className="navbar">
      <div className="topbar">
        <div className="searchBar">
          <AiOutlineSearch className="searchIcon" />
          <input
            type="text"
            className="searchBox"
            placeholder="Search..."
            onChange={e => {
              setSearchWord(e.target.value);
              search(e);
            }}
            value={searchWord}
          ></input>
          {searchWord.length > 0 ? (
            <div className="searchResults">
              {data.map((product, key) => (
                <Link to={'/Product/' + product.product_id} key={key}>
                  <li key={key}>{product.product_name}</li>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div className="Avatar">
          <img
            src={process.env.PUBLIC_URL + '/images/Avatar.png'}
            alt="image"
            height="40px"
            width="40px"
          />
        </div>
      </div>
      <div className="sidebar">
        <div className="logo_content">
          <div className="logo">
            <AiFillBank style={{ fontSize: '1.6rem', marginRight: '6px' }} />
            <div className="logo-name">ProjectTrade</div>
          </div>
          <AiOutlineMenu className="menu" onClick={toggleMenu} />
        </div>
        <ul>
          <li>
            <Link to="/">
              <div className="icon">
                <BsGrid />
              </div>
              <span className="links_name">Dashboard</span>
            </Link>
            <span className="tooltip">Dashboard</span>
          </li>
          <li>
            <a href="">
              <div className="icon">
                <AiOutlineUser />
              </div>
              <span className="links_name">User</span>
            </a>
            <span className="tooltip">User</span>
          </li>
          <li>
            <a href="">
              <div className="icon">
                <BsChatDots />
              </div>
              <span className="links_name">Messages</span>
            </a>
            <span className="tooltip">Messages</span>
          </li>
          <li>
            <a href="">
              <div className="icon">
                <AiOutlineBarChart />
              </div>
              <span className="links_name">Charts</span>
            </a>
            <span className="tooltip">Charts</span>
          </li>
          <li>
            <a href="">
              <div className="icon">
                <AiOutlineShoppingCart />
              </div>
              <span className="links_name">Order</span>
            </a>
            <span className="tooltip">Order</span>
          </li>
          <li>
            <a href="">
              <div className="icon">
                <AiOutlineHeart />
              </div>
              <span className="links_name">Favourites</span>
            </a>
            <span className="tooltip">Favourites</span>
          </li>
          <li>
            <a href="">
              <div className="icon">
                <BiCog />
              </div>
              <span className="links_name">Settings</span>
            </a>
            <span className="tooltip">Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
