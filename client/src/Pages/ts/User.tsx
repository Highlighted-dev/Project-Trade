import React, { useContext } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiLogOutCircle } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { FiSettings } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../components/ts/AuthContext';
import '../css/User.css';
const User = () => {
  const { authState, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      logout();
      navigate('/Login');
    } catch {
      console.log('Something went wrong when trying to logout');
    }
  };
  return (
    <div id="mainUser">
      <div className="cardBox">
        <div className="card">
          <div className="text">Profile</div>

          <div className="iconBox">
            <CgProfile />
          </div>
        </div>
        <div className="card">
          <div className="text">Edit</div>
          <div className="iconBox">
            <AiOutlineEdit />
          </div>
        </div>
        <div className="card">
          <div className="text">Settings</div>
          <div className="iconBox">
            <FiSettings className="icons" />
          </div>
        </div>
        <div className="card">
          <div className="text">Logout</div>

          <div className="iconBox">
            <BiLogOutCircle className="icons" />
          </div>
        </div>
      </div>
      <div className="details">
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
                  <img src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg" />
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
                  <img src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg" />
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
                  <img src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg" />
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
                  <img src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg" />
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
                  <img src="https://m.media-amazon.com/images/I/41rfLGvgLxL._AC_US40_.jpg" />
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
        <div className="userData">
          <div className="cardHeader">
            <h2>User Data</h2>
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
                  <h4>Admin</h4>
                </td>
              </tr>
              <tr>
                <td>Birthday</td>
                <td>
                  <h4>00-00-0000</h4>
                </td>
              </tr>
              <tr>
                <td>Sex</td>
                <td>
                  <h4>Male</h4>
                </td>
              </tr>
              <tr>
                <td>Username</td>
                <td>
                  <h4>Bartosz</h4>
                </td>
              </tr>
              <tr>
                <td>Username</td>
                <td>
                  <h4>Bartosz</h4>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
