import React, { MouseEventHandler } from 'react'
import { FC } from 'react';
import {AiFillBank,AiOutlineSearch, AiOutlineMenu, AiOutlineUser, AiOutlineBarChart, AiOutlineShoppingCart, AiOutlineHeart} from "react-icons/ai";
import {BsChatDots, BsGrid} from 'react-icons/bs'
import {BiCog} from 'react-icons/bi';
import '../css/navbar.css'

const Navbar: FC = () => {
   
    const btnClick: MouseEventHandler = () =>{
        const sidebar  = document.querySelector('.sidebar');
        const navbar  = document.querySelector('.navbar');
        sidebar?.classList.toggle('active');
        navbar?.classList.toggle('active');
    }
    return (
        <div className='navbar'>
        <div className='topbar'>
            <AiOutlineSearch className='searchIcon'/>
            <input type="text" className='searchBox' placeholder='Search...'></input>
            <img src={process.env.PUBLIC_URL+"/images/Avatar.png"} alt='image' height="40px" width="40px"/>
        </div>
        <div className='sidebar'>
            <div className='logo_content'>
                <div className='logo'>
                    <AiFillBank  style={{fontSize: '1.6rem',marginRight: '6px'}} />
                    <div className='logo-name'>ProjectTrade</div>
                </div>
            <AiOutlineMenu className='menu' onClick={btnClick}/>
            </div>
            <ul>
                <li>
                <a href=''>
                    <div className='icon'><BsGrid /></div>
                    <span className='links_name'>Dashboard</span>
                </a>
                <span className='tooltip'>Dashboard</span>
                </li>
                <li>
                <a href=''>
                    <div className='icon'><AiOutlineUser /></div>
                    <span className='links_name'>User</span>
                </a>
                <span className='tooltip'>User</span>
                </li>
                <li>
                <a href=''>
                    <div className='icon'><BsChatDots /></div>
                    <span className='links_name'>Messages</span>
                </a>
                <span className='tooltip'>Messages</span>
                </li>
                <li>
                <a href=''>
                    <div className='icon'><AiOutlineBarChart /></div>
                    <span className='links_name'>Charts</span>
                </a>
                <span className='tooltip'>Charts</span>
                </li>
                <li>
                <a href=''>
                    <div className='icon'><AiOutlineShoppingCart /></div>
                    <span className='links_name'>Order</span>
                </a>
                <span className='tooltip'>Order</span>
                </li>
                <li>
                <a href=''>
                    <div className='icon'><AiOutlineHeart /></div>
                    <span className='links_name'>Favourites</span>
                </a>
                <span className='tooltip'>Favourites</span>
                </li>
                <li>
                <a href=''>
                    <div className='icon'><BiCog /></div>
                    <span className='links_name'>Settings</span>
                </a>
                <span className='tooltip'>Settings</span>
                </li>
            </ul>
        </div>
        </div>
    )
    
}

export default Navbar
