import { NavLink } from "react-router-dom";
import React from 'react';
import './Nav.css';

function Nav() {
  return (
    <nav className="navbar">
      <NavLink 
        className={({ isActive }) => isActive ? "navbarMenu active" : "navbarMenu"} 
        to="/Myfridge">나의 냉장고</NavLink>
      <NavLink 
        className={({ isActive }) => isActive ? "navbarMenu active" : "navbarMenu"} 
        to="/Recom">레시피 추천</NavLink>
      <NavLink 
        className={({ isActive }) => isActive ? "navbarMenu active" : "navbarMenu"} 
        to="/Mypage">마이페이지</NavLink>
    </nav>
  );
}

export default Nav;