import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recom.css';

function Recom() {
  const navigate = useNavigate();

  const [ingredientPages, setIngredientPages] = useState([
    ['토마토', '양파', '당근', '감자', '브로콜리'],
    ['파프리카', '마늘', '생강', '대파', '시금치'],
    ['배추', '무', '오이', '상추', '깻잎'],
    ['버섯', '계란', '우유', '닭고기', '돼지고기'],
    ['소고기', '새우', '두부', '콩나물', '고추'],
    ['피망', '가지', '호박', '당근', '양배추']
  ]);
  const [currentIngredientPage, setCurrentIngredientPage] = useState(0);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [topicTags, setTopicTags] = useState([]);
  const [topicInput, setTopicInput] = useState('');
  const [hasMainIngredient, setHasMainIngredient] = useState(true);
  const topicInputRef = useRef(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [previousRecipes, setPreviousRecipes] = useState([]); // 이전 레시피 상태 추가

  const dummyRecipes = [
    { id: 1, name: '레시피 1', description: '설명 1', details: '재료 A, B', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop&crop=center', views: 150 },
    { id: 2, name: '레시피 2', description: '설명 2', details: '재료 C, D', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop&crop=center', views: 120 },
    { id: 3, name: '레시피 3', description: '설명 3', details: '재료 E, F', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop&crop=center', views: 110 },
    { id: 4, name: '레시피 4', description: '설명 4', details: '재료 G, H', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=200&fit=crop&crop=center', views: 90 },
    { id: 5, name: '레시피 5', description: '설명 5', details: '재료 I, J', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop&crop=center', views: 85 },
    { id: 6, name: '레시피 6', description: '설명 6', details: '재료 K, L', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=300&h=200&fit=crop&crop=center', views: 70 },
    { id: 7, name: '레시피 7', description: '설명 7', details: '재료 M, N', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop&crop=center', views: 60 },
    { id: 8, name: '레시피 8', description: '설명 8', details: '재료 O, P', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop&crop=center', views: 50 },
    { id: 9, name: '레시피 9', description: '설명 9', details: '재료 Q, R', image: 'https://images.unsplash.com/photo-1481931715705-36f3be9e6b0b?w=300&h=200&fit=crop&crop=center', views: 40 }
  ];

  useEffect(() => {
    fetchIngredients();
    fetchPreviousRecipes(); // 이전 레시피 불러오기
  }, []);

  const fetchIngredients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/ingredients', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        // 데이터를 페이지별로 나누기 (한 페이지당 10개)
        const pages = [];
        for (let i = 0; i < data.length; i += 10) {
          pages.push(data.slice(i, i + 10).map(item => item.name || item));
        }
        if (pages.length > 0) {
          setIngredientPages(pages);
        }
      }
    } catch (error) {
      console.log('서버 연결 실패, 더미 데이터 사용');
    }
  };

  // 이전 레시피 불러오기 함수
  const fetchPreviousRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/recipes/history', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.data || [];
        setPreviousRecipes(data);
      }
    } catch (error) {
      // 서버 연결 실패 시 빈 배열 유지 (디폴트)
      setPreviousRecipes([]);
    }
  };

  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleTopicInputChange = (e) => setTopicInput(e.target.value);

  const handleTopicInputKeyPress = (e) => {
    if (e.key === 'Enter' && topicInput.trim()) {
      if (!topicTags.includes(topicInput.trim())) setTopicTags([...topicTags, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleTopicTagDelete = (tagToDelete) => setTopicTags(topicTags.filter(tag => tag !== tagToDelete));

  const handleRecipeClick = (recipeId) => {
    const ingredientsParam = selectedIngredients.join(',');
    navigate(`/RecipeDetail/${recipeId}?ingredients=${encodeURIComponent(ingredientsParam)}`);
  };

  const handleNextIngredientPage = () => {
    if (currentIngredientPage < ingredientPages.length - 1) setCurrentIngredientPage(currentIngredientPage + 1);
  };

  const handlePrevIngredientPage = () => {
    if (currentIngredientPage > 0) setCurrentIngredientPage(currentIngredientPage - 1);
  };

  const handleSearch = async () => {
    if (selectedIngredients.length === 0) {
      alert('재료를 하나 이상 선택해주세요!');
      return;
    }
    
    try {
      // 백엔드의 /api/recipes/recommend API 사용 (POST)
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/recipes/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          query: {
            queryText: topicTags.join(' '),
            selectedIngredientIds: selectedIngredients, // 재료 이름 배열 (백엔드에서 ID로 변환 필요)
          },
          requireMain: hasMainIngredient,
        })
      });

      if (response.ok) {
        const result = await response.json();
        const recipes = result.data || result;
        setRecipes(recipes);
        setHasSearched(true);
      } else {
        const errorData = await response.json();
        alert(errorData.message || '레시피 검색에 실패했습니다.');
      }
    } catch (error) {
      console.log('검색 API 호출 실패, 더미 데이터 사용');
      // 서버 연결 실패 시 더미 데이터 사용
      setRecipes(dummyRecipes);
      setHasSearched(true);
    }
  };

  // ranking slider state & refs
  const rankingPerPage = 3;
  const [rankPage, setRankPage] = useState(0);
  const rankingRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const sortedRanking = [...dummyRecipes].sort((a,b) => b.views - a.views);

  const totalRankPages = Math.ceil(sortedRanking.length / rankingPerPage);

  const goToRankPage = (pageIndex) => {
    const clamped = Math.max(0, Math.min(pageIndex, totalRankPages -1));
    setRankPage(clamped);
    const container = rankingRef.current;
    if (container) {
      const width = container.clientWidth;
      container.scrollTo({ left: clamped * width, behavior: 'smooth' });
    }
  };

  const handleRankNext = () => goToRankPage(rankPage + 1);
  const handleRankPrev = () => goToRankPage(rankPage - 1);

  useEffect(() => {
    const container = rankingRef.current;
    if (!container) return;
    const handleResize = () => {
      goToRankPage(rankPage);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line
  }, []);

  const onRankMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - rankingRef.current.offsetLeft;
    scrollLeftStart.current = rankingRef.current.scrollLeft;
  };
  const onRankMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - rankingRef.current.offsetLeft;
    const walk = (startX.current - x);
    rankingRef.current.scrollLeft = scrollLeftStart.current + walk;
  };
  const onRankMouseUp = () => {
    isDragging.current = false;
    const container = rankingRef.current;
    if (!container) return;
    const page = Math.round(container.scrollLeft / container.clientWidth);
    setRankPage(Math.max(0, Math.min(page, totalRankPages-1)));
  };

  // 이전 레시피 slider state & refs
  const previousPerPage = 3;
  const [prevPage, setPrevPage] = useState(0);
  const previousRef = useRef(null);
  const isPrevDragging = useRef(false);
  const prevStartX = useRef(0);
  const prevScrollLeftStart = useRef(0);

  const totalPrevPages = Math.ceil(previousRecipes.length / previousPerPage);

  const goToPrevPage = (pageIndex) => {
    const clamped = Math.max(0, Math.min(pageIndex, totalPrevPages - 1));
    setPrevPage(clamped);
    const container = previousRef.current;
    if (container) {
      const width = container.clientWidth;
      container.scrollTo({ left: clamped * width, behavior: 'smooth' });
    }
  };

  const handlePrevNext = () => goToPrevPage(prevPage + 1);
  const handlePrevPrev = () => goToPrevPage(prevPage - 1);

  const onPrevMouseDown = (e) => {
    isPrevDragging.current = true;
    prevStartX.current = e.pageX - previousRef.current.offsetLeft;
    prevScrollLeftStart.current = previousRef.current.scrollLeft;
  };
  const onPrevMouseMove = (e) => {
    if (!isPrevDragging.current) return;
    e.preventDefault();
    const x = e.pageX - previousRef.current.offsetLeft;
    const walk = (prevStartX.current - x);
    previousRef.current.scrollLeft = prevScrollLeftStart.current + walk;
  };
  const onPrevMouseUp = () => {
    isPrevDragging.current = false;
    const container = previousRef.current;
    if (!container) return;
    const page = Math.round(container.scrollLeft / container.clientWidth);
    setPrevPage(Math.max(0, Math.min(page, totalPrevPages - 1)));
  };

  return (
    <div className="recom-container">
      <div className="recom-section-bar">
        <div className="recom-section-title">재료 선택하기</div>
        {currentIngredientPage > 0 && (
          <button className="recom-navigation-button" onClick={handlePrevIngredientPage}>‹</button>
        )}
        <div className="recom-ingredient-tags-wrapper">
          {ingredientPages[currentIngredientPage] && ingredientPages[currentIngredientPage].map((ingredient, index) => (
            <button
              key={index}
              className={`recom-ingredient-tag ${selectedIngredients.includes(ingredient) ? 'selected' : ''}`}
              onClick={() => handleIngredientSelect(ingredient)}
            >
              {ingredient}
            </button>
          ))}
        </div>
        {currentIngredientPage < ingredientPages.length - 1 && (
          <button className="recom-navigation-button" onClick={handleNextIngredientPage}>›</button>
        )}
      </div>

      <div className="recom-section-bar">
        <div className="recom-section-title">주제 선택하기</div>
        <div className="recom-topic-input-container">
          <input
            ref={topicInputRef}
            type="text"
            value={topicInput}
            onChange={handleTopicInputChange}
            onKeyPress={handleTopicInputKeyPress}
            placeholder="엔터로 입력"
            className="recom-topic-input"
            maxLength={20}
          />
          <div className="recom-topic-tags">
            {topicTags.map((tag, index) => (
              <div key={index} className="recom-topic-tag">
                {tag}
                <button className="recom-topic-tag-delete" onClick={() => handleTopicTagDelete(tag)}>×</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recom-section-bar">
        <div className="recom-section-title">주재료 유무 선택하기</div>
        <div className="radio-container">
          <label className="checkbox-label">
            <span className="checkbox-text">주재료 포함하기</span>
            <div 
              className={`custom-checkbox ${hasMainIngredient ? 'checked' : ''}`}
              onClick={() => setHasMainIngredient(true)}
            >
              {hasMainIngredient && <span className="checkmark">✓</span>}
            </div>
          </label>
          <label className="checkbox-label">
            <span className="checkbox-text">주재료 미포함하기</span>
            <div 
              className={`custom-checkbox ${!hasMainIngredient ? 'checked' : ''}`}
              onClick={() => setHasMainIngredient(false)}
            >
              {!hasMainIngredient && <span className="checkmark">✓</span>}
            </div>
          </label>
        </div>
      </div>

      <div className="recipe-section">
        <div className="search-btn-container">
          <button className="search-btn" onClick={handleSearch}>검색</button>
        </div>

        {/* 레시피 랭킹 섹션 - 항상 표시 */}
        <div className="ranking-section">
          <h3 className="ranking-title">🍳 가장 조회수가 많은 레시피 랭킹</h3>

          <div className="ranking-slider-wrapper">
            <button 
              className="rank-nav left" 
              onClick={handleRankPrev} 
              disabled={rankPage === 0}
            >
              ‹
            </button>

            <div
              className="ranking-slider"
              ref={rankingRef}
              onMouseDown={onRankMouseDown}
              onMouseMove={onRankMouseMove}
              onMouseLeave={onRankMouseUp}
              onMouseUp={onRankMouseUp}
              onTouchStart={(e) => { onRankMouseDown(e.touches[0]); }}
              onTouchMove={(e) => { onRankMouseMove(e.touches[0]); }}
              onTouchEnd={onRankMouseUp}
            >
              {sortedRanking.map((r) => (
                <div 
                  key={r.id} 
                  className="recipe-card ranking-card"
                  onClick={() => handleRecipeClick(r.id)}
                >
                  <img src={r.image} alt={r.name} className="recipe-image" />
                  <div className="recipe-info">
                    <h4 className="recipe-name">{r.name}</h4>
                    <p className="recipe-description">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="rank-nav right" 
              onClick={handleRankNext}
              disabled={rankPage >= totalRankPages - 1}
            >
              ›
            </button>
          </div>
        </div>

        {/* 조건부 렌더링 */}
        {hasSearched ? (
          // 2번 케이스: 검색 후 추천 레시피 표시
          <>
            <div className="section-divider"></div>
            <div className="recommended-section">
              <h3 className="recommended-title">🍳 추천 레시피</h3>
              <div className="recipe-grid-container">
                {recipes.map((recipe) => (
                  <div 
                    key={recipe.id} 
                    className="recipe-card" 
                    onClick={() => handleRecipeClick(recipe.id)}
                  >
                    <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                    <div className="recipe-info">
                      <h4 className="recipe-name">{recipe.name}</h4>
                      <p className="recipe-description">{recipe.description}</p>
                      <p className="recipe-details">{recipe.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : previousRecipes.length > 0 ? (
          // 3번 케이스: 이전 레시피 표시
          <>
            <div className="section-divider"></div>
            <div className="previous-recipe-section">
              <h3 className="previous-recipe-title">🍳 이전에 보셨던 레시피는 어떠신가요?</h3>

              <div className="previous-recipe-slider-wrapper">
                <button 
                  className="prev-nav left" 
                  onClick={handlePrevPrev} 
                  disabled={prevPage === 0}
                >
                  ‹
                </button>

                <div
                  className="previous-recipe-slider"
                  ref={previousRef}
                  onMouseDown={onPrevMouseDown}
                  onMouseMove={onPrevMouseMove}
                  onMouseLeave={onPrevMouseUp}
                  onMouseUp={onPrevMouseUp}
                  onTouchStart={(e) => { onPrevMouseDown(e.touches[0]); }}
                  onTouchMove={(e) => { onPrevMouseMove(e.touches[0]); }}
                  onTouchEnd={onPrevMouseUp}
                >
                  {previousRecipes.map((r) => (
                    <div 
                      key={r.id} 
                      className="recipe-card previous-recipe-card"
                      onClick={() => handleRecipeClick(r.id)}
                    >
                      <img src={r.image} alt={r.name} className="recipe-image" />
                      <div className="recipe-info">
                        <h4 className="recipe-name">{r.name}</h4>
                        <p className="recipe-description">{r.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="prev-nav right" 
                  onClick={handlePrevNext}
                  disabled={prevPage >= totalPrevPages - 1}
                >
                  ›
                </button>
              </div>
            </div>
          </>
        ) : (
          // 1번 케이스: 빈 박스 표시
          <div className="empty-recipe-container">
            <div className="empty-recipe-message">
              <div className="empty-title">아직 추천 레시피가 없습니다!</div>
              <div className="empty-subtitle">
                원하는 재료와 주제를 선택한 뒤 검색 버튼을 눌러 레시피를 추천받아 보세요
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recom;
