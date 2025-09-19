import React, {useState} from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoadingProvider } from './components/LoadingProvider';
import Header from './components/Header';
import MainHeader from './components/MainHeader';
import Nav from './components/Nav';

// 페이지 컴포넌트 import
import Myfridge from './pages/Myfridge';
import Recom from './pages/Recom';
import Mypage from './pages/Mypage';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Userlogin from './pages/Userlogin';
import InfoRegistration from './pages/InfoRegistration';
import IngredientRegistration from './pages/IngredientRegistration';
import Main from './pages/Main';

// 헤더와 네비게이션을 관리하는 레이아웃 컴포넌트
const Layout = ({ onSearch }) => {
  const location = useLocation();
  const isMainPage = location.pathname === '/Main';

  return (
    <>
      {isMainPage ? <MainHeader onSearch={onSearch} /> : <Header />}
    </>
  );
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    // MainHeader에서 검색어가 입력되면 Main 페이지로 전달하기 위해 상태를 업데이트
    setSearchQuery(query);
  };

   return (
    <LoadingProvider delay={2500}>
     <div className='app'>
      <Layout onSearch={handleSearch} />
       <Nav />
       <Routes>
         {/* 기본 경로(/)로 접근 시 /Home으로 리다이렉트하는 Route */}
         <Route path="/" element={<Navigate to="/Home" replace />} />
         <Route path="/Home" element={<Home />} />
         <Route path="/Myfridge" element={<Myfridge />}/>
         <Route path="/Recom" element={<Recom />}/>
         <Route path="/Mypage" element={<Mypage />}/>
         <Route path="/Register" element={<Register />}/>
         <Route path="/Login" element={<Login />}/>
         <Route path="/Userlogin" element={<Userlogin />}/>
         <Route path="/InfoRegistration" element={<InfoRegistration />} />
         <Route path="/IngredientRegistration" element={<IngredientRegistration />} />
         <Route path="/Main" element={<Main />}/>
       </Routes>
     </div>
     </LoadingProvider>
   );
 }

export default App;
