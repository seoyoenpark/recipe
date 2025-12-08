import React, { useState } from "react";
import './FindAccount02.css';
import { useNavigate } from 'react-router-dom';

function FindAccount02() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [btd, setBtd] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(''); 

  const navigate = useNavigate();

  const handleFindId = async (e) => {
    e.preventDefault();

    console.log('비밀번호 재설정 시도:', { name, username, btd });

    try {
      const res = await fetch('http://localhost:3000/api/user/verify-reset-identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: name, //이름
          userId: username, //id
          birthdate: btd, //생년월일
        }),
      });

      const data = await res.json(); 

      if (res.ok) {
        // resetToken 저장
        setResetToken(data.data.resetToken);
        setIsModalOpen(true);
      } else { 
        alert(data.message || '사용자 정보가 일치하지 않습니다.'); 
      }
    } catch (error) {
      console.error('본인 인증 API 호출 중 오류 발생:', error);
      alert('서버와 통신하는 중 문제가 발생했습니다.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== newPasswordConfirm) {
      alert("새로운 비밀번호가 일치하지 않습니다.");
      return;
    }
    if(!newPassword) {
      alert("새로운 비밀번호를 입력해주세요.");
      return;
    }
    if(!resetToken) {
      alert("본인 확인을 먼저 완료해주세요.");
      return;
    }
    
    try {
      const res = await fetch('http://localhost:3000/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken: resetToken,
          newPassword: newPassword,
          confirmPassword: newPasswordConfirm,
        }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || "비밀번호가 성공적으로 재설정되었습니다. 다시 로그인해주세요.");
      setIsModalOpen(false);
      setResetToken('');
      navigate('/Userlogin');
    } else {
      alert(data.message || "비밀번호 재설정에 실패했습니다.");
    } 
  } catch (error) {
    console.error('비밀번호 재설정 API 호출 중 오류 발생:', error);
    alert('서버와 통신하는 중 문제가 발생했습니다.');
  }
};

  const closeModal = () => {
    setIsModalOpen(false);
    setNewPassword('');
    setNewPasswordConfirm('');
    setResetToken('');
  };

    const goToLogin = () => {
    closeModal();
    navigate('/Userlogin'); // 로그인 페이지로 이동
  };

  return (
    <>
      <section className="logincontainer">
        <h3>비밀번호를 분실했다면 하단에 이름과 아이디, 생년월일을 입력해주세요.</h3>

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
          <label htmlFor="username">아이디</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="sam12"
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
            <button type="submit" className="find-pwd-btn">비밀번호 재설정</button>
          </div>
        </form>

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2>비밀번호 재설정</h2>
            <p>하단에 새로운 비밀번호를 입력해주세요.</p>
            <form onSubmit={handleResetPassword}>
              <label htmlFor="newPassword">새로운 비밀번호</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
                required  />
              
              <label htmlFor="newPasswordConfirm">비밀번호 확인</label>
              <input
                id="newPasswordConfirm"
                name="newPasswordConfirm"
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                placeholder="비밀번호를 다시 입력하세요"
                required />

              <div className="button-container">
                <button type="submit" className="reset-password-btn">
                  비밀번호 재설정
                </button>
              </div>
            </form>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default FindAccount02;