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
import ExplorePage from './pages/ExplorePage'
import Syllabus from './pages/Syllabus'
import DateSheet from './pages/DateSheet'
import AcademicCalender from './pages/AcademicCalender'
import FileUpload from './components/FileUpload'


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
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/student/me`, {
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
  position="bottom-center"
  gutter={12}
  toastOptions={{
    duration: 4500,
    style: {
      background: 'rgba(15, 15, 35, 0.85)',
      color: '#f1f5f9',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      padding: '16px 20px',
      borderRadius: '20px',
      boxShadow: `
        0 20px 40px -12px rgba(0, 0, 0, 0.4),
        0 8px 32px rgba(139, 92, 246, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `,
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '1.5',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      minWidth: '320px',
      maxWidth: '480px',
      wordBreak: 'break-word',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform: 'translateZ(0)', // Enable hardware acceleration
    },
    
    success: {
      duration: 4000,
      style: {
        background: 'rgba(6, 78, 59, 0.9)',
        border: '1px solid rgba(34, 197, 94, 0.4)',
        boxShadow: `
          0 20px 40px -12px rgba(0, 0, 0, 0.4),
          0 8px 32px rgba(34, 197, 94, 0.15),
          inset 0 1px 0 rgba(34, 197, 94, 0.2),
          0 0 0 1px rgba(34, 197, 94, 0.05)
        `,
        color: '#ecfdf5',
      },
      iconTheme: {
        primary: '#22c55e',
        secondary: 'rgba(6, 78, 59, 0.9)',
      },
    },
    
    error: {
      duration: 5000,
      style: {
        background: 'rgba(127, 29, 29, 0.9)',
        border: '1px solid rgba(248, 113, 113, 0.4)',
        boxShadow: `
          0 20px 40px -12px rgba(0, 0, 0, 0.4),
          0 8px 32px rgba(248, 113, 113, 0.15),
          inset 0 1px 0 rgba(248, 113, 113, 0.2),
          0 0 0 1px rgba(248, 113, 113, 0.05)
        `,
        color: '#fef2f2',
      },
      iconTheme: {
        primary: '#f87171',
        secondary: 'rgba(127, 29, 29, 0.9)',
      },
    },
    
    loading: {
      duration: Infinity,
      style: {
        background: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid rgba(148, 163, 184, 0.3)',
        boxShadow: `
          0 20px 40px -12px rgba(0, 0, 0, 0.4),
          0 8px 32px rgba(148, 163, 184, 0.1),
          inset 0 1px 0 rgba(148, 163, 184, 0.15)
        `,
        color: '#f8fafc',
      },
      iconTheme: {
        primary: '#94a3b8',
        secondary: 'rgba(30, 41, 59, 0.9)',
      },
    },
    
    // Custom styles for different toast types
    blank: {
      style: {
        background: 'rgba(30, 30, 60, 0.85)',
        border: '1px solid rgba(165, 180, 252, 0.3)',
        boxShadow: `
          0 20px 40px -12px rgba(0, 0, 0, 0.4),
          0 8px 32px rgba(165, 180, 252, 0.12),
          inset 0 1px 0 rgba(255, 255, 255, 0.08)
        `,
      },
    },
    
    // Enhanced accessibility
    className: 'custom-toast',
    ariaProps: {
      role: 'alert',
      'aria-live': 'assertive',
      'aria-atomic': 'true',
    },
  }}
  
  containerStyle={{
    top: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 99999,
    pointerEvents: 'none',
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
        <Route path='/explore' element={<ProtectedRoute>
        <ExplorePage></ExplorePage>
      </ProtectedRoute>}/>
        <Route path='/syllabus' element={<ProtectedRoute>
        <Syllabus />
      </ProtectedRoute>}/>
        <Route path='/datesheet' element={<ProtectedRoute>
        <DateSheet />
      </ProtectedRoute>}/>
        <Route path='/ac-calendar' element={<ProtectedRoute>
        <AcademicCalender />
      </ProtectedRoute>}/>
        <Route path='/upload' element={<ProtectedRoute>
        <FileUpload />
      </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>}
    </div>
  )
}

export default App