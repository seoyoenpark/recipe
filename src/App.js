import React, {useState} from 'react';
import './App.css';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoadingProvider } from './components/LoadingProvider';
import Header from './components/Header';
import MainHeader from './components/MainHeader';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

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

  // 사용자 정보와 관리자 여부 확인
  const currentUser = getUserInfo();
  const isAdmin = currentUser && currentUser.role === 'admin';

  // 현재 경로가 관리자 페이지인지 확인
  const isAdminPage = location.pathname.toLocaleLowerCase().startsWith('/admin');

   return (
     <div className='app'>
      {!isAdminPage && (
        <>
          {location.pathname === '/Main' ? <MainHeader onSearch={handleSearch} /> : <Header />}
        </>
      )}
      <div className='main-content-wrapper'>
        {!isAdminPage && <Nav isAdmin={isAdmin} />}
      <div className='content'>

       <Routes>
         {/* 기본 경로(/)로 접근 시 /Home으로 리다이렉트하는 Route */}
         <Route path="/" element={isAuthenticated() ? <Navigate to="/Main" /> : <Navigate to="/Home" />} />
         <Route path="/Home" element={<Home />} />
         <Route path="/Myfridge" element={<ProtectedRoute><Myfridge /></ProtectedRoute>}/>
         <Route path="/Recom" element={<ProtectedRoute><Recom /></ProtectedRoute>}/>
         <Route path="/Mypage" element={<ProtectedRoute><Mypage /></ProtectedRoute>}/>
         <Route path="/Register" element={<Register />}/>
         <Route path="/Login" element={<Login />}/>
         <Route path="/FindAccount01" element={<FindAccount01 />}/>
         <Route path="/FindAccount02" element={<FindAccount02 />}/>
         <Route path="/Userlogin" element={<Userlogin />}/>
         <Route path="/InfoRegistration" element={<InfoRegistration />} />
         <Route path="/ingredient-registration" element={<IngredientRegistration />} />
         <Route path="/RecipeDetail/:id" element={<RecipeDetail />} />
         <Route path="/Main" element={<Main />}/>
         {/* 관리자 페이지 */}
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
            <Route index element={<AdminProtectedRoute><AdminMain /></AdminProtectedRoute>} /> 
            <Route path="AdminUser" element={<AdminProtectedRoute><AdminUser /></AdminProtectedRoute>} />
            <Route path="AdminRecipe" element={<AdminProtectedRoute><AdminRecipe /></AdminProtectedRoute>} />
            <Route path="AdminStatistics" element={<AdminProtectedRoute><AdminStatistics /></AdminProtectedRoute>} />
          </Route>
       </Routes>
       </div>
       </div>
       {!isAdminPage && <Footer />} 
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
