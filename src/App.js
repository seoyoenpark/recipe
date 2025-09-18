import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingProvider } from './components/LoadingProvider';
import Header from './components/Header';
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

function App() {
   return (
    <LoadingProvider delay={2500}>
     <div className='app'>
       <Header />
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
