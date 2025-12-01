import React, { useState, useEffect } from 'react';
import './AdminIngredient.css';

// 더미 데이터 (현재 날짜 기준으로 수정)
const dummyIngredients = [
  { 
    id: 1, 
    name: '돼지고기', 
    userId: 'chefking', 
    registeredDate: '2025-09-25', 
    expiryDate: '2025-10-01',
    quantity: '500g',
    status: '임박'
  },
  { 
    id: 2, 
    name: '우유', 
    userId: 'tasty', 
    registeredDate: '2025-09-26', 
    expiryDate: '2025-10-10',
    quantity: '1L',
    status: '여유'
  },
  { 
    id: 3, 
    name: '계란', 
    userId: 'recipefairy', 
    registeredDate: '2025-09-20', 
    expiryDate: '2025-10-15', 
    quantity: '12개',
    status: '여유'
  },
  { 
    id: 4, 
    name: '김치', 
    userId: 'chefking', 
    registeredDate: '2025-09-28', 
    expiryDate: '2025-09-30', 
    quantity: '1포기',
    status: '임박'
  },
  { 
    id: 5, 
    name: '양파', 
    userId: 'tasty', 
    registeredDate: '2025-09-15', 
    expiryDate: '2025-10-20',
    quantity: '3개',
    status: '여유'
  },
];

function AdminIngredient() {
  const [allIngredients, setAllIngredients] = useState(dummyIngredients);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // 소비기한까지 남은 일수 계산 함수
  const calculateStatus = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 부분을 0으로 설정하여 날짜만 비교
    
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0); // 시간 부분을 0으로 설정하여 날짜만 비교
    
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // 디버깅을 위한 콘솔 로그 (실제 사용시 제거 가능)
    console.log(`${expiryDate}: ${diffDays}일 남음`);
    
    return diffDays <= 3 ? '임박' : '여유';
  };

  useEffect(() => {
    // 상태 업데이트 및 서버에서 식재료 데이터를 가져오는 로직
    // 현재는 더미 데이터 사용
    const updatedIngredients = allIngredients.map(ingredient => ({
      ...ingredient,
      status: calculateStatus(ingredient.expiryDate)
    }));
    setAllIngredients(updatedIngredients);
  }, []);

  const handleEdit = (ingredient) => {
    setEditingId(ingredient.id);
    setEditData({ ...ingredient });
  };

  const handleSave = (id) => {
    // 소비기한 업데이트시 상태도 재계산
    const updatedData = {
      ...editData,
      status: calculateStatus(editData.expiryDate)
    };

    const updatedIngredients = allIngredients.map(ingredient =>
      ingredient.id === id ? updatedData : ingredient
    );
    setAllIngredients(updatedIngredients);
    setEditingId(null);
    setEditData({});
    alert('식재료 정보가 수정되었습니다.');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    if (window.confirm('이 식재료를 삭제하시겠습니까?')) {
      const updatedIngredients = allIngredients.filter(ingredient => ingredient.id !== id);
      setAllIngredients(updatedIngredients);
      alert('식재료가 삭제되었습니다.');
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="admin-ingredient-container">
      <h2>식재료 목록 상세 조회 및 관리</h2>

      {/* 식재료 정보 테이블 */}
      <table className="ingredient-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>식재료명</th>
            <th>등록 사용자</th>
            <th>등록일</th>
            <th>소비 기한</th>
            <th>수량</th>
            <th>상태</th>
            <th>수정/삭제</th>
          </tr>
        </thead>
        <tbody>
          {allIngredients.map((ingredient, index) => (
            <tr key={ingredient.id}>
              <td>{index + 1}</td>
              <td>
                {editingId === ingredient.id ? (
                  <input
                    type="text"
                    value={editData.name || ingredient.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  ingredient.name
                )}
              </td>
              <td>
                {editingId === ingredient.id ? (
                  <input
                    type="text"
                    value={editData.userId || ingredient.userId}
                    onChange={(e) => handleInputChange('userId', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  ingredient.userId
                )}
              </td>
              <td>
                {editingId === ingredient.id ? (
                  <input
                    type="date"
                    value={editData.registeredDate || ingredient.registeredDate}
                    onChange={(e) => handleInputChange('registeredDate', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  ingredient.registeredDate
                )}
              </td>
              <td>
                {editingId === ingredient.id ? (
                  <input
                    type="date"
                    value={editData.expiryDate || ingredient.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  ingredient.expiryDate
                )}
              </td>
              <td>
                {editingId === ingredient.id ? (
                  <input
                    type="text"
                    value={editData.quantity || ingredient.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  ingredient.quantity
                )}
              </td>
              <td>
                <span className={`status ${ingredient.status === '임박' ? 'urgent' : 'safe'}`}>
                  {editingId === ingredient.id ? calculateStatus(editData.expiryDate || ingredient.expiryDate) : ingredient.status}
                </span>
              </td>
              <td>
                {editingId === ingredient.id ? (
                  <div className="button-group">
                    <button 
                      className="save-btn"
                      onClick={() => handleSave(ingredient.id)}
                    >
                      저장
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={handleCancel}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <div className="button-group">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(ingredient)}
                    >
                      수정
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(ingredient.id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminIngredient;