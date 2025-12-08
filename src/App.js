import React, {useState} from 'react';
import './App.css';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoadingProvider } from './components/LoadingProvider';
import Header from './components/Header';
import MainHeader from './components/MainHeader';
import Nav from './components/Nav';
import Footer from './components/Footer';

// 사용자 페이지
import Myfridge from './pages/Myfridge';
import Recom from './pages/Recom';
import RecipeDetail from './pages/RecipeDetail';
import Mypage from './pages/Mypage';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Userlogin from './pages/Userlogin';
import FindAccount01 from './pages/FindAccount01';
import FindAccount02 from './pages/FindAccount02';
import InfoRegistration from './pages/InfoRegistration';
import IngredientRegistration from './pages/IngredientRegistration';
import Main from './pages/Main';

// 관리자 페이지
import AdminMain from './admin/AdminMain';
import AdminUser from './admin/AdminUser';
import AdminRecipe from './admin/AdminRecipe';
import AdminHeader from './admin/AdminHeader';
import AdminLayout from './admin/AdminLayout';
import AdminStatistics from './admin/AdminStatistics';

// 로그인 여부를 확인하는 함수
const isAuthenticated = () => !!localStorage.getItem('token');
// 사용자 권한 확인 함수
const getUserInfo = () => {
  const userInfo = localStorage.getItem('user');
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return null;
};

function AppContent() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (query) => setSearchQuery(query);

  const isAdmin = true;
  const isAdminPage = location.pathname.toLocaleLowerCase().startsWith('/admin');

   return (
     <div className='app'>
      {!isAdminPage && (
        <>
          {location.pathname === '/Main' ? <MainHeader onSearch={handleSearch} /> : <Header />}
        </>
      )}
      
      {/* 관리자 페이지는 main-content-wrapper 밖에 배치 */}
      {isAdminPage ? (
        <Routes>
          <Route path="/admin" element={isAdmin ? <AdminLayout /> : <Navigate to="/" />}>
            <Route index element={<AdminMain />} /> 
            <Route path="AdminUser" element={<AdminUser />} />
            <Route path="AdminRecipe" element={<AdminRecipe />} />
            <Route path="AdminStatistics" element={<AdminStatistics />} />
          </Route>
        </Routes>
      ) : (
        <>
          <div className='main-content-wrapper'>
            <Nav isAdmin={isAdmin} />
            <div className='content'>
              <Routes>
                <Route path="/" element={isAuthenticated() ? <Navigate to="/Main" /> : <Navigate to="/Home" />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Myfridge" element={<Myfridge />}/>
                <Route path="/Recom" element={<Recom />}/>
                <Route path="/Mypage" element={<Mypage />}/>
                <Route path="/Register" element={<Register />}/>
                <Route path="/Login" element={<Login />}/>
                <Route path="/FindAccount01" element={<FindAccount01 />}/>
                <Route path="/FindAccount02" element={<FindAccount02 />}/>
                <Route path="/Userlogin" element={<Userlogin />}/>
                <Route path="/InfoRegistration" element={<InfoRegistration />} />
                <Route path="/IngredientRegistration" element={<IngredientRegistration />} />
                <Route path="/RecipeDetail/:id" element={<RecipeDetail />} />
                <Route path="/Main" element={<Main />}/>
              </Routes>
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
   );
}

function App() {
  return (
    <LoadingProvider delay={2500}>
        <AppContent />
    </LoadingProvider>
  );
}

export default App;
