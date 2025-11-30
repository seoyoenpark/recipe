import React from 'react';
import { useState, useEffect } from 'react';
import { useGlobalLoading } from '../components/LoadingProvider';
import './Mypage.css';

// state 초기 객체 생성 함수
const InitialState = (list) => {
  const initialState = {};
  list.forEach(item => {
    initialState[item] = false;
  });
  return initialState;
};

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

// 전체 목록 저장 State
  const [allergyList, setAllergyList] = useState([]);
  const [toolList, setToolList] = useState([]);

  // 2. 선택 상태 State
  const [allergies, setAllergies] = useState({});
  const [tools, setTools] = useState({});

  const {show, hide} = useGlobalLoading();

  // 데이터 불러오기
  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      show();
      try {
        const token = localStorage.getItem('token');
        
        // API 호출 (전체 알레르기, 전체 도구, 사용자 프로필)
        const [allergiesRes, toolsRes, profileRes] = await Promise.all([
            fetch('http://localhost:3001/api/user/allergies'),
            fetch('http://localhost:3001/api/user/tools'),
            fetch('http://localhost:3001/api/user/profile', {
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            })
        ]);
        if (!alive) return;

        // 전체 목록 설정
        if (allergiesRes.ok && toolsRes.ok) {
            const allergiesData = await allergiesRes.json();
            const toolsData = await toolsRes.json();
            
            const allAllergies = allergiesData.data || allergiesData; 
            const allTools = toolsData.data || toolsData;

            setAllergyList(allAllergies);
            setToolList(allTools);

            // 모든 항목 false로 초기화
            const initialAllergies = InitialState(allAllergies);
            const initialTools = InitialState(allTools);

            // 3. 사용자 정보가 있으면 덮어쓰기
            if (profileRes.ok) {
                const profileData = await profileRes.json();
                if (profileData.success && profileData.user) {
                    setBasicInfo({
                        // ... 기존 basicInfo 매핑
                        gender: profileData.user.gender,
                        btd: profileData.user.btd,
                        name: profileData.user.name,
                        nickname: profileData.user.nickname,
                        username: profileData.user.username,
                        password: '',
                        passwordConfirm: '',
                    });

                    // 기존 선택 내역 병합
                    // (백엔드에서 선택된 것만 true로 보내준다고 가정하거나, 선택된 리스트만 보내준다면 로직 조정 필요)
                    setAllergies({ ...initialAllergies, ...(profileData.user.allergies || {}) });
                    setTools({ ...initialTools, ...(profileData.user.tools || {}) });
                }
            }
        }

      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        hide();
      }
    };

    fetchData();

    return () => { alive = false; };
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
      const response = await fetch('http://localhost:3001/api/user/profile', {
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
    e.preventDefault();

    const detailData = { allergies, tools };
    console.log('상세 정보 수정 제출 데이터:', detailData);

    try {
      // JWT 토큰 가져오기
      const token = localStorage.getItem('token');
      if (!token) {
        alert('로그인이 필요합니다.');
        window.location.href = '/Userlogin';
        return;
      }

    // DB 업데이트 API 호출 구현
      const response = await fetch('http://localhost:3001/api/user/detailinfo', {
        method: 'PUT',
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
              className='gender-input'
            />
            <label htmlFor="gender-male" className='gender-label'>남성</label>

            <input
              id="gender-female"
              name="gender"
              type="radio"
              value="female"
              checked={basicInfo.gender === 'female'}
              onChange={handleBasicChange}
              required
              className='gender-input'
            />
          <label htmlFor="gender-female" className='gender-label'>여성</label>
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
          <div className="withdraw-modal-content" onClick={e => e.stopPropagation()}>
            <h3>회원 탈퇴를 원하시면 하단에 비밀번호를 입력해주세요.</h3>
            <input
              id="withdraw-password"
              type="password"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
            />
            <div className='withdraw-buttons'>
             <button className="confirm-btn" onClick={handleWithdrawConfirm}>회원 탈퇴</button>
            <button className="turnback-btn" onClick={closeModal}>돌아가기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mypage;