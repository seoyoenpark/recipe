import React, { useState } from 'react';
import './IngredientRegistration.css';
import Stage from '../components/Stage';
import { useNavigate } from 'react-router-dom';

function IngredientRegistration() {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    expiry: '',
    quantity: 1
  });
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const navigate = useNavigate();

  // 수량 옵션들 (숫자만, 넉넉하게 준비)
  const quantities = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30
  ];

  // 사진으로 등록하기 클릭
  const handlePhotoRegister = () => {
    alert('사진으로 등록하기 기능 - 추후 구현 예정');
  };

  // 수기로 등록하기 (재료 추가)
  const handleManualRegister = () => {
    if (newIngredient.name.trim()) {
      setIngredients([...ingredients, { ...newIngredient, id: Date.now() }]);
      setNewIngredient({ name: '', expiry: '', quantity: 1 });
      setShowQuantityDropdown(false);
      setEditingId(null); // 등록 완료 후 수정 모드 해제
    } else {
      alert('재료 이름을 입력해주세요.');
    }
  };

  // 수량 선택
  const handleQuantitySelect = (quantity) => {
    setNewIngredient({...newIngredient, quantity: quantity});
    setShowQuantityDropdown(false);
  };

  // 재료 삭제
  const removeIngredient = (id) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  // 재료 수정
  const handleEditIngredient = (id) => {
    const ingredient = ingredients.find(item => item.id === id);
    if (ingredient) {
      setNewIngredient({
        name: ingredient.name,
        expiry: ingredient.expiry,
        quantity: ingredient.quantity
      });
      setEditingId(id);
      // 기존 재료를 목록에서 제거
      setIngredients(ingredients.filter(item => item.id !== id));
    }
  };

  // 재료 등록 완료
  const handleComplete = async () => {
    if (ingredients.length === 0) {
      alert('등록할 재료가 없습니다.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ingredients: ingredients,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('재료 등록 성공:', data);
        setShowCompletionModal(true);
      } else {
        console.error('재료 등록 실패:', response.status);
        alert('재료 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      alert('서버와 연결할 수 없습니다.');
    }
  };

  // 드롭다운 외부 클릭 시 닫기
  const handleClickOutside = (e) => {
    if (!e.target.closest('.quantity-selector')) {
      setShowQuantityDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Stage currentstage={3} />
      
      <div className="ingredient-container">
        <h2 className="page-title">재료 등록하기</h2>
        
        <div className="register-methods">
          {/* 사진으로 등록하기 */}
          <div className="register-method">
            <h3>사진으로 등록하기</h3>
            <div className="photo-section">
              <div className="photo-upload-area" onClick={handlePhotoRegister}>
                <div className="upload-placeholder">
                  사진 촬영
                </div>
              </div>
              <button className="register-btn" onClick={handlePhotoRegister}>
                등록하기
              </button>
            </div>
          </div>

          {/* 구분선 */}
          <div className="divider"></div>

          {/* 수기로 등록하기 */}
          <div className="register-method">
            <h3>수기로 등록하기</h3>
            
            <div className="manual-form">
              {/* 이름 입력 */}
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                  placeholder="재료 이름을 입력하세요"
                  className="ingredient-input"
                />
              </div>

              {/* 소비기한/유통기한 */}
              <div className="form-group">
                <label>소비기한/유통기한</label>
                <input
                  type="date"
                  value={newIngredient.expiry}
                  onChange={(e) => setNewIngredient({...newIngredient, expiry: e.target.value})}
                  className="ingredient-input"
                />
              </div>

              {/* 수량 (드롭다운) */}
              <div className="form-group">
                <label>수량</label>
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn"
                    onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
                  >
                    {newIngredient.quantity} ▼
                  </button>
                  {showQuantityDropdown && (
                    <div className="quantity-dropdown">
                      {quantities.map((quantity) => (
                        <div
                          key={quantity}
                          className="quantity-option"
                          onClick={() => handleQuantitySelect(quantity)}
                        >
                          {quantity}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="manual-register-section">
              <button className="register-btn" onClick={handleManualRegister}>
                {editingId ? '수정 완료' : '등록하기'}
              </button>
            </div>
            {editingId && (
              <div style={{textAlign: 'center', marginTop: '10px'}}>
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setEditingId(null);
                    setNewIngredient({ name: '', expiry: '', quantity: 1 });
                  }}
                >
                  수정 취소
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 재료 목록 */}
        <div className="ingredients-wrapper">
          <h3 className="ingredients-title">재료 목록</h3>
          <div className="ingredients-section">
            <div className="ingredients-list">
              {ingredients.length === 0 ? (
                <div className="empty-message">
                  냉장고가 비어있어요!
                </div>
              ) : (
                ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="ingredient-card">
                    <div className="ingredient-header">
                      <div className="ingredient-name">{ingredient.name}</div>
                      <div className="ingredient-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditIngredient(ingredient.id)}
                        >
                          수정하기
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => removeIngredient(ingredient.id)}
                        >
                          삭제하기
                        </button>
                      </div>
                    </div>
                    <div className="ingredient-details">
                      <div className="ingredient-info">
                        소비기한 {ingredient.expiry || '미설정'}
                      </div>
                      <div className="ingredient-info">
                        수량 {ingredient.quantity}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <button className="complete-btn" onClick={handleComplete}>
            재료 등록 완료
          </button>
        </div>

        {/* 완료 모달 */}
        {showCompletionModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-text">
                서비스 이용을 위한 준비 과정이 끝났습니다.<br/>
                레시피 추천 페이지로 이동해 맞춤 레시피를 추천받거나 메인 페이지로 돌아가 서비스를 자유롭게 이용해보세요.
              </div>
              <div className="modal-buttons">
                <button 
                  className="modal-btn"
                  onClick={() => navigate('/main')}
                >
                  메인 페이지
                </button>
                <button 
                  className="modal-btn"
                  onClick={() => navigate('/recom')}
                >
                  레시피 추천 페이지
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default IngredientRegistration;