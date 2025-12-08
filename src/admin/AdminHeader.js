import React from 'react';
import './AdminHeader.css';
import logo from '../img/logo.jpg';
import { useNavigate } from 'react-router-dom';

function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/Home');
  };

  return (
    <div className="admin-header-wrapper">
      <div className="admin-header-left">
        <img src={logo} alt="냉장고를 부탁해" className="admin-header-logo" />
      </div>

      <h1 className="admin-header-title">냉장고를 부탁해 관리자 페이지</h1>

      <div className="admin-header-right">
        <button className="admin-logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default AdminHeader;
