import React from "react";
import './Main.css';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGlobalLoading } from '../components/LoadingProvider';

function Main() {
  const navigate = useNavigate();
  const { show, hide } = useGlobalLoading();

  // 임박 재료, 추천 레시피, 검색 상태
  const [approachingExpiries, setApproachingExpiries] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 선택 재료/태그 등의 검색 조건
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get('query') || '';

  // 1) 페이지 진입 시 임박 재료 로드
  useEffect(() => {
    let alive = true;
    async function loadApproaching() {
      show();
      try {
        const res = await fetch('/api/Myfridge/expiring', { credentials: 'include' });
        if (!res.ok) throw new Error('expiring fetch failed');
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        // const list = [
        //   { id: 1, name: '김', dday: 2 },
        //   { id: 2, name: '양상추', dday: 3 },
        // ];
        if (!alive) return;
        setApproachingExpiries(list);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setApproachingExpiries([]);
      } finally {
        hide();
      }
    }
    loadApproaching();
    return () => { alive = false; };
  }, [show, hide]);

  // 검색 실행
  const searchRecipes = async (q, ingredients = []) => {
    setIsSearching(true);
    show();
    try {
      // API 구현
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (ingredients.length) params.set('ingredients', ingredients.join(','));
      const res = await fetch(`/api/recommend?${params.toString()}`);
      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      setRecipes(items);

      // 더미데이터
      await new Promise(res => setTimeout(res, 800));
      const mock = [
        { id: 'r1', title: '김치볶음밥', image: '/mock/kimchi.jpg' },
        { id: 'r2', title: '비빔국수', image: '/mock/noodle.jpg' },
        { id: 'r3', title: '해물파전', image: '/mock/pajeon.jpg' },
        { id: 'r4', title: '해물', image: '/mock/seafood.jpg' },
        { id: 'r5', title: '전', image: '/mock/jeon.jpg' },
      ];
      setRecipes(mock);
    } catch (e) {
      console.error(e);
      setRecipes([]);
      alert('추천을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSearching(false);
      hide();
    }
  };

  // 3) 헤더 검색바와 URL 파라미터 연동(옵션)
  // Header에서 onSearch(q) 호출 시, /Main에서 query를 URL에 반영하고 현재 페이지 내에서 검색을 수행할 수 있게 하려면
  // App의 Header onSearch에서 navigate(`/recom?...`) 대신 navigate(`/Main?query=${q}`)를 사용하세요.
  useEffect(() => {
    if (!queryFromUrl) return;
    // URL로 들어온 검색어로 검색
    searchRecipes(queryFromUrl, selectedIngredients);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryFromUrl]);

  // 4) 로컬 검색 폼(메인 콘텐츠 내 버튼과 연동)
  const [localQuery, setLocalQuery] = useState('');
  const handleLocalSearch = async (e) => {
    e.preventDefault();
    const q = localQuery.trim();
    if (!q && selectedIngredients.length === 0) {
      alert('레시피를 검색해보세요');
      return;
    }
    // URL 반영(선택): 헤더와 일관된 UX
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (q) next.set('query', q); else next.delete('query');
      return next;
    });
    // 실제 검색
    await searchRecipes(q, selectedIngredients);
  };

  // 5) 임박 재료 표시용 계산
  const expiringPreview = useMemo(
    () => approachingExpiries.slice(0, 6),
    [approachingExpiries]
  );

  // 이동 핸들러
  const goMyFridge = () => navigate('/Myfridge');

  return (
    <main className="MainPage">
      {/* 상단 섹션: 카테고리 안내 등 필요 시 유지 */}

      {/* 임박 재료 배너: 데이터 있을 때만 렌더 */}
      {approachingExpiries.length > 0 && (
        <section className="expiring-banner">
          <div className="expiring-header">
            <h3>유통기한이 임박했어요!</h3>
          </div>
          <ul className="expiring-list">
            {expiringPreview.map(item => (
              <li key={item.id || item.name} className="pill">
                <span className="name">{item.name}</span>
                {typeof item.dday === 'number' && <span className="dday">D-{item.dday}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 레시피 추천받기 */}
      <section className="recommend-section">
        <h3 className="section-title">레시피 추천받기</h3>

        {/* 재료 선택 영역 */}
        <div className="ingredient-pills">
          {['재료1', '재료2', '재료3', '재료4', '재료5', '재료6'].map((name) => {
            const active = selectedIngredients.includes(name);
            return (
              <button
                key={name}
                className={`chip ${active ? 'active' : ''}`}
                onClick={() =>
                  setSelectedIngredients((prev) =>
                    prev.includes(name) ? prev.filter(v => v !== name) : [...prev, name]
                  )
                }
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* 검색 바(메인 내부 – 헤더 검색바와 별개로 동작) */}
        <form className="inline-search" onSubmit={handleLocalSearch}>
          <input
            type="search"
            placeholder="레시피나 재료로 검색해 보세요"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
          <button type="submit" disabled={isSearching}>
            {isSearching ? '검색 중…' : '검색'}햣
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

        {/* 빈 상태 메시지(선택) */}
        {recipes.length === 0 && !isSearching && (
          <p className="empty-hint">원하는 재료를 선택하거나 키워드를 입력해 검색해 보세요.</p>
        )}
      </section>
    </main>
  );
}

export default Main;