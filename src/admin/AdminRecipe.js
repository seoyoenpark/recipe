import React, { useState, useEffect } from 'react';
import './AdminRecipe.css';

// 더미 데이터
const dummyRecipes = [
  { 
    id: 1, 
    name: '김치찌개', 
    ingredients: '김치, 돼지고기, 두부, 파', 
    tools: '냄비', 
    tags: '한식, 찌개', 
    allergy: '없음',
    description: '매콤하고 시원한 김치찌개입니다.',
    cookTime: '30분',
    difficulty: '쉬움',
    steps: [
      '김치를 볶는다',
      '물을 넣고 끓인다',
      '돼지고기와 두부를 넣는다',
      '간을 맞춘다'
    ],
    completedImage: 'https://picsum.photos/600/300?random=31',
    stepImages: [
      'https://picsum.photos/180/120?random=32',
      'https://picsum.photos/180/120?random=33',
      'https://picsum.photos/180/120?random=34',
      'https://picsum.photos/180/120?random=35'
    ]
  },
  { 
    id: 2, 
    name: '파스타', 
    ingredients: '면, 토마토소스, 마늘, 올리브오일', 
    tools: '냄비, 팬', 
    tags: '양식, 면요리', 
    allergy: '글루텐',
    description: '간단하고 맛있는 토마토 파스타입니다.',
    cookTime: '20분',
    difficulty: '보통',
    steps: [
      '면을 삶는다',
      '마늘을 볶는다',
      '토마토소스를 넣는다',
      '면과 섞어 완성'
    ],
    completedImage: 'https://via.placeholder.com/600x300/e17055/ffffff?text=완성된+파스타',
    stepImages: [
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step1',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step2',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step3',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step4'
    ]
  },
  { 
    id: 3, 
    name: '계란볶음밥', 
    ingredients: '밥, 계란, 파, 당근, 간장', 
    tools: '팬', 
    tags: '한식, 볶음밥', 
    allergy: '없음',
    description: '간단하고 맛있는 계란볶음밥입니다.',
    cookTime: '15분',
    difficulty: '쉬움',
    steps: [
      '계란을 스크램블한다',
      '야채를 볶는다',
      '밥을 넣어 볶는다',
      '간장으로 간을 맞춘다'
    ],
    completedImage: 'https://via.placeholder.com/600x300/fdcb6e/ffffff?text=완성된+계란볶음밥',
    stepImages: [
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step1',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step2',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step3',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step4'
    ]
  },
  { 
    id: 4, 
    name: '치킨커리', 
    ingredients: '닭고기, 양파, 커리가루, 코코넛밀크', 
    tools: '냄비', 
    tags: '양식, 커리', 
    allergy: '없음',
    description: '진한 맛의 치킨커리입니다.',
    cookTime: '45분',
    difficulty: '어려움',
    steps: [
      '닭고기를 볶는다',
      '양파를 볶는다',
      '커리가루를 넣는다',
      '코코넛밀크로 끓인다'
    ],
    completedImage: 'https://via.placeholder.com/600x300/f39c12/ffffff?text=완성된+치킨커리',
    stepImages: [
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step1',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step2',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step3',
      'https://via.placeholder.com/180x120/cccccc/333333?text=180x120px+Step4'
    ]
  },
];

// 숫자를 한글로 변환하는 함수
const numberToKorean = (num) => {
  const korean = ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  return korean[num - 1] || `${num}`;
};

function AdminRecipe() {
  const [allRecipes, setAllRecipes] = useState(dummyRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    // 서버에서 레시피 데이터를 가져오는 로직
    // 현재는 더미 데이터 사용
  }, []);

  const handleRowClick = (recipe) => {
    setSelectedRecipe({...recipe});
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="admin-recipe-container">
      <h2>레시피 목록 상세 조회 및 관리</h2>

      {/* 레시피 정보 테이블 */}
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
          {allRecipes.map((recipe, index) => (
            <tr key={recipe.id} onClick={() => handleRowClick(recipe)} style={{ cursor: 'pointer' }}>
              <td>{index + 1}</td>
              <td>{recipe.name}</td>
              <td>{recipe.ingredients}</td>
              <td>{recipe.tools}</td>
              <td>{recipe.tags}</td>
              <td>{recipe.allergy}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 상세 정보 팝업 */}
      {isPopupOpen && selectedRecipe && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>레시피 상세 정보</h3>
              <button className="close-btn" onClick={handleClosePopup}>×</button>
            </div>
            
            <div className="popup-body">
              {/* 완성된 음식 이미지 */}
              <div className="completed-image-container">
                <img 
                  src={selectedRecipe.completedImage} 
                  alt={selectedRecipe.name}
                  className="completed-image"
                />
              </div>

              {/* 레시피명 */}
              <div className="recipe-title">
                <h2>{selectedRecipe.name}</h2>
              </div>

              {/* 조리 순서 */}
              <div className="cooking-steps">
                {selectedRecipe.steps.map((step, index) => (
                  <div key={index} className="step-container">
                    <div className="step-image">
                      <img 
                        src={selectedRecipe.stepImages[index]} 
                        alt={`${index + 1}단계`}
                      />
                    </div>
                    <div className="step-content">
                      <div className="step-number">
                        {numberToKorean(index + 1)}번째
                      </div>
                      <div className="step-description">
                        {step}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminRecipe;