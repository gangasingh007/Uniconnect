import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  
import { useRecoilState } from 'recoil';
import { authAtom } from '../atoms/authAtom';
import toast from 'react-hot-toast';
import { loadingAtom } from '../atoms/states.atom';
import Loader from './Loader';

const Login = () => {
  const [rollNumber , setrollNumber] = useState("")
  const [password, setpassword] = useState("")
  const [loading, setloading] = useRecoilState(loadingAtom);
  const [auth , setauth] = useRecoilState(authAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/v1/auth/student/login",{
        rollNumber,
        password
      })
      const data = res.data;
      const token = data.token
      setauth({ token: data.token ,user : data.user });
      toast.success('Login successful!')
      localStorage.setItem('token', token);
      navigate("/");
    } catch (error) {
      console.log(error)
      toast.error('Login failed'); 
    }
    finally{
      setloading(false);
    }
  };

  return (
    <>
      {loading ? <Loader /> : <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="w-full max-w-md rounded-2xl p-6 border border-slate-500/50"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">UniConnect</h1>
          <h2 className="text-2xl font-semibold text-white mb-2">Sign In</h2>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="bg-slate-1000/50 backdrop-blur-sm ">
            {/* Roll Number */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Roll Number
              </label>
              <input
                type="text"
                name="rollNumber"
                value={rollNumber}
                onChange={(e) => setrollNumber(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Enter roll number"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Sign In
            </button>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Need an account?{' '}
            <button onClick={() => { navigate("/register") }} className="text-purple-800 hover:text-purple-500 font-medium transition-colors">
              Create Account
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>}
    </>
  );
};

export default Login;