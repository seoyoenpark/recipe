/* 비로그인 상태의 메인 페이지 */
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import book from '../img/book.png';
import bell from '../img/yellow bell.png';
import camera from '../img/yellow camera.png';
import ingredients from '../img/ingredients.png';

function Home() {
  return (
    <main className="Maincontent">
    <section className="Introduce">
      <div className="intro">
        <p>냉장고 속 식재료, AI가 맞춤형 레시피로 바꿔드립니다!<br></br>
          나의 식재료, 나만의 맞춤 레시피<br></br>
          내 냉장고에 딱 맞는 요리를 추천받으세요<br></br>
          냉장고 속 재료, 더 이상 고민하지 말고 요리하세요<br></br>
          남은 재료, 버리지 말고 요리로
        </p>
      </div>
      <div className="imagecontent">
        <img src={ingredients} alt="재료가 있는 냉장고 이미지" />
      </div>
    </section>
    <p className="featuretitle">주요 기능</p>
    <section className="feature">
      <div className="feature-items-wrapper">
        <article className="feature-item">
            <img src={camera} alt="재료 등록 아이콘" />
            <h3>재료 등록</h3>
            <p>재료 사진을 찍어 등록하거나 수기로 직접 등록할 수 있어요</p>
          </article>
          <article className="feature-item">
            <img src={book} alt="레시피 추천 아이콘" />
            <h3>레시피 추천</h3>
            <p>AI를 통해 사용자가 등록한 재료와 알레르기, 조리도구까지 반영해 추천해요</p>
          </article>
          <article className="feature-item">
            <img src={bell} alt="임박 재료 알림 아이콘" />
            <h3>임박 재료 알림</h3>
            <p>재료 소비 기한이 임박한 재료가 있을 때 알려줘요</p>
          </article>
        </div>
    </section>
    <section className="user-flow">
        <h3>단계별 서비스 이용 과정을 살펴보세요</h3>
        <div className="steps">
          <div className="step-circle">회원가입</div>
          <div className="step-arrow">→</div>
          <div className="step-circle">개인 맞춤 정보 등록</div>
          <div className="step-arrow">→</div>
          <div className="step-circle">재료 등록</div>
        </div>
      </section>
      <Link to="/Register" className="start-button">시작하기</Link>
    </main>
  );
}

export default Home;