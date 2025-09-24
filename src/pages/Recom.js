import React, { useState, useRef, useEffect } from 'react';
import './Recom.css';

function Recom() {
  // 로그인 권한 확인 (현재 주석 처리)
  // const isAuthenticated = () => !!localStorage.getItem('token');
  
  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     alert('로그인이 필요한 서비스입니다.');
  //     window.location.href = '/login';
  //   }
  // }, []);

  // 냉장고 재료 데이터 (서버 연결 전 더미 데이터)
  const [ingredientPages, setIngredientPages] = useState([
    ['토마토', '양파', '당근', '감자', '브로콜리', '파프리카', '마늘', '생강', '대파', '시금치'],
    ['배추', '무', '오이', '상추', '깻잎', '버섯', '계란', '우유', '닭고기', '돼지고기'],
    ['소고기', '새우', '두부', '콩나물', '고추', '피망', '가지', '호박', '당근', '양배추']
  ]);

  // 현재 재료 페이지
  const [currentIngredientPage, setCurrentIngredientPage] = useState(0);
  
  // 선택된 재료들
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  
  // 주제 태그들
  const [topicTags, setTopicTags] = useState([]);
  const [topicInput, setTopicInput] = useState('');
  
  // 주재료 유무 체크박스 (기본값: 주재료 O)
  const [hasMainIngredient, setHasMainIngredient] = useState(true);
  
  const topicInputRef = useRef(null);
  
  // 검색 상태 및 레시피 데이터
  const [hasSearched, setHasSearched] = useState(false);
  const [recipes, setRecipes] = useState([]);
  
  // 임시 레시피 데이터
  const dummyRecipes = [
    {
      id: 1,
      name: '레시피 이름',
      description: '레시피에 대한 간단한 설명',
      details: '레시피 재료',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=120&h=100&fit=crop&crop=center'
    },
    {
      id: 2,
      name: '레시피 이름',
      description: '레시피에 대한 간단한 설명', 
      details: '레시피 재료',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=100&fit=crop&crop=center'
    },
    {
      id: 3,
      name: '레시피 이름',
      description: '레시피에 대한 간단한 설명',
      details: '레시피 재료',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=120&h=100&fit=crop&crop=center'
    },
    {
      id: 4,
      name: '레시피 이름',
      description: '레시피에 대한 간단한 설명',
      details: '레시피 재료',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=120&h=100&fit=crop&crop=center'
    },
    {
      id: 5,
      name: '레시피 이름', 
      description: '레시피에 대한 간단한 설명',
      details: '레시피 재료',
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=120&h=100&fit=crop&crop=center'
    },
    {
      id: 6,
      name: '레시피 이름',
      description: '레시피에 대한 간단한 설명',
      details: '레시피 재료',
      image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=120&h=100&fit=crop&crop=center'
    }
  ];

  // 서버에서 재료 데이터 가져오기
  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ingredients');
      if (response.ok) {
        const data = await response.json();
        // 데이터를 페이지별로 나누기 (한 페이지당 10개)
        const pages = [];
        for (let i = 0; i < data.length; i += 10) {
          pages.push(data.slice(i, i + 10));
        }
        setIngredientPages(pages);
      }
    } catch (error) {
      console.log('서버 연결 실패, 더미 데이터 사용');
      // 서버 연결 실패 시 기존 더미 데이터 유지
    }
  };

  // 재료 선택/해제 처리
  const handleIngredientSelect = (ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  // 주제 입력 처리
  const handleTopicInputChange = (e) => {
    setTopicInput(e.target.value);
  };

  // 주제 태그 추가 (엔터키)
  const handleTopicInputKeyPress = (e) => {
    if (e.key === 'Enter' && topicInput.trim()) {
      if (!topicTags.includes(topicInput.trim())) {
        setTopicTags([...topicTags, topicInput.trim()]);
      }
      setTopicInput('');
    }
  };

  // 주제 태그 삭제
  const handleTopicTagDelete = (tagToDelete) => {
    setTopicTags(topicTags.filter(tag => tag !== tagToDelete));
  };

  // 레시피 카드 클릭 시 상세 페이지로 이동
  const handleRecipeClick = (recipeId) => {
    window.location.href = `/RecipeDetail/${recipeId}`;
  };
  const handleNextIngredientPage = () => {
    if (currentIngredientPage < ingredientPages.length - 1) {
      setCurrentIngredientPage(currentIngredientPage + 1);
    }
  };

  const handlePrevIngredientPage = () => {
    if (currentIngredientPage > 0) {
      setCurrentIngredientPage(currentIngredientPage - 1);
    }
  };

  // 검색 버튼 클릭
  const handleSearch = async () => {
    // 재료 선택 검증
    if (selectedIngredients.length === 0) {
      alert('재료를 하나 이상 선택해주세요!');
      return;
    }

    console.log('검색 실행');
    
    const searchData = {
      ingredients: selectedIngredients,
      topics: topicTags,
      hasMainIngredient: hasMainIngredient
    };

    try {
      const response = await fetch('http://localhost:3001/api/recipes/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData)
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
        setHasSearched(true);
      }
    } catch (error) {
      console.log('검색 API 호출 실패, 더미 데이터 사용');
      // 서버 연결 실패 시 더미 데이터 사용
      setRecipes(dummyRecipes);
      setHasSearched(true);
    }
  };

  return (
    <div className="recom-container">
      {/* 재료 선택하기 섹션 */}
      <div className="section-bar">
        <div className="section-title">재료 선택하기</div>
        {currentIngredientPage > 0 && (
          <button 
            className="navigation-button"
            onClick={handlePrevIngredientPage}
          >
            ←
          </button>
        )}
        <div className="ingredient-tags-wrapper">
          {ingredientPages[currentIngredientPage] && ingredientPages[currentIngredientPage].map((ingredient, index) => (
            <button
              key={index}
              className={`ingredient-tag ${selectedIngredients.includes(ingredient) ? 'selected' : ''}`}
              onClick={() => handleIngredientSelect(ingredient)}
            >
              {ingredient}
            </button>
          ))}
        </div>
        {currentIngredientPage < ingredientPages.length - 1 && (
          <button 
            className="navigation-button"
            onClick={handleNextIngredientPage}
          >
            →
          </button>
        )}
      </div>

      {/* 주제 선택하기 섹션 */}
      <div className="section-bar">
        <div className="section-title">주제 선택하기</div>
        <div className="topic-input-container">
          <input
            ref={topicInputRef}
            type="text"
            value={topicInput}
            onChange={handleTopicInputChange}
            onKeyPress={handleTopicInputKeyPress}
            placeholder="엔터로 입력"
            className="topic-input"
            maxLength={5}
          />
          <div className="topic-tags">
            {topicTags.map((tag, index) => (
              <div key={index} className="topic-tag">
                {tag}
                <button 
                  className="topic-tag-delete"
                  onClick={() => handleTopicTagDelete(tag)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주재료 유무 섹션 */}
      <div className="section-bar">
        <div className="section-title">주재료 유무</div>
        <div className="radio-container">
          <label className="checkbox-label">
            <span className="checkbox-text">주재료 O</span>
            <div 
              className={`custom-checkbox ${hasMainIngredient ? 'checked' : ''}`}
              onClick={() => setHasMainIngredient(true)}
            >
              {hasMainIngredient && <span className="checkmark">✓</span>}
            </div>
          </label>
          <label className="checkbox-label">
            <span className="checkbox-text">주재료 X</span>
            <div 
              className={`custom-checkbox ${!hasMainIngredient ? 'checked' : ''}`}
              onClick={() => setHasMainIngredient(false)}
            >
              {!hasMainIngredient && <span className="checkmark">✓</span>}
            </div>
          </label>
        </div>
      </div>

      {/* 레시피 섹션 */}
      <div className="recipe-section">
        <div className="search-btn-container">
          <button className="search-btn" onClick={handleSearch}>검색</button>
        </div>
        
        {!hasSearched ? (
          <div className="empty-recipe-container">
            <div className="empty-recipe-message">
              <div className="empty-title">아직 추천 레시피가 없습니다!</div>
              <div className="empty-subtitle">원하는 재료와 주제를 선택한 뒤 검색 버튼을 눌러 레시피를 추천받아 보세요</div>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default Recom;