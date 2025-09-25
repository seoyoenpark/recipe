import React from 'react';
import './AdminMain.css';

function AdminMain() {
  return (
    <div className="admin-main-container">
      <h2 className="admin-main-title">관리자 대시보드</h2>
      <div className="admin-menu-grid">
        {/* 사용자 관리 카드 */}
          <h3 className="menu-card-title">사용자 관리</h3>
          <p>전체 회원 목록을 조회하고 계정 상태를 관리합니다.</p>

        {/* 레시피 관리 카드 */}
          <h3 className="menu-card-title">레시피 관리</h3>
          <p>등록된 레시피 정보를 상세 조회합니다.</p>
          <p>사용자가 등록한 식재료를 관리합니다.</p>

        {/* 통계 및 분석 카드 */}
          <h3 className="menu-card-title">통계 및 분석</h3>
          <p>서비스 사용 현황과 주요 데이터를 분석합니다.</p>
      </div>
    </div>
  );
}

export default AdminMain;