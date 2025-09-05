import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="header-container-wrapper">
      <div className="header-flex-placeholder-left"></div>
      <div className="headerContainer">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="headerTitle">냉장고를 부탁해</h1>
        </Link>
  
      </div>
      <div className="header-auth-buttons">
        <Link to="/Userlogin" className="auth-button"> 
          <button>로그인</button>
        </Link>
        <Link to="/Register" className="auth-button"> 
          <button>회원가입</button>
        </Link>
      </div>
    </div>
  );
}

export default Header;