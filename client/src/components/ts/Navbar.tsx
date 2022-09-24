import React, { ChangeEventHandler, useContext, useEffect, useState } from 'react';
import {
  AiFillBank,
  AiOutlineSearch,
  AiOutlineUser,
  AiOutlineBarChart,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineEdit,
} from 'react-icons/ai';
import { BsGrid } from 'react-icons/bs';
import { BiCog, BiLogOutCircle } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';
import '../css/navbar.css';
import { Link } from 'react-router-dom';
import { authContext } from './AuthContext';
import { AuthContextType } from '../../@types/AuthContext';
import { IProduct } from '../../@types/ProductPageTemplate';

const Navbar = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');
  const [isFetching, setIsFetching] = React.useState(false);
  const { authState, logout } = useContext(authContext) as AuthContextType;
  useEffect(() => {
    if (isFetching) {
      const searchbar = document.querySelector('.searchBar');
      const requestOptions = {
        method: 'GET',
      };
      // Fetch request is only made if searchWord is not empty string
      if (searchWord !== '') {
        // Get product data with "x" name from api
        fetch(`/api/ap/name/${searchWord}`, requestOptions)
          .then(async response => setData(await response.json()))
          .catch(() => {
            // Delete all data if there is nothing found in database and hide searchbox
            setData([]);
            searchbar?.classList.remove('active');
          });
      } else {
        setData([]);
        searchbar?.classList.remove('active');
      }

      setIsFetching(false);
    }
  }, [searchWord]);

  const toggleUserPanel = (class_name: string) => {
    const avatar = document.querySelector(`.${class_name}`);
    avatar?.classList.toggle('active');
  };

  // Perform search every time user input changes
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
          />
          {searchWord.length > 0 ? (
            <div className="searchResults">
              {data.map(product => (
                <Link to={`/Product/${product.product_id}`} key={product.product_id}>
                  <li key={product.product_id}>{product.product_name}</li>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <div id="user">
          <div className="avatar">
            <img
              src={`${process.env.PUBLIC_URL}/images/Avatar.png`}
              alt="avatar"
              height="40px"
              width="40px"
              onClick={() => toggleUserPanel('userMenu')}
            />
          </div>
          <div className="userMenu">
            <h3>
              {authState.username ? authState.username : 'User'}
              <br />
              <span>{authState.role ? authState.role : 'User'}</span>
            </h3>
            {authState._id ? (
              <ul>
                <li>
                  <CgProfile className="icons" />
                  <Link to="/User">My Profile</Link>
                </li>
                <li>
                  <AiOutlineEdit className="icons" />
                  <Link to="/">Edit Profile</Link>
                </li>
                <li>
                  <FiSettings className="icons" />
                  <Link to="/">Settings</Link>
                </li>
                <li>
                  <BiLogOutCircle className="icons" />
                  <a onClick={logout}>Logout</a>
                </li>
              </ul>
            ) : (
              <ul>
                <li>
                  <Link to="/Login">
                    <button type="button">Login</button>
                  </Link>
                </li>
                <li>
                  <Link to="/Register">
                    <button type="button">Register</button>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="sidebar">
        <div className="logo_content">
          <AiFillBank className="menu" />
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
            <Link to="/User">
              <div className="icon">
                <AiOutlineUser />
              </div>
              <span className="links_name">User</span>
            </Link>
            <span className="tooltip">User</span>
          </li>
          <li>
            <Link to="/">
              <div className="icon">
                <AiOutlineBarChart />
              </div>
              <span className="links_name">Charts</span>
            </Link>
            <span className="tooltip">Charts</span>
          </li>
          <li>
            <Link to="/">
              <div className="icon">
                <AiOutlineShoppingCart />
              </div>
              <span className="links_name">Order</span>
            </Link>
            <span className="tooltip">Order</span>
          </li>
          <li>
            <Link to="/Favourites">
              <div className="icon">
                <AiOutlineHeart />
              </div>
              <span className="links_name">Favourites</span>
            </Link>
            <span className="tooltip">Favourites</span>
          </li>
          <li>
            <Link to="/">
              <div className="icon">
                <BiCog />
              </div>
              <span className="links_name">Settings</span>
            </Link>
            <span className="tooltip">Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
