import React, { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Register from './components/Register'
import Login from './components/Login'
import LandingPage from './pages/LandingPage'
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'linear-gradient(135deg, #1e1e3f72,#1e1e3f72)',
            color: '#e2e8f0',
            border: '1px solid #7c3aed53',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 0 2px rgba(124, 58, 237, 0.3)',
            fontWeight: 500,
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#1e1e2f',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#1e1e2f',
            },
          },
        }}
      />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute>
          <Home />
        </ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App