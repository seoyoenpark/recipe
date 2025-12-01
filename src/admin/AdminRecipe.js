import React, { useState, useEffect } from 'react';
import './AdminRecipe.css';

// 더미 데이터 (이미지 URL 제거)
const dummyRecipes = [
  { 
    id: 1, 
    name: '김치찌개', 
    ingredients: '김치, 돼지고기, 두부, 파', 
    tools: '냄비', 
    tags: '한식, 찌개', 
    allergy: '없음',
    cookTime: '30분',
    steps: [
      '김치를 볶는다',
      '물을 넣고 끓인다',
      '돼지고기와 두부를 넣는다',
      '간을 맞춘다'
    ],
    completedImage: null, // 서버에서 받아올 예정
    stepImages: [null, null, null, null] // 서버에서 받아올 예정
  },
  { 
    id: 2, 
    name: '파스타', 
    ingredients: '면, 토마토소스, 마늘, 올리브오일', 
    tools: '냄비, 팬', 
    tags: '양식, 면요리', 
    allergy: '글루텐',
    cookTime: '20분',
    steps: [
      '면을 삶는다',
      '마늘을 볶는다',
      '토마토소스를 넣는다',
      '면과 섞어 완성'
    ],
    completedImage: null,
    stepImages: [null, null, null, null]
  }
];

// 숫자 → 첫·두·세 번째 변환
const numberToKorean = (num) => {
  const korean = ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  return korean[num - 1] || `${num}`;
};

function AdminRecipe() {
  const [allRecipes, setAllRecipes] = useState(dummyRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 10;

  useEffect(() => {}, []);

  // 현재 페이지의 레시피 계산
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = allRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(allRecipes.length / recipesPerPage);

  // 페이지 변경 핸들러
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleRowClick = (recipe) => {
    setSelectedRecipe({ ...recipe });
    setIsPopupOpen(true);
    setIsEditMode(false);
  };

  const handleOverlayClick = () => {
    setIsPopupOpen(false);
    setSelectedRecipe(null);
    setIsEditMode(false);
  };

  // 삭제 기능
  const handleDelete = () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    setAllRecipes(allRecipes.filter(r => r.id !== selectedRecipe.id));
    setIsPopupOpen(false);
  };

  // 수정 → 저장
  const handleSave = () => {
    setAllRecipes(prev =>
      prev.map(r => (r.id === selectedRecipe.id ? selectedRecipe : r))
    );
    setIsEditMode(false);
  };

  // 이미지 에러 핸들러 - placeholder 표시
  const handleImageError = (e) => {
    e.target.style.display = 'block';
    e.target.src = '';
    e.target.style.backgroundColor = '#f0f0f0';
  };

  return (
    <div className="admin-recipe-container">
      <h2>레시피 목록 상세 조회 및 관리</h2>

      {/* ============= 테이블 컨테이너 ============= */}
      <div className="recipe-table-container">
        <table className="recipe-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>레시피 이름</th>
              <th>재료</th>
              <th>조리도구</th>
              <th>주제(태그)</th>
              <th>알레르기</th>
            </tr>
          </thead>
          <tbody>
            {currentRecipes.map((recipe, index) => (
              <tr
                key={recipe.id}
                onClick={() => handleRowClick(recipe)}
                style={{ cursor: 'pointer' }}
              >
                <td>{indexOfFirstRecipe + index + 1}</td>
                <td>{recipe.name}</td>
                <td>{recipe.ingredients}</td>
                <td>{recipe.tools}</td>
                <td>{recipe.tags}</td>
                <td>{recipe.allergy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            이전
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            다음
          </button>
        </div>
      </div>

      {/* ================= 팝업 ================= */}
      {isPopupOpen && selectedRecipe && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>

            {/* 상단 영역 (이미지 + 레시피 정보) */}
            <div className="top-section">

              {/* 메인 이미지 (placeholder 지원) */}
              <img
                src={selectedRecipe.completedImage || ''}
                alt={selectedRecipe.name}
                className="popup-main-image"
                onError={handleImageError}
              />

              {/* 레시피 정보 블록 */}
              <div className="recipe-info-block">
                {isEditMode ? (
                  <>
                    <input
                      type="text"
                      value={selectedRecipe.name}
                      onChange={(e) => setSelectedRecipe({...selectedRecipe, name: e.target.value})}
                      placeholder="레시피 이름"
                    />
                    <label>태그</label>
                    <input
                      type="text"
                      value={selectedRecipe.tags}
                      onChange={(e) => setSelectedRecipe({...selectedRecipe, tags: e.target.value})}
                      placeholder="태그"
                    />
                    <label>조리도구</label>
                    <input
                      type="text"
                      value={selectedRecipe.tools}
                      onChange={(e) => setSelectedRecipe({...selectedRecipe, tools: e.target.value})}
                      placeholder="조리도구"
                    />
                    <label>알레르기</label>
                    <input
                      type="text"
                      value={selectedRecipe.allergy}
                      onChange={(e) => setSelectedRecipe({...selectedRecipe, allergy: e.target.value})}
                      placeholder="알레르기"
                    />
                    <label>조리 시간</label>
                    <input
                      type="text"
                      value={selectedRecipe.cookTime}
                      onChange={(e) => setSelectedRecipe({...selectedRecipe, cookTime: e.target.value})}
                      placeholder="조리 시간"
                    />
                  </>
                ) : (
                  <>
                    <h2>{selectedRecipe.name}</h2>
                    <h4>주제(태그)</h4>
                    <p>{selectedRecipe.tags}</p>

                    <h4>조리도구</h4>
                    <p>{selectedRecipe.tools}</p>

                    <h4>알레르기</h4>
                    <p>{selectedRecipe.allergy}</p>

                    <h4>조리 시간</h4>
                    <p>{selectedRecipe.cookTime}</p>
                  </>
                )}
              </div>
            </div>

            {/* 조리 단계 */}
            <div className="cooking-steps">
              {selectedRecipe.steps.map((step, index) => (
                <div key={index} className="step-container">

                  <div className="step-image">
                    <img
                      src={selectedRecipe.stepImages[index] || ''}
                      alt={`${index + 1}단계`}
                      onError={handleImageError}
                    />
                  </div>

                  <div className="step-content">
                    {isEditMode ? (
                      <>
                        <label>{index + 1}단계</label>
                        <textarea
                          value={selectedRecipe.steps[index]}
                          onChange={(e) => {
                            const updated = [...selectedRecipe.steps];
                            updated[index] = e.target.value;
                            setSelectedRecipe({...selectedRecipe, steps: updated});
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <div className="step-number">
                          {numberToKorean(index + 1)}번째
                        </div>
                        <div className="step-description">{step}</div>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>

            {/* ========== 팝업 하단 버튼 ========== */}
            <div className="popup-footer">

              {/* 삭제 버튼 */}
              <button className="delete-btn" onClick={handleDelete}>
                삭제
              </button>

              {/* 수정 / 저장 버튼 */}
              {!isEditMode ? (
                <button className="edit-btn" onClick={() => setIsEditMode(true)}>
                  수정
                </button>
              ) : (
                <button className="save-btn" onClick={handleSave}>
                  저장
                </button>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRecipe;