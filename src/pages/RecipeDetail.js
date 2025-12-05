import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const [recipeData, setRecipeData] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState([]); // 사용자가 선택했던 재료들
  const [ingredientQuantities, setIngredientQuantities] = useState({}); // 재료별 수량
  const [availableIngredients, setAvailableIngredients] = useState([]); // 냉장고 재료들
  const [additionalIngredientCount, setAdditionalIngredientCount] = useState(0); // 추가 재료 행 개수
  
  // 더미 데이터
  const dummyRecipe = {
    id: 1,
    name: '김치볶음밥',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    description: '김치와 밥을 볶아서 만드는 간단하고 맛있는 요리',
    ingredients: '김치, 밥, 계란, 대파, 참기름',
    cookingTools: '팬, 주걱, 그릇',
    steps: [
      {
        order: 1,
        title: '재료 준비하기',
        description: '김치는 적당한 크기로 썰고, 대파는 송송 썰어 준비합니다. 계란은 그릇에 풀어둡니다.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop'
      },
      {
        order: 2,
        title: '김치 볶기',
        description: '팬에 기름을 두르고 김치를 먼저 볶아 신맛을 날려줍니다.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop'
      },
      {
        order: 3,
        title: '밥 넣고 볶기',
        description: '볶은 김치에 밥을 넣고 골고루 섞어가며 볶아줍니다.',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop'
      }
    ]
  };

  // 냉장고 재료 더미 데이터 (수량 포함)
  const dummyFridgeIngredients = [
    { name: '토마토', quantity: '3개' },
    { name: '양파', quantity: '2개' },
    { name: '우유', quantity: '500ml' },
    { name: '계란', quantity: '10개' },
    { name: '당근', quantity: '1개' },
    { name: '감자', quantity: '4개' },
    { name: '김치', quantity: '200g' },
    { name: '대파', quantity: '1대' },
    { name: '마늘', quantity: '5쪽' },
    { name: '생강', quantity: '50g' },
    { name: '브로콜리', quantity: '1개' },
    { name: '파프리카', quantity: '2개' },
    { name: '시금치', quantity: '100g' },
    { name: '닭고기', quantity: '300g' },
    { name: '돼지고기', quantity: '250g' },
    { name: '두부', quantity: '1모' },
    { name: '콩나물', quantity: '200g' },
    { name: '버섯', quantity: '150g' }
  ];

  // 수량 옵션 더미 데이터 - 단위만 분리
  const unitOptions = ['개', 'g', 'ml', 'L', '쪽', '대', '모', 'kg', '컵', '큰술', '작은술'];

  // 수량을 숫자와 단위로 분리하는 함수
  const parseQuantity = (quantityStr) => {
    if (!quantityStr) return { number: '', unit: '' };
    
    const match = quantityStr.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (match) {
      return { number: match[1], unit: match[2] || '' };
    }
    return { number: '', unit: quantityStr };
  };

  // 숫자와 단위를 합쳐서 수량 문자열로 만드는 함수
  const combineQuantity = (number, unit) => {
    if (!number) return '';
    return `${number}${unit}`;
  };

  useEffect(() => {
    fetchRecipeDetail();
    // URL에서 선택된 재료 정보를 가져오기 (실제로는 localStorage나 state management 사용)
    const searchParams = new URLSearchParams(window.location.search);
    const ingredients = searchParams.get('ingredients');
    if (ingredients) {
      const selectedItems = ingredients.split(',');
      setSelectedIngredients(selectedItems);
      
      // 선택된 재료들의 초기 수량을 냉장고 데이터에서 설정
      const initialQuantities = {};
      selectedItems.forEach((ingredient, index) => {
        const fridgeItem = dummyFridgeIngredients.find(item => item.name === ingredient);
        if (fridgeItem) {
          const parsed = parseQuantity(fridgeItem.quantity);
          initialQuantities[`selected-${index}`] = {
            name: ingredient,
            number: parsed.number,
            unit: parsed.unit
          };
        }
      });
      setIngredientQuantities(initialQuantities);
    } else {
      // 더미 데이터로 설정 (실제로는 이전 페이지에서 전달받아야 함)
      const dummySelected = ['김치', '계란', '대파'];
      setSelectedIngredients(dummySelected);
      
      // 더미 선택 재료들의 초기 수량 설정
      const initialQuantities = {};
      dummySelected.forEach((ingredient, index) => {
        const fridgeItem = dummyFridgeIngredients.find(item => item.name === ingredient);
        if (fridgeItem) {
          const parsed = parseQuantity(fridgeItem.quantity);
          initialQuantities[`selected-${index}`] = {
            name: ingredient,
            number: parsed.number,
            unit: parsed.unit
          };
        }
      });
      setIngredientQuantities(initialQuantities);
    }
    
    setAvailableIngredients(dummyFridgeIngredients);
  }, [id]);

  const fetchRecipeDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setRecipeData(data);
      }
    } catch (error) {
      console.log('서버 연결 실패, 더미 데이터 사용');
      setRecipeData(dummyRecipe);
    }
  };

  // 선택된 재료 변경
  const handleSelectedIngredientChange = (index, selectedIngredient) => {
    const ingredient = availableIngredients.find(ing => ing.name === selectedIngredient);
    if (ingredient) {
      const parsed = parseQuantity(ingredient.quantity);
      setIngredientQuantities(prev => ({
        ...prev,
        [`selected-${index}`]: {
          name: ingredient.name,
          number: parsed.number,
          unit: parsed.unit
        }
      }));
      
      // selectedIngredients 배열도 업데이트
      const newSelectedIngredients = [...selectedIngredients];
      newSelectedIngredients[index] = ingredient.name;
      setSelectedIngredients(newSelectedIngredients);
    }
  };

  // 추가 재료 선택하기 드롭다운에서 재료 선택
  const handleAdditionalIngredientSelect = (index, selectedIngredient) => {
    const ingredient = availableIngredients.find(ing => ing.name === selectedIngredient);
    if (ingredient) {
      const parsed = parseQuantity(ingredient.quantity);
      setIngredientQuantities(prev => ({
        ...prev,
        [`additional-${index}`]: {
          name: ingredient.name,
          number: parsed.number,
          unit: parsed.unit
        }
      }));
    }
  };

  // 수량 숫자 변경
  const handleNumberChange = (key, newNumber) => {
    setIngredientQuantities(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        number: newNumber
      }
    }));
  };

  // 단위 변경
  const handleUnitChange = (key, newUnit) => {
    setIngredientQuantities(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        unit: newUnit
      }
    }));
  };

  // 새로운 재료 선택 행 추가
  const addNewIngredientRow = () => {
    setAdditionalIngredientCount(prev => prev + 1);
  };

  // 재료 수량 저장
  const handleSaveQuantities = () => {
    console.log('저장된 재료 수량:', ingredientQuantities);
    alert('저장되었습니다.');
  };

  if (!recipeData) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="recipe-detail-container">
      <div className="main-content">
        {/* 레시피 기본 정보 */}
        <div className="recipe-info-section">
          <div className="recipe-image-container">
            <img src={recipeData.image} alt={recipeData.name} className="recipe-image-fixed" />
          </div>
          <div className="recipe-text-info">
            <h1 className="recipe-name">{recipeData.name}</h1>
            <p className="recipe-description">{recipeData.description}</p>
            <div className="recipe-ingredients">
              <strong>재료:</strong> {recipeData.ingredients}
            </div>
            <div className="recipe-tools">
              <strong>조리도구:</strong> {recipeData.cookingTools}
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="section-divider"></div>

        {/* 나의 냉장고 수량 조절하기 */}
        <div className="fridge-quantity-section">
          <h2 className="section-title">나의 냉장고 수량 조절하기</h2>
          
          {/* 선택했던 재료들 */}
          {selectedIngredients.map((ingredient, index) => (
            <div key={`selected-${index}`} className="quantity-row">
              <select 
                className="ingredient-select"
                value={ingredientQuantities[`selected-${index}`]?.name || ingredient}
                onChange={(e) => handleSelectedIngredientChange(index, e.target.value)}
              >
                <option value="">재료 선택하기</option>
                {availableIngredients.map((ing, i) => (
                  <option key={i} value={ing.name}>{ing.name}</option>
                ))}
              </select>
              <div className="quantity-input-group">
                <input
                  type="number"
                  className="quantity-number-input"
                  placeholder="수량"
                  value={ingredientQuantities[`selected-${index}`]?.number || ''}
                  onChange={(e) => handleNumberChange(`selected-${index}`, e.target.value)}
                />
                <select 
                  className="unit-select"
                  value={ingredientQuantities[`selected-${index}`]?.unit || ''}
                  onChange={(e) => handleUnitChange(`selected-${index}`, e.target.value)}
                >
                  <option value="">단위</option>
                  {unitOptions.map((unit, i) => (
                    <option key={i} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* 추가 재료 선택 */}
          {Array.from({ length: additionalIngredientCount }, (_, index) => (
            <div key={`additional-${index}`} className="quantity-row">
              <select 
                className="ingredient-select"
                value={ingredientQuantities[`additional-${index}`]?.name || ''}
                onChange={(e) => handleAdditionalIngredientSelect(index, e.target.value)}
              >
                <option value="">재료 선택하기</option>
                {availableIngredients.map((ingredient, i) => (
                  <option key={i} value={ingredient.name}>{ingredient.name}</option>
                ))}
              </select>
              <div className="quantity-input-group">
                <input
                  type="number"
                  className="quantity-number-input"
                  placeholder="수량"
                  value={ingredientQuantities[`additional-${index}`]?.number || ''}
                  onChange={(e) => handleNumberChange(`additional-${index}`, e.target.value)}
                />
                <select 
                  className="unit-select"
                  value={ingredientQuantities[`additional-${index}`]?.unit || ''}
                  onChange={(e) => handleUnitChange(`additional-${index}`, e.target.value)}
                >
                  <option value="">단위</option>
                  {unitOptions.map((unit, i) => (
                    <option key={i} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* 재료 선택하기 기본 드롭다운 */}
          <div className="quantity-row">
            <select 
              className="ingredient-select"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  addNewIngredientRow();
                  handleAdditionalIngredientSelect(additionalIngredientCount, e.target.value);
                }
              }}
            >
              <option value="">재료 선택하기</option>
              {availableIngredients.map((ingredient, i) => (
                <option key={i} value={ingredient.name}>{ingredient.name}</option>
              ))}
            </select>
            <div className="placeholder-quantity-group">
              <span className="placeholder-text">수량과 단위를 선택하세요</span>
            </div>
          </div>

          <div className="save-button-container">
            <button className="save-button" onClick={handleSaveQuantities}>저장</button>
          </div>
        </div>

        {/* 구분선 */}
        <div className="section-divider"></div>

        {/* 조리 순서 */}
        <div className="cooking-steps-section">
          <h2 className="section-title">조리 순서</h2>
          {recipeData.steps.map((step, index) => (
            <div key={index} className="cooking-step">
              <img src={step.image} alt={`${step.order}번째 단계`} className="step-image" />
              <div className="step-content">
                <h3 className="step-order">{step.order}번째</h3>
                <h4 className="step-title">{step.title}</h4>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;