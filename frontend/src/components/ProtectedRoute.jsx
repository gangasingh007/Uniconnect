import React from 'react'
import { useRecoilValue } from 'recoil'
import { authSelector } from '../atoms/authAtom';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
 const isAuthenticated = useRecoilValue(authSelector);
  return isAuthenticated ? children : <Navigate to="/landing" replace />;
}

export default ProtectedRoute