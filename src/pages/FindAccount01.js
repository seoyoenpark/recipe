import React, { useState } from "react";
import './FindAccount01.css';
import { useNavigate } from 'react-router-dom';

function FindAccount01() {
  const [name, setName] = useState('');
  const [btd, setBtd] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foundInfo, setFoundInfo] = useState({ name: '', userID: '' }); 

  const navigate = useNavigate();

  const handleFindId = async (e) => {
    e.preventDefault();

    console.log('아이디 찾기 시도:', { name, btd });

    try {
      const res = await fetch('http://localhost:3000/api/user/find-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: name,
          birthdate: btd,
        }),
      });

      const data = await res.json(); 
      console.log('아이디 찾기 응답:', data);

      if (res.ok) {
        // 백엔드 응답: { success: true, data: { userID: '...', userId: '...' } }
        const foundUserId = data.data?.userID || data.data?.userId || '';
        if (!foundUserId) {
          console.error('아이디 찾기 응답에 userID가 없음:', data);
          alert('아이디를 찾을 수 없습니다.');
          return;
        }
        setFoundInfo({ name: name, userID: foundUserId });
        setIsModalOpen(true);
      } else { 
        console.error('아이디 찾기 실패:', data);
        alert(data.message || '아이디 찾기 실패'); 
      }
    } catch (error) {
      console.error('아이디 찾기 API 호출 중 오류 발생:', error);
      alert(error.message || '서버와 통신하는 중 문제가 발생했습니다.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  const goToLogin = () => {
    closeModal();
    navigate('/Userlogin'); // 로그인 페이지로 이동
  };

  return (
    <>
      <section className="logincontainer">
        <h3>아이디를 찾고 싶다면 하단에 이름과 생년월일을 입력해주세요.</h3>

        <form onSubmit={handleFindId}>
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            required
            autoFocus
          />
          <label htmlFor="btd">생년월일(6자리)</label>
          <input
            id="btd"
            type="text"
            value={btd}
            inputMode="numeric"
            maxLength="6"
            onChange={(e) => setBtd(e.target.value)}
            placeholder="YYMMDD"
            pattern="\d{6}"
            required
          />
          <div className="button-container">
            <button type="submit" className="find-id">아이디 찾기</button>
          </div>
        </form>

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="find-modal-content" onClick={e => e.stopPropagation()}>
              <h2>아이디 찾기</h2>
              <h3>{foundInfo.name}님의 아이디 찾기가 완료되었습니다.</h3>
              <h3>아이디는 {foundInfo.userID} 입니다.</h3>

              <button className="move-to-Userlogin" onClick={goToLogin}>
                로그인 페이지로 이동하기
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default FindAccount01;