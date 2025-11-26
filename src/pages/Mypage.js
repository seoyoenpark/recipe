import React from 'react';
import { useState, useEffect } from 'react';
import { useGlobalLoading } from '../components/LoadingProvider';
import './Mypage.css';

// 조리도구 리스트
const TOOLS_LIST = [
  '냄비', '프라이팬', '볼', '계량스푼', '키친타올', '계량컵', 
  '전자레인지', '에어프라이어', '오븐', '찜기', '내열용기', '밀폐용기', 
  '믹서기', '거품기', '스텐트레이', '랩', '매셔', '전기밥솥', '면보', '체망', '토치'
];

// state 초기 객체 생성 함수
const InitialState = (list) => {
  const initialState = {};
  list.forEach(item => {
    initialState[item] = false;
  });
  return initialState;
};

// 알레르기 리스트
const ALLERGIES_LIST = [
  '난류(가금류)', '우유', '메밀', '땅콩', '대두', '밀', 
  '고등어', '게', '새우', '돼지고기', '복숭아', '토마토', 
  '아황산염', '호두', '닭고기', '소고기', '오징어', '조개류(굴, 전복, 홍합 포함)'
];

function Mypage() {
  const [basicInfo, setBasicInfo] = useState({
    gender: '',
    btd: '',
    name:'',
    nickname: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });

// 알레르기 & 조리도구를 객체로 변경
  const [allergies, setAllergies] = useState(InitialState(ALLERGIES_LIST));
  const [tools, setTools] = useState(InitialState(TOOLS_LIST));
  
  const {show, hide} = useGlobalLoading();

  // DB에서 사용자 정보 불러오기 & 로딩 페이지
  useEffect(() => {
    let alive = true;

    //API 호출
    const fetchUserInfo = async () => {
      show();

      try {
        // localStorage에서 JWT 토큰 가져오기
        const token = localStorage.getItem('token');
        // if (!token) {
        //   alert('로그인이 필요합니다.');
        //   window.location.href = '/Userlogin';
        //   return;
        // }
         // API 호출 - 백엔드의 /api/profile 엔드포인트 사용
        const response = await fetch('http://localhost:3001/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // JWT 토큰 추가
          },
        });

        const dataFromDb = await response.json(); // 서버로부터 받은 JSON 데이터
        if (!alive) return;
        // 백엔드에서 받은 사용자 정보로 상태 업데이트
        if (dataFromDb.success && dataFromDb.user) {
                  setBasicInfo({
                    gender: dataFromDb.user.gender,
                    btd: dataFromDb.user.btd,
                    name:dataFromDb.user.name,
                    nickname: dataFromDb.user.nickname,
                    username: dataFromDb.user.username,
                    password: '', // 보안상 비밀번호는 빈 문자열로 설정
                  });
                
                  setAllergies(prev => ({ ...prev, ...(dataFromDb.user.allergies || {}) }));
                  setTools(prevTools => ({
                ...prevTools, // 모든 도구를 false 초기화
                ...(dataFromDb.user.tools || {}) // 서버에서 받은 값으로 덮어쓰기
            }));
                } else {
                  throw new Error('사용자 정보 형식이 올바르지 않습니다.');
                }
      } catch (error) {
        if (alive) return;
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        hide();
      }
    };

    fetchUserInfo();

    return () => {
      alive = false;
    };
  }, [show, hide]);

  // 기본 정보 입력값 변경 핸들러
  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

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

  // 폼 제출 핸들러 (기본 정보 수정)
  const handleBasicSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작(새로고침) 방지
    
    console.log('기본 정보 수정 제출 데이터:', basicInfo); 

    const {gender, btd, name, nickname, username, password, passwordConfirm} = basicInfo;

      // 비밀번호 일치 여부 확인
      if(password || passwordConfirm) {
        if (password !== passwordConfirm) {
          alert("비밀번호가 일치하지 않습니다.");
          return; // 비밀번호 불일치 시 함수 실행 중단
        }
      }

    try {
      const updateData = {gender, btd, name, nickname, username};

      if (password && passwordConfirm) {
        updateData.password = password;
      }
    
        // localStorage에서 JWT 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/Userlogin';
        return;
      }

      // DB 업데이트 API 구현 - 백엔드의 /api/profile 엔드포인트 사용
      const response = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, // JWT 토큰 추가
        },
        body: JSON.stringify({ // 서버로 보낼 데이터
          gender: basicInfo.gender,
          btd: basicInfo.btd,
          name: basicInfo.name,
          nickname: basicInfo.nickname,
          username: basicInfo.username,
          password: basicInfo.password || undefined, // 비밀번호가 입력되었을 경우에만 전송
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '기본 정보 수정에 실패했습니다.');
      }
      const result = await response.json(); // 서버 응답 데이터
      console.log('기본 정보 수정 성공:', result);
      alert('기본 정보가 성공적으로 수정되었습니다!');

       // 성공 후 비밀번호 입력 필드 초기화
      setBasicInfo(prev => ({
        ...prev,
        password: '',
        passwordConfirm: '',
      }));

    } catch (error) {
      console.error('기본 정보 수정 중 오류 발생:', error);
      alert('기본 정보 수정에 실패했습니다.');
    }
  };

  // 폼 제출 핸들러 (상세 정보 수정)
  const handleDetailSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작(새로고침) 방지

    const detailData = { allergies, tools };
    console.log('상세 정보 수정 제출 데이터:', detailData);

    try {
      // ===== 1. localStorage에서 JWT 토큰 가져오기 (추가) =====
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/Userlogin';
        return;
      }

    // DB 업데이트 API 호출 구현
      const response = await fetch('http://localhost:3001/api/user/detailinfo', {
        method: 'PUT', // 또는 'PATCH'
        headers: {
          'Content-Type': 'application/json',
          // Authorization 헤더에 토큰 추가
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(detailData),
      });

      if (!response.ok) {
        throw new Error('상세 정보 수정에 실패했습니다.');
      }

      const result = await response.json();
      console.log('상세 정보 수정 성공:', result);
      alert('상세 정보가 성공적으로 수정되었습니다!');

    } catch (error) {
      console.error('상세 정보 수정 중 오류 발생:', error);
      alert('상세 정보 수정에 실패했습니다.');
    }
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
  const handleWithdrawConfirm = async () => {
    if (!withdrawPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    // API 호출로 탈퇴 처리
    console.log('탈퇴 비밀번호:', withdrawPassword);

     try {
      const token = localStorage.getItem('token');
      // API 호출로 탈퇴 처리
      const response = await fetch('http://localhost:3001/api/user/withdraw', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Authorization 헤더에 토큰 추가
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password: withdrawPassword }), // 탈퇴 시 비밀번호 확인
      });

      if (!response.ok) {
        const errorData = await response.json(); // 서버에서 보낸 에러 메시지
        throw new Error(errorData.message || '회원 탈퇴에 실패했습니다.');
      }

      alert('회원 탈퇴가 성공적으로 처리되었습니다.');
      // 탈퇴 성공 후 비로그인 메인 페이지로 리디렉션
      window.location.href = '/home'; 
      closeModal();

    } catch (error) {
      console.error('회원 탈퇴 중 오류 발생:', error);
      alert(`회원 탈퇴에 실패했습니다: ${error.message}`);
    }
  };
  
  return (
    <div className='MypageContainer'>
      <section className="BasicUserContainer">
        <h2>회원 기본 정보 수정</h2>
        <form onSubmit={handleBasicSubmit}>
          <label htmlFor="nick">닉네임</label>
          <input 
          id="nick"
          name="nickname" 
          type="text" 
          value={basicInfo.nickname} 
          onChange={handleBasicChange} />

          <label htmlFor="id">아이디</label>
          <input 
          id="id"
          name="id"
          type="text" 
          value={basicInfo.username} 
          onChange={handleBasicChange} />
          
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            value={basicInfo.password}
            onChange={handleBasicChange} />
          
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            value={basicInfo.passwordConfirm}
            onChange={handleBasicChange}
            placeholder="비밀번호를 다시 입력하세요" />
          
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            value={basicInfo.name}
            onChange={handleBasicChange}
            placeholder="이름을 입력하세요"
            required />
          
          <label htmlFor="btd">생년월일</label>
          <input
            id="btd"
            name="btd"
            type="text"
            inputMode="numeric"
            maxLength="6"
            value={basicInfo.btd}
            onChange={handleBasicChange}
            placeholder="생년월일 6자리(YYMMDD)를 입력하세요."
            pattern="\d{6}"
            required />
            
          <fieldset className="gender-group">
            <legend>성별</legend>
              <input
              id="gender-male"
              name="gender"
              type="radio"
              value="male"
              checked={basicInfo.gender === 'male'}
              onChange={handleBasicChange}
              required
            />
            <label htmlFor="gender-male">남성</label>

            <input
              id="gender-female"
              name="gender"
              type="radio"
              value="female"
              checked={basicInfo.gender === 'female'}
              onChange={handleBasicChange}
              required
            />
          <label htmlFor="gender-female">여성</label>
        </fieldset>
          <button type="submit" className="mypage-submit-button">수정 완료</button>
        </form>
      </section>
      <section className='DetailUserContainer'>
        <h2>회원 상세 정보 수정</h2>
        <form onSubmit={handleDetailSubmit}>
          <label>알레르기</label>
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
          <label>조리도구</label>
            <div className="tools">
              {Object.entries(tools).map(([toolName, isSelected]) => (
                <button
                    key={toolName}
                    className={`tool-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTool(toolName)}
                    type="button"
                  >{toolName}
                </button>
            ))}
            </div>
            <button type="submit" className='mypage-submit-button'>수정 완료</button>
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