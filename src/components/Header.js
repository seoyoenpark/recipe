import React from 'react';
import './Header.css';
import { Link, useNavigate  } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  // 로그인 상태 확인
  const isAuthenticated = () => !!localStorage.getItem('token');
  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Home');
  };

  return (
    <div className="header-container-wrapper">
      <div className="header-flex-placeholder-left"></div>
      <div className="headerContainer">
        <Link to={isAuthenticated() ? "/Main" : "/Home"} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="headerTitle">냉장고를 부탁해</h1>
        </Link>
      </div>
      <div className="header-auth-buttons">
        {isAuthenticated() ? (
          <button className='auth-button' onClick={handleLogout}>로그아웃</button>
        ) : (
          <>
          <Link to="/Userlogin" className="auth-button"> 
          <button>로그인</button>
          </Link>
          <Link to="/Register" className="auth-button"> 
          <button>회원가입</button>
          </Link>
          </>
          )}
      </div>
    </div>
  );
}

export default Header;