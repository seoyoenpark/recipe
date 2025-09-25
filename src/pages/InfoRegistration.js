/* 비로그인 상태의 정보 등록 페이지 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InfoRegistration.css';
import Stage from '../components/Stage';

// 조리도구 리스트
const TOOLS_LIST = [
  '냄비', '프라이팬', '볼', '계량스푼', '키친타올', '계량컵', 
  '전자레인지', '에어프라이어', '오븐', '찜기', '내열용기', '밀폐용기', 
  '믹서기', '거품기', '스텐트레이', '랩', '매셔', '전기밥솥', '면보', '체망', '토치'
];

// 알레르기 리스트
const ALLERGIES_LIST = [
  '① 난류(가금류)', '② 우유', '③ 메밀', '④ 땅콩', '⑤ 대두', '⑥ 밀', 
  '⑦ 고등어', '⑧ 게', '⑨ 새우', '⑩ 돼지고기', '⑪ 복숭아', '⑫ 토마토', 
  '⑬ 아황산염', '⑭ 호두', '⑮ 닭고기', '⑯ 소고기', '⑰ 오징어', '⑱ 조개류(굴, 전복, 홍합 포함)'
];

// state 초기 객체 생성 함수
const InitialState = (list) => {
  const initialState = {};
  list.forEach(item => {
    initialState[item] = false;
  });
  return initialState;
};

function InfoRegistration() {
  // state 설정
  const [allergies, setAllergies] = useState(InitialState(ALLERGIES_LIST));
  const [tools, setTools] = useState(InitialState(TOOLS_LIST));

  const navigate = useNavigate();

  // 알레르기 토글 핸들러
  const toggleAllergy = (allergyName) => {
    setAllergies((prev) => ({
      ...prev,
      [allergyName]: !prev[allergyName]
    }));
  };

  // 조리도구 토글 핸들러
  const toggleTool = (toolName) => {
    setTools((prev) => ({
      ...prev,
      [toolName]: !prev[toolName]
    }));
  };

  const handleSubmit = async () => {
    console.log('선택된 알레르기:', allergies);
    console.log('선택된 조리도구:', tools);
    
    try {
      // JWT 토큰 확인
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/Userlogin');
        return;
      }

      const response = await fetch('http://localhost:3001/api/user/detailinfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          allergies: allergies,
          tools: tools,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('정보 등록 성공:', data);
        alert('정보가 성공적으로 등록되었습니다!');
        // 다음 단계(재료 등록 페이지)로 이동
        navigate('/ingredient-registration');
      } else {
         const errorData = await response.json();
        console.error('정보 등록 실패:', errorData);
        alert('정보 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      alert('서버와 연결할 수 없습니다.');
    }
  };

  return (
    <div className="info-registration-container">
      <Stage currentstage={2} />
      
      <div className="info-registration-content">
        <div className="form-section">
          <h1 className="section-title">정보 등록</h1>
          
          <div className="allergy-section">
            <label className="allergy-label">알레르기</label>
            <div className="allergies-list">
              {Object.entries(allergies).map(([allergyName, isSelected]) => (
                <button
                  key={allergyName}
                  className={`allergy-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleAllergy(allergyName)}
                  type="button"
                >
                  {allergyName}
                </button>
              ))}
            </div>
          </div>

          <div className="tools-section">
            <label className="tools-label">조리도구</label>
            <div className="tools">
              {Object.entries(tools).map(([toolName, isSelected]) => (
                <button
                  key={toolName}
                  className={`tool-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleTool(toolName)}
                  type="button"
                >
                  {toolName}
                </button>
              ))}
            </div>
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            정보 등록 완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoRegistration;