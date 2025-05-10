import React from 'react';
import { Route, Routes } from "react-router-dom";
import Layout from './components/layout/Layout'; // Dosya ismi büyük L ile

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
