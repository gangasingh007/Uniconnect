import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Register from './components/Register'
import Login from './components/Login'
import LandingPage from './pages/LandingPage'
import toast, { Toaster } from 'react-hot-toast';
import { errorAtom, loadingAtom } from './atoms/states.atom'
import { useRecoilState, useSetRecoilState } from 'recoil'
import Loader from './components/Loader'
import axios from 'axios'
import { userAtom } from './atoms/userAtom'
import ProfilePage from './pages/ProfilePage'
import SubjectPage from './pages/SubjectPage'
import { classAtom } from './atoms/classAtom'
import ResourcePage from './pages/ResourcePage'


const App = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [error, setError] = useRecoilState(errorAtom);
  const [user, setuser] = useRecoilState(userAtom);
  const setClassId = useSetRecoilState(classAtom)
  const token = localStorage.getItem("token")
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await axios.get("http://localhost:3000/api/v1/auth/student/me", {
          headers: {
            authorization: `Bearer ${token}`
          }
        });
        const myuser = res.data.user
        setuser(myuser);
        setClassId(myuser.classId);
      } catch (err) {
        setError("Failed to fetch user info");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);
  

  return (
    <div className='animated-bg'>
    <Toaster
  position="top"
  toastOptions={{
    duration: 4000,
    style: {
      background: 'linear-gradient(135deg, #1e1e3f99, #2d1b6944)',
      color: '#e2e8f0',
      border: '1px solid #7c3aed66',
      padding: '16px 20px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(124, 58, 237, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
      fontWeight: 500,
      fontSize: '14px',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      minWidth: '320px',
      maxWidth: '500px',
      wordBreak: 'break-word',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    success: {
      style: {
        background: 'linear-gradient(135deg, #1e1e3f99, #065f4644)',
        border: '1px solid #10b98166',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#1e1e2f',
      },
    },
    error: {
      style: {
        background: 'linear-gradient(135deg, #1e1e3f99, #7f1d1d44)',
        border: '1px solid #ef444466',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#1e1e2f',
      },
    },
    loading: {
      style: {
        background: 'linear-gradient(135deg, #1e1e3f99, #374151)',
        border: '1px solid #6b728066',
        boxShadow: '0 8px 32px rgba(107, 114, 128, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)',
      },
      iconTheme: {
        primary: '#6b7280',
        secondary: '#1e1e2f',
      },
    },
    className: '',
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  }}
  containerStyle={{
    top: '20px',
    zIndex: 9999,
  }}
  containerClassName="toast-container"
/>

      {loading ? <Loader /> :
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute>
          <Home />
        </ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path='/profile' element={<ProtectedRoute>
          <ProfilePage></ProfilePage>
        </ProtectedRoute>} />
        <Route path='/subjects' element={<ProtectedRoute>
          <SubjectPage /> 
        </ProtectedRoute>} />
        <Route path="/subjects/resource" element={<ProtectedRoute>
          <ResourcePage />
        </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>}
    </div>
  )
}

export default App