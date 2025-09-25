import React, { useState, useEffect } from 'react';
import './AdminUser.css';

// 더미 데이터
const dummyUsers = [
  { id: 1, nickname: '요리왕', userId: 'chefking', password: '123', allergy: '땅콩', tools: '오븐', status: '활동중', role: '사용자' },
  { id: 2, nickname: '맛잘알', userId: 'tasty', password: '•••', allergy: '없음', tools: '에어프라이어', status: '정지', role: '사용자' },
  { id: 3, nickname: '관리자', userId: 'admin01', password: '•••', allergy: '없음', tools: '-', status: '활동중', role: '관리자' },
  { id: 4, nickname: '레시피요정', userId: 'recipefairy', password: '•••', allergy: '갑각류', tools: '믹서기', status: '활동중', role: '사용자' },
];

function AdminUser() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState(dummyUsers);
  const [filteredUsers, setFilteredUsers] = useState(dummyUsers);

useEffect(() => {
    // 검색어가 비어 있으면 모든 사용자를 보여줌
    if (searchTerm.trim() === '') {
      setFilteredUsers(allUsers);
      return;
    }

    // 검색어 소문자로 변환
    const lowercasedTerm = searchTerm.toLowerCase();

    // 원본 데이터(allUsers)에서 필터링 수행
    const results = allUsers.filter(user =>
      // user 객체의 모든 값을 확인하며 검색어가 포함되어 있는지 검사
      Object.values(user).some(value =>
        String(value).toLowerCase().includes(lowercasedTerm)
      )
    );
    setFilteredUsers(results);
  }, [searchTerm, allUsers]); // searchTerm 또는 allUsers가 변경될 때마다 이 함수 실행

  return (
    <div className="admin-user-container">
      {/* 페이지 상단: 타이틀과 검색창 */}
      <div className="page-header">
        <h2>사용자 목록 상세 조회 및 계정 상태</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="사용자 정보 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>🔍</button>
        </div>
      </div>

      {/* 사용자 정보 테이블 */}
      <table className="user-table">
        <thead>
          <tr>
            <th>index</th>
            <th>닉네임</th>
            <th>아이디</th>
            <th>비밀번호</th>
            <th>알레르기</th>
            <th>조리도구</th>
            <th>계정 상태</th>
            <th>사용자/관리자</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.nickname}</td>
              <td>{user.userId}</td>
              <td>{user.password}</td>
              <td>{user.allergy}</td>
              <td>{user.tools}</td>
              <td>
                <select defaultValue={user.status} className="status-select">
                  <option value="활동중">활동중</option>
                  <option value="정지">정지</option>
                </select>
              </td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUser;