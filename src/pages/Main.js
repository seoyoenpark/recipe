import React from "react";
import './Main.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useGlobalLoading } from '../components/LoadingProvider';

function Main() {
  const navigate = useNavigate();
  const { show, hide } = useGlobalLoading();

  // 재료, 임박 재료, 추천 레시피, 검색 상태
  const [ingredients, setIngredients] = useState([]);
  const [approachingExpiries, setApproachingExpiries] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // 레시피 추천 - 주제,재료
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [topicTags, setTopicTags] = useState([]);
  const [topicInput, setTopicInput] = useState([]);
  const [hasMainIngredient, setHasMainIngredient] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('query') || '';

  const handleTopicInputChange = (e) => {
    setTopicInput(e.target.value);
  };


// searchRecipes 함수
  const searchRecipes = useCallback(async () => {
    if (selectedIngredients.length === 0 && topicTags.length === 0) {
      alert('재료를 선택하거나 주제를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    show();

    const searchData = {
      ingredients: selectedIngredients,
      topics: topicTags,
      hasMainIngredient: hasMainIngredient
    };

    try {
      // API 구현
      await new Promise(res => setTimeout(res, 800));
      const mock = [
        { id: 'r1', title: '추천 레시피 1', image: '/mock/kimchi.jpg' },
        { id: 'r2', title: '추천 레시피 2', image: '/mock/noodle.jpg' },
      ];
      setRecipes(mock);
    } catch (e) {
      console.error(e);
      setRecipes([]);
      alert('레시피를 가져오지 못했어요.');
    } finally {
      setIsSearching(false);
      hide();
    }
  }, [selectedIngredients, topicTags, hasMainIngredient, show, hide]);

  // 재료 목록 불러오기
  useEffect(() => {
    let alive = true;
    async function fetchFridge() {
      show();
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIngredients([]);
          setApproachingExpiries([]);
          hide();
          return;
        }

        // GET /api/ingredients - 보유 식재료 목록 조회
        const res = await fetch('http://localhost:3000/api/ingredients', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error('냉장고 데이터를 불러오지 못했어요');
        }
        
        const data = await res.json();
        if (!alive) return;

        // 백엔드 응답 형식: { success: true, data: [...] }
        const list = Array.isArray(data?.data) ? data.data : [];
        
        // 백엔드 데이터 형식을 프론트엔드 형식으로 변환
        const formattedIngredients = list.map(item => ({
          id: item.id,
          name: item.name,
          expiry: item.expiryDate, // expiryDate → expiry
          quantity: item.quantity_value,
          unit: item.quantity_unit
        }));
        
        setIngredients(formattedIngredients);

      } catch (e) {
        if (!alive) return;
        console.error(e);
        setIngredients([]);
      } finally {
        hide();
      }
    }
    fetchFridge();
    return () => { alive = false; };
  }, [show, hide]);

  // 소비기한 임박 식재료 조회
  useEffect(() => {
    let alive = true;
    async function fetchExpiringIngredients() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setApproachingExpiries([]);
          return;
        }

        // GET /api/ingredients/expiring - 소비기한 임박 식재료 조회
        const res = await fetch('http://localhost:3000/api/ingredients/expiring', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error('임박 식재료 데이터를 불러오지 못했어요');
        }
        
        const data = await res.json();
        if (!alive) return;

        // 백엔드 응답 형식: { success: true, data: [...] }
        const list = Array.isArray(data?.data) ? data.data : [];
        
        // 백엔드 데이터 형식을 프론트엔드 형식으로 변환
        const formattedExpiring = list.map(item => ({
          id: item.id,
          name: item.name,
          expiry: item.expiryDate, // expiryDate → expiry
          quantity: item.quantity_value,
          unit: item.quantity_unit
        }));
        
        setApproachingExpiries(formattedExpiring);

      } catch (e) {
        if (!alive) return;
        console.error(e);
        setApproachingExpiries([]);
      }
    }
    fetchExpiringIngredients();
    return () => { alive = false; };
  }, []);
    
  // 헤더 검색바와 URL 파라미터 연동
  useEffect(() => {
    if (!queryFromUrl) return;
    searchRecipes(queryFromUrl, selectedIngredients);

  }, [queryFromUrl, selectedIngredients, searchRecipes]);

  // 주제 태그 핸들러
  const handleTopicInputKeyPress = (e) => {
    if (e.key == 'Enter' && topicInput.trim()) {
      e.preventDefault();
      if (!topicTags.includes(topicInput.trim())) {
        setTopicTags([...topicTags, topicInput.trim()]);
      }
      setTopicInput('');
    }
  };

  const handleTopicTagDelete = (tagToDelete) => {
    setTopicTags(topicTags.filter(tag => tag !== tagToDelete));
  };

  // 소비기한 임박 식재료는 백엔드 API에서 조회하므로 이 useEffect는 제거됨

  return (
    <main className="MainPage">
      <section className="ingredient-banner">
        <div className="ingredient-header">
        <div className="header-placeholder"></div>
          <h3>지금 나의 냉장고 속 재료는?</h3>
          <Link to="/Myfridge" className="link-to-fridge">더보기</Link>
        </div>
        <div className="ingredient-list">
            {ingredients.length > 0 ? (
                ingredients.map(item => (
                    <button key={item.id} className="ingredient-button selected" type="button">
                        {item.name}
                    </button>
                ))
            ) : (
                <p>냉장고가 비어있어요!</p>
            )}
          </div>
      </section>

      {/* 임박 재료 배너: 데이터 있을 때만 */}
      {approachingExpiries.length > 0 && (
        <section className="expiring-banner">
          <div className="expiring-header">
            <h3>유통기한이 임박했어요!</h3>
          </div>
          <div className="expiring-list">
            {approachingExpiries.map(item => (
              <button key={item.id} className="expiring-button selected" type="button">
                  {item.name}
                </button>
                ))}
          </div>
        </section>
      )}

      {/* 레시피 추천받기 */}
      <section className="recommend-section">
        <div className="recommend-title-section">
          <h3 className="recommend-title">레시피 추천받기</h3>
          <button className="recommend-btn" onClick={searchRecipes} disabled={isSearching}>
              {isSearching ? '검색 중...' : '검색'}
          </button>
         </div>
         <div className="chosse-section">
        {/* 재료 선택 */}
        <div className="ingredient-form">
          <label>재료 선택하기</label>
                <div className="ingredient-pills">
                  {ingredients.map((item) => {
                    const active = selectedIngredients.includes(item.name);
                    return (
                      <button
                        key={item.id}
                        className={`chip ${active ? 'active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault(); // form 제출 방지
                          setSelectedIngredients((prev) =>
                            prev.includes(item.name)
                              ? prev.filter(v => v !== item.name)
                              : [...prev, item.name]
                          );
                        }}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
        {/* 주제 검색 */}
        <div className="recommend-row">
           <label className="row-label">주제 선택하기</label>
           <div className="row-content topic-container">
              <input
                type="text"
                className="topic-input"
                placeholder="텍스트 입력 후 엔터"
                value={topicInput}
                onChange={handleTopicInputChange}
                onKeyPress={handleTopicInputKeyPress}
              />
              <div className="topic-tags-list">
                {topicTags.map((tag, index) => (
                  <span key={index} className="topic-tag">
                    {tag}
                    <button onClick={() => handleTopicTagDelete(tag)}>X</button>
                  </span>
                ))}
              </div>
           </div>
        </div>
        {/* 주재료 유무 선택*/}
        <div className="recommend-row">
          <label className="row-label">주재료 유무 선택하기</label>
          <div className="row-content radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="mainIngredient"
                checked={hasMainIngredient === true}
                onChange={() => setHasMainIngredient(true)}
              />
              주재료 포함하기
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="mainIngredient"
                checked={hasMainIngredient === false}
                onChange={() => setHasMainIngredient(false)}
              />
              주재료 미포함하기
            </label>
          </div>
        </div>

        {/* 결과 리스트 */}
        {recipes.length > 0 && (
          <div className="results-wrap">
            <div className="recipe-grid">
              {recipes.map((rcp) => (
                <article className="recipe-card" key={rcp.id}>
                  <div className="thumb">
                    <img src={rcp.image} alt={rcp.title} loading="lazy" />
                  </div>
                  <h5 className="title">{rcp.title}</h5>
                </article>
              ))}
            </div>
          </div>
        )}
        </div>
      </section>
    </main>
  );
}

export default Main;