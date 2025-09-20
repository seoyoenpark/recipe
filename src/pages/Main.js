import React from "react";
import './Main.css';
import { useState, useEffect, useCallback } from 'react';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('query') || '';

// searchRecipes 함수
  const searchRecipes = useCallback(async (q, ingredients = []) => {
    setIsSearching(true);
    show();
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
  }, [show, hide]);

  // 재료 목록 불러오기
  useEffect(() => {
    let alive = true;
    async function fetchFridge() {
      show();
      try {
        // API 구현
        const res = await fetch('/api/Myfridge/Myfridge');
        if (!res.ok) {throw new Error('냉장고 데이터를 불러오지 못했어요');}
        const data = await res.json();
        if (!alive) return;

        const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
        setIngredients(list);

      } catch (e) {
        if (!alive) return;
        console.error(e);
        // API 호출 실패 시 더미 데이터
        const dummyIngredients = [
            { id: 1, name: '김치', expiry: '2025-09-20' },
            { id: 2, name: '양파', expiry: '2025-10-05' },
            { id: 3, name: '돼지고기', expiry: '2025-09-18' },
            { id: 4, name: '두부', expiry: '2025-09-22' },
            { id: 5, name: '대파', expiry: '2025-09-25' },
        ];
        setIngredients(dummyIngredients);
      } finally {
        hide();
      }
    }
    fetchFridge();
    return () => { alive = false; };
  }, [show, hide]);
    
  // 헤더 검색바와 URL 파라미터 연동
  useEffect(() => {
    if (!queryFromUrl) return;
    searchRecipes(queryFromUrl, selectedIngredients);

  }, [queryFromUrl, selectedIngredients, searchRecipes]);

  // 로컬 검색 폼 핸들러
  const [localQuery, setLocalQuery] = useState('');
  const handleLocalSearch = async (e) => {
    e.preventDefault();
    const q = localQuery.trim();
    if (!q && selectedIngredients.length === 0) {
      alert('재료를 선택하거나 주제(태그)를 입력해주세요.');
      return;
    }
   
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (q) next.set('query', q); else next.delete('query');
      return next;
    });
    // 실제 검색
    await searchRecipes(q, selectedIngredients);
  };

   // 유통기한 임박 재료 계산
  useEffect(() => {
    const getExpiringIngredients = () => {
        const today = new Date();
        // 오늘부터 3일 후까지의 날짜를 계산
        const threeDaysLater = new Date(today);
        threeDaysLater.setDate(today.getDate() + 3);

        return ingredients.filter(ingredient => {
            if (!ingredient.expiry) return false;
            const expiryDate = new Date(ingredient.expiry);
            // 만료일 3일 이내 재료 필터링
            return expiryDate <= threeDaysLater && expiryDate >= today;
        });
    };
    setApproachingExpiries(getExpiringIngredients());
  }, [ingredients]);

  // 이동 핸들러
  const goMyFridge = () => navigate('/Myfridge');

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
        <h3 className="recommend-title">레시피 추천받기</h3>
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
        <form className="inline-search" onSubmit={handleLocalSearch}>
          <label>주제 선택하기</label>
          <input
            type="search"
            placeholder="요리의 주제를 검색해 보세요"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
          <button type="submit" disabled={isSearching}>
            {isSearching ? '검색 중…' : '검색'}
          </button>
        </form>

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
      </section>
    </main>
  );
}

export default Main;