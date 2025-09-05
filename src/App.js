import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';

// 페이지 컴포넌트 import
import Myrefrig from './pages/Myrefrig';
import Recom from './pages/Recom';
import Mypage from './pages/Mypage';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
   return (
     <div className='app'>
       <Header />
       <Nav />
       <Routes>
         {/* 기본 경로(/)로 접근 시 /Home으로 리다이렉트하는 Route */}
        <Route path="/" element={<Navigate to="/Home" replace />} />
         <Route path="/Home" element={<Home />} />
         <Route path="/myrefrig" element={<Myrefrig />}/>
         <Route path="/recom" element={<Recom />}/>
         <Route path="/mypage" element={<Mypage />}/>
         <Route path="/Register" element={<Register />}/>
         <Route path="/Login" element={<Login />}/>
       </Routes>
     </div>
   );
 }

export default App;
