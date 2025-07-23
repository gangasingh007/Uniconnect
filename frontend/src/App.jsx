import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Register from './components/Register'
import Login from './components/Login'
import LandingPage from './pages/LandingPage'
import toast, { Toaster } from 'react-hot-toast';
import { errorAtom, loadingAtom } from './atoms/states.atom'
import { useRecoilState } from 'recoil'
import Loader from './components/Loader'
import axios from 'axios'
import { userAtom } from './atoms/userAtom'
import ProfilePage from './pages/ProfilePage'
import SubjectPage from './pages/SubjectPage'


const App = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [error, setError] = useRecoilState(errorAtom);
  const [user, setuser] = useRecoilState(userAtom);
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
        position="bottom-right"
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
        <Route path='/subject' element={<ProtectedRoute>
          <SubjectPage></SubjectPage>
        </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>}
    </div>
  )
}

export default App