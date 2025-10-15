import React from "react";
import './Footer.css'
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h4 className="footer-title">냉장고를 부탁해</h4>
          <p className="copyright-text">&copy; 방구석 자취생 All rights reserved.</p>
          <p className="porject-description">사용자의 식재료와 알레르기, 조리도구까지 반영해 AI가 추천해주는 레시피 추천 서비스</p>
        </div>
        <div className="footer-section team-credits">
          <h4 className="footer-title">Project By 방구석 자취생</h4>
          <ul className="credits-list">
            <li><strong>Front-end:</strong> 박서연, 조다민</li>
            <li><strong>Back-end:</strong> 이시윤</li>
            <li><strong>AI:</strong> 김준경, 유상원</li>
          </ul>
        </div>
        <div className="footer-section links">
          <h4 className="footer-title">바로가기</h4>
          <ul className="footer-links">
            <li><Link to="/Myfridge">나의 냉장고</Link></li>
            <li><Link to="/Recom">레시피 추천</Link></li>
            <li><Link to="/Mypage">마이페이지</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;