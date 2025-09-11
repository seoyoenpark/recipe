import React from 'react';
import { useState, useEffect } from 'react';
import './Mypage.css';

function Mypage() {
  const [basicInfo, setBasicInfo] = useState({
    nickname: '',
    username: '',
    password: '',
  });

  // 알레르기 상태와 입력창 상태
  const [allergyInput, setAllergyInput] = useState('');
  const [allergies, setAllergies] = useState([]);

  // 조리도구 선택 상태 (DB에서 불러온 값으로 초기화될 예정)
  const [tools, setTools] = useState({
    wok: false,
    microwave: false,
    bigPot: false,
    oven: false,
    smallPot: false,
    fryer: false,
  });

  // DB에서 사용자 정보 불러오기
  useEffect(() => {
    //API 호출
    const fetchUserInfo = async () => {

      // DB에서 가져왔다고 가정한 데이터
      const dataFromDb = {
        nickname: 'Smitherton',
        username: 'Smitherton123',
        password: '',
        allergies: ['땅콩', '새우'],
        tools: { wok: true, microwave: false, bigPot: true, oven: false, smallPot: true, fryer: false }
      };

      // 불러온 데이터 각 상태에 업데이트
      setBasicInfo({
        nickname: dataFromDb.nickname,
        username: dataFromDb.username,
        password: dataFromDb.password,
      });
      setAllergies(dataFromDb.allergies || []);
      setTools(dataFromDb.tools || {});
    };

    fetchUserInfo();
  }, []); // 빈 배열을 두어 컴포넌트가 처음 마운트될 때만 실행되도록 함

  // 기본 정보 입력값 변경 핸들러
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  // 알레르기 입력 텍스트 변경 핸들러
  const handleAllergyInputChange = (e) => {
    setAllergyInput(e.target.value);
  };

  // 알레르기 태그 추가 (엔터 키 입력 시)
  const handleAllergyKeyDown = (e) => {
    if (e.key === 'Enter' && allergyInput.trim() !== '') {
      // 이미 존재하는 태그는 추가하지 않습니다.
      if (!allergies.includes(allergyInput.trim())) {
        setAllergies([...allergies, allergyInput.trim()]);
      }
      setAllergyInput(''); // 입력창 초기화
      e.preventDefault(); // 폼 제출 방지
    }
  };

  // 알레르기 태그 제거
  const removeAllergyTag = (tagToRemove) => {
    setAllergies(allergies.filter((tag) => tag !== tagToRemove));
  };

  // 조리도구 선택 토글 핸들러
  const toggleTool = (toolName) => {
    setTools((prev) => ({
      ...prev,
      [toolName]: !prev[toolName]
    }));
  };

  // 폼 제출 핸들러 (기본 정보 수정)
  const handleBasicSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작(새로고침) 방지

    console.log('기본 정보 수정 제출 데이터:', basicInfo);

    // 여기에 DB 업데이트 API 호출 로직 구현하기

    alert('기본 정보가 수정되었습니다!');
  };

  // 폼 제출 핸들러 (상세 정보 수정)
  const handleDetailSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작(새로고침) 방지

    const detailData = { allergies, tools };
    console.log('상세 정보 수정 제출 데이터:', detailData);

    // 여기에 DB 업데이트 API 호출 로직 구현하기
    
    alert('상세 정보가 수정되었습니다!');
  };

  // 모달 열림 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 탈퇴 비밀번호 입력 상태
  const [withdrawPassword, setWithdrawPassword] = useState('');

  // 모달 열기
  const openModal = () => setIsModalOpen(true);
  // 모달 닫기
  const closeModal = () => {
    setWithdrawPassword('');
    setIsModalOpen(false);
  };

  // 회원 탈퇴 실행 핸들러
  const handleWithdrawConfirm = () => {
    if (!withdrawPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    // API 호출로 탈퇴 처리
    console.log('탈퇴 비밀번호:', withdrawPassword);
    alert('회원 탈퇴 처리 완료');
    closeModal();
  };

  return (
    <div className='MypageContainer'>
      <section className="BasicUserContainer">
        <h2>회원 기본 정보 수정</h2>
        <form onSubmit={handleBasicSubmit}>
          <label>닉네임</label>
          <input name="nickname" value={basicInfo.nickname} onChange={handleBasicChange} />
          <label>아이디</label>
          <input name="username" value={basicInfo.username} onChange={handleBasicChange} />
          <label>비밀번호</label>
          <input
            name="password"
            type="password"
            value={basicInfo.password}
            onChange={handleBasicChange}
            />
          <button type="submit">수정 완료</button>
        </form>
      </section>
      <section className='DetailUserContainer'>
        <h2>회원 상세 정보 수정</h2>
        <form onSubmit={handleDetailSubmit}>
          <label>알레르기</label>
            <input
              type="text"
              placeholder="알레르기 입력 후 엔터"
              value={allergyInput}
              onChange={handleAllergyInputChange}
              onKeyDown={handleAllergyKeyDown}
            />
            <div className="allergy-tags">
              {allergies.map((tag) => (
              <span key={tag} className="allergy-tag">
              {tag} <button type="button" onClick={() => removeAllergyTag(tag)}>X</button>
            </span>
            ))}
            </div>
          <label>조리도구</label>
            <div className="tools">
            {/* Object.entries로 key(도구명)와 value(선택여부)를 동시에 가져옵니다. */}
            {Object.entries(tools).map(([toolKey, selected]) => (
              <button
                key={toolKey}
                className={`tool-button ${selected ? 'selected' : ''}`}
                onClick={() => toggleTool(toolKey)}
                type="button" // form 내부의 버튼은 기본적으로 submit 타입이므로 명시적으로 button 타입 지정
              >
              {/* toolKey에 따라 사용자에게 보여줄 텍스트를 결정합니다. */}
              {toolKey === 'wok' ? '웍' :
              toolKey === 'microwave' ? '전자레인지' :
              toolKey === 'bigPot' ? '큰 냄비' :
              toolKey === 'oven' ? '오븐' :
              toolKey === 'smallPot' ? '작은 냄비' :
              toolKey === 'fryer' ? '에어프라이어' : toolKey /* 만약 다른 이름이 있다면 그대로 보여줌 */}
              </button>
            ))}
            </div>
            <button type="submit">수정 완료</button>
        </form>
      </section>
      <button onClick={openModal} className="withdraw-btn">회원 탈퇴</button>
      {/* 탈퇴 모달 */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>회원 탈퇴를 원하시면 하단에 비밀번호를 입력해주세요.</h3>
            <input
              id="withdraw-password"
              type="password"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
             <button className="confirm-btn" onClick={handleWithdrawConfirm}>회원 탈퇴</button>
            <button className="cancel-btn" onClick={closeModal}>돌아가기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mypage;