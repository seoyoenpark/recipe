import React, { useState } from 'react';
import './AdminUser.css';

// 더미 데이터
const dummyUsers = [
  { id: 1, nickname: '김철수', userId: 'chulsoo123', allergies: ['우유', '땅콩'], status: '활성', role: '사용자', gender: '남자', name: '김철수', birthdate: '1990-05-15', cookingTools: ['전자레인지', '에어프라이어'] },
  { id: 2, nickname: '이영희', userId: 'younghee456', allergies: ['새우', '게'], status: '활성', role: '관리자', gender: '여자', name: '이영희', birthdate: '1995-08-20', cookingTools: ['오븐', '믹서기'] },
  { id: 3, nickname: '박민수', userId: 'minsu789', allergies: [], status: '정지', role: '사용자', gender: '남자', name: '박민수', birthdate: '1988-03-10', cookingTools: ['전자레인지'] },
  { id: 4, nickname: '최지혜', userId: 'jihye321', allergies: ['밀', '난류(가금류)'], status: '활성', role: '관리자', gender: '여자', name: '최지혜', birthdate: '1992-11-25', cookingTools: ['에어프라이어', '오븐', '믹서기'] },
  { id: 5, nickname: '정현우', userId: 'hyunwoo111', allergies: ['호두'], status: '활성', role: '사용자', gender: '남자', name: '정현우', birthdate: '1997-01-30', cookingTools: [] },
  { id: 6, nickname: '강소연', userId: 'soyeon222', allergies: ['대두'], status: '활성', role: '사용자', gender: '여자', name: '강소연', birthdate: '1993-07-12', cookingTools: ['전자레인지', '오븐'] },
  { id: 7, nickname: '윤태영', userId: 'taeyoung333', allergies: ['복숭아', '토마토'], status: '활성', role: '관리자', gender: '남자', name: '윤태영', birthdate: '1991-09-05', cookingTools: ['에어프라이어', '냄비'] },
  { id: 8, nickname: '한미래', userId: 'mirae444', allergies: [], status: '정지', role: '사용자', gender: '여자', name: '한미래', birthdate: '1996-04-18', cookingTools: ['믹서기', '볼'] },
  { id: 9, nickname: '서준호', userId: 'junho555', allergies: ['조개류(굴, 전복, 홍합 포함)'], status: '활성', role: '사용자', gender: '남자', name: '서준호', birthdate: '1989-12-22', cookingTools: ['전자레인지', '에어프라이어', '오븐'] },
  { id: 10, nickname: '임수진', userId: 'sujin666', allergies: ['우유', '난류(가금류)'], status: '활성', role: '관리자', gender: '여자', name: '임수진', birthdate: '1994-06-08', cookingTools: ['프라이팬'] },
  { id: 11, nickname: '오동혁', userId: 'donghyuk777', allergies: ['땅콩'], status: '활성', role: '사용자', gender: '남자', name: '오동혁', birthdate: '1990-02-14', cookingTools: ['전자레인지', '냄비'] },
  { id: 12, nickname: '송하은', userId: 'haeun888', allergies: [], status: '활성', role: '사용자', gender: '여자', name: '송하은', birthdate: '1998-10-30', cookingTools: ['에어프라이어', '믹서기', '볼'] }
];

function AdminUser() {
  const [users, setUsers] = useState(dummyUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const allergyOptions = ['난류(가금류)', '우유', '메밀', '땅콩', '대두', '밀', '고등어', '돼지고기', '복숭아', '토마토', '아황산염', '호두', '닭고기', '조개류(굴, 전복, 홍합 포함)', '게', '새우', '오징어', '소고기'];
  const cookingToolOptions = ['냄비', '프라이팬', '볼', '계량스푼', '키친타올', '계량컵', '오븐', '찜기', '내열용기', '밀폐용기', '믹서기', '거품기', '전기밥솥', '면보', '채망', '토치', '전자레인지', '에어프라이어', '스텐트레이', '랩', '매셔'];

  const usersPerPage = 10;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleRowClick = (user) => {
    setSelectedUser({
      ...user,
      password: '',
      passwordConfirm: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleInputChange = (field, value) => {
    setSelectedUser({
      ...selectedUser,
      [field]: value
    });
  };

  const toggleAllergy = (allergy) => {
    const allergies = selectedUser.allergies || [];
    if (allergies.includes(allergy)) {
      setSelectedUser({
        ...selectedUser,
        allergies: allergies.filter(a => a !== allergy)
      });
    } else {
      setSelectedUser({
        ...selectedUser,
        allergies: [...allergies, allergy]
      });
    }
  };

  const toggleCookingTool = (tool) => {
    const tools = selectedUser.cookingTools || [];
    if (tools.includes(tool)) {
      setSelectedUser({
        ...selectedUser,
        cookingTools: tools.filter(t => t !== tool)
      });
    } else {
      setSelectedUser({
        ...selectedUser,
        cookingTools: [...tools, tool]
      });
    }
  };

  const handleUpdate = () => {
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        const updated = { ...selectedUser };
        if (!selectedUser.password) {
          delete updated.password;
          delete updated.passwordConfirm;
        }
        return updated;
      }
      return user;
    });
    setUsers(updatedUsers);
    alert('수정이 완료되었습니다.');
    handleCloseModal();
  };

  const handleDelete = () => {
    if (window.confirm('정말 이 계정을 삭제하시겠습니까?')) {
      setUsers(users.filter(user => user.id !== selectedUser.id));
      alert('계정이 삭제되었습니다.');
      handleCloseModal();
    }
  };

  return (
    <div className="admin-user-page">
      <h2 className="page-title">사용자 목록 상세 조회 및 계정 상태 관리</h2>
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>닉네임</th>
              <th>아이디</th>
              <th>계정 상태</th>
              <th>사용자/관리자</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id} onClick={() => handleRowClick(user)}>
                <td>{user.id}</td>
                <td>{user.nickname}</td>
                <td>{user.userId}</td>
                <td>
                  <span className={`status-badge ${user.status === '활성' ? 'active' : 'inactive'}`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>

            {/* 회원 기본 정보 수정 */}
            <div className="modal-section">
              <div className="section-header">
                <h3 className="admin-section-title">회원 기본 정보 수정</h3>
                <div className="admin-section-line"></div>
              </div>
              
              <div className="form-group">
                <label>닉네임</label>
                <input 
                  type="text" 
                  value={selectedUser.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  placeholder="John Smith"
                />
              </div>

              <div className="form-group">
                <label>아이디</label>
                <input 
                  type="text" 
                  value={selectedUser.userId}
                  onChange={(e) => handleInputChange('userId', e.target.value)}
                  placeholder="abcd1234"
                />
              </div>

              <div className="form-group">
                <label>비밀번호</label>
                <input 
                  type="password" 
                  value={selectedUser.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="****"
                />
              </div>

              <div className="form-group">
                <label>비밀번호 확인</label>
                <input 
                  type="password" 
                  value={selectedUser.passwordConfirm}
                  onChange={(e) => handleInputChange('passwordConfirm', e.target.value)}
                  placeholder="****"
                />
              </div>

              <div className="form-group">
                <label>이름</label>
                <input 
                  type="text" 
                  value={selectedUser.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="홍길동"
                />
              </div>

              <div className="form-group">
                <label>생년월일</label>
                <input 
                  type="text" 
                  value={selectedUser.birthdate}
                  onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
                <small>생년월일은 8자리(YYYYMMDD)로 입력해주세요.</small>
              </div>

              <div className="form-group">
                <label>성별</label>
                <div className="admin-gender-buttons">
                  <button 
                    className={`admin-gender-button ${selectedUser.gender === '남자' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('gender', '남자')}
                  >
                    남자
                  </button>
                  <button 
                    className={`admin-gender-button ${selectedUser.gender === '여자' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('gender', '여자')}
                  >
                    여자
                  </button>
                </div>
              </div>
            </div>

            {/* 회원 상세 정보 수정 */}
            <div className="modal-section">
              <div className="section-header">
                <h3 className="admin-section-title">회원 상세 정보 수정</h3>
                <div className="admin-section-line"></div>
              </div>
              
              <div className="form-group">
                <label>알레르기</label>
                <div className="tag-container">
                  {allergyOptions.map(allergy => (
                    <button
                      key={allergy}
                      className={`tag-btn allergy ${selectedUser.allergies?.includes(allergy) ? 'selected' : ''}`}
                      onClick={() => toggleAllergy(allergy)}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>조리도구</label>
                <div className="tag-container">
                  {cookingToolOptions.map(tool => (
                    <button
                      key={tool}
                      className={`tag-btn cooking-tool ${selectedUser.cookingTools?.includes(tool) ? 'selected' : ''}`}
                      onClick={() => toggleCookingTool(tool)}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-delete" onClick={handleDelete}>
                계정 삭제
              </button>
              <button className="btn-update" onClick={handleUpdate}>
                수정 완료
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUser;
