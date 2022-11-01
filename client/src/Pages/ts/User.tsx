import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../../components/ts/AuthContext';
import { AuthContextType } from '../../@types/AuthContext';
import '../css/User.css';

const User = () => {
  const { authState } = useContext(authContext) as AuthContextType;
  return (
    <div id="mainUser">
      <div className="details">
        <div className="userDataAndFavouritesData">
          <div className="userData">
            <div className="cardHeader">
              <h2>User Data</h2>
              <Link to="/Settings/Account" className="btn">
                Edit Profile
              </Link>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Username</td>
                  <td>
                    <h4>{authState.username}</h4>
                  </td>
                </tr>
                <tr>
                  <td>E-mail</td>
                  <td>
                    <h4>{authState.email}</h4>
                  </td>
                </tr>
                <tr>
                  <td>Role</td>
                  <td>
                    <h4>{authState.role}</h4>
                  </td>
                </tr>
                <tr>
                  <td>Birthday</td>
                  <td>
                    <h4>{authState.birthdate}</h4>
                  </td>
                </tr>
                <tr>
                  <td>Sex</td>
                  <td>
                    <h4>{authState.sex}</h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="favouritesData">
            <div className="cardHeader">
              <h2>Favourites</h2>
              <Link to="/Favourites" className="btn">
                View All
              </Link>
            </div>
            <table>
              <tbody>
                <tr>
                  <td>Image</td>
                  <td>
                    <h4>Amazon Echo 4</h4>
                  </td>
                </tr>
                <tr>
                  <td>Image</td>
                  <td>
                    <h4>Amazon Echo 4</h4>
                  </td>
                </tr>
                <tr>
                  <td>Image</td>
                  <td>
                    <h4>Amazon Echo 4</h4>
                  </td>
                </tr>
                <tr>
                  <td>Image</td>
                  <td>
                    <h4>Amazon Echo 4</h4>
                  </td>
                </tr>
                <tr>
                  <td>Image</td>
                  <td>
                    <h4>Amazon Echo 4</h4>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="recentOrders">
          <div className="cardHeader">
            <h2>Recent Orders</h2>
            <Link to="/" className="btn">
              View All
            </Link>
          </div>
          <table>
            <thead>
              <tr>
                <td>Image</td>
                <td>Name</td>
                <td>Price</td>
                <td>Product ID</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg"
                    alt="product_image"
                  />
                </td>
                <td>
                  AmazonBasics PBH-48914 High-Speed HDMI 2.0 Cable, Ethernet, 3D, 4K Video Playback,
                  and ARC, 3 Pack
                </td>
                <td>11.54$</td>
                <td>B01D5H93FW</td>
              </tr>
              <tr>
                <td>
                  <img
                    src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg"
                    alt="product_image"
                  />
                </td>
                <td>
                  AmazonBasics PBH-48914 High-Speed HDMI 2.0 Cable, Ethernet, 3D, 4K Video Playback,
                  and ARC, 3 Pack
                </td>
                <td>11.54$</td>
                <td>B01D5H93FW</td>
              </tr>
              <tr>
                <td>
                  <img
                    src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg"
                    alt="product_image"
                  />
                </td>
                <td>
                  AmazonBasics PBH-48914 High-Speed HDMI 2.0 Cable, Ethernet, 3D, 4K Video Playback,
                  and ARC, 3 Pack
                </td>
                <td>11.54$</td>
                <td>B01D5H93FW</td>
              </tr>
              <tr>
                <td>
                  <img
                    src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg"
                    alt="product_image"
                  />
                </td>
                <td>
                  AmazonBasics PBH-48914 High-Speed HDMI 2.0 Cable, Ethernet, 3D, 4K Video Playback,
                  and ARC, 3 Pack
                </td>
                <td>11.54$</td>
                <td>B01D5H93FW</td>
              </tr>
              <tr>
                <td>
                  <img
                    src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg"
                    alt="product_image"
                  />
                </td>
                <td>
                  AmazonBasics PBH-48914 High-Speed HDMI 2.0 Cable, Ethernet, 3D, 4K Video Playback,
                  and ARC, 3 Pack
                </td>
                <td>11.54$</td>
                <td>B01D5H93FW</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
