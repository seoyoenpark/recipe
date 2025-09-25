import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNav.css';

function AdminNav() {
  return (
    <nav className="admin-nav-wrapper">
      {/* 사용자 관리 메뉴 */}
      <div className="admin-nav-item">
        <NavLink to="/admin/AdminUser" className="main-menu-link">사용자 관리</NavLink>
        <ul className="submenu">
          <li><NavLink to="/admin/AdminUser">사용자 목록 상세 조회 및 계정 상태 관리</NavLink></li>
        </ul>
      </div>

      {/* 레시피 관리 메뉴 */}
      <div className="admin-nav-item">
        <NavLink to="레시피 관리" className="main-menu-link">레시피 관리</NavLink>
        <ul className="submenu">
          <li><NavLink to="레시피 상세 정보 조회">레시피 상세 정보 조회</NavLink></li>
          <li><NavLink to="식재료 관리">식재료 관리</NavLink></li>
        </ul>
      </div>

      {/* 통계 및 분석 메뉴 */}
      <div className="admin-nav-item">
        <NavLink to="통계 및 분석" className="main-menu-link">통계 및 분석</NavLink>
        <ul className="submenu">
          <li><NavLink to="식재료 통계">식재료 통계</NavLink></li>
          <li><NavLink to="레시피 통계">레시피 통계</NavLink></li>
          <li><NavLink to="AI 모델 분석">AI 모델 분석</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNav;