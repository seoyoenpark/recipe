import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminHeader.css';

function AdminHeader() {
  const navigate = useNavigate();

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('admin_token'); 
    alert('로그아웃 되었습니다.');
    navigate('/Home'); // 비로그인 메인 페이지로 이동
  };

  return (
    <header className="admin-header-wrapper">
      <div className="admin-header-left"></div>
      <div className="admin-header-center">
        <Link to="/admin" className="admin-header-title-link">
          <h1>냉장고를 부탁해 관리자 페이지</h1>
        </Link>
      </div>
      <div className="admin-header-right">
        <button onClick={handleLogout} className="admin-logout-button">
          로그아웃
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
