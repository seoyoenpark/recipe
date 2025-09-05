import { NavLink } from "react-router-dom";
import React from 'react';
import './Nav.css';

function Nav() {
  return (
    <nav className="navbar">
      <NavLink 
        className={({ isActive }) => isActive ? "navbarMenu active" : "navbarMenu"} 
        to="/myrefrig">나의 냉장고</NavLink>
      <NavLink 
        className={({ isActive }) => isActive ? "navbarMenu active" : "navbarMenu"} 
        to="/recom">레시피 추천</NavLink>
      <NavLink 
        className={({ isActive }) => isActive ? "navbarMenu active" : "navbarMenu"} 
        to="/mypage">마이페이지</NavLink>
    </nav>
  );
}

export default Nav;