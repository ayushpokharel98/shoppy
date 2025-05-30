import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './auth/ProtectedRoute'
import Profile from './pages/Profile'
import PublicRoute from './auth/PublicRoute'
import Landing from './pages/Landing'
import Cart from './pages/Cart'
import Admin from './pages/Admin'
import { useAuth } from './auth/AuthContext'

const App = () => {
  const { admin } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />

        <Route
          path='/admin'
          element={admin ? <Admin /> : <Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
