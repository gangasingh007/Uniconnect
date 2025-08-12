import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { authAtom } from '../atoms/authAtom';
import toast from 'react-hot-toast';
import { loadingAtom } from '../atoms/states.atom';
import Loader from './Loader';
import InteractiveBackground from './InteractiveBackground';
import { Eye, EyeOff, Lock, Hash } from 'lucide-react';

const Login = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [showPassword, setShowPassword] = useState(false);
  const [auth, setAuth] = useRecoilState(authAtom);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/student/login`, {
        rollNumber,
        password,
      });

      const data = res.data;
      setAuth({ token: data.token, user: data.user });
      localStorage.setItem("token", data.token);

      toast.success(`Welcome back, ${data.user.firstName || "Student"}!`);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-screen flex items-center justify-center p-4  text-white">
          {/* Animated Background */}
          <InteractiveBackground />

          {/* Login Card */}
          <motion.div
            className="relative z-10 w-full max-w-md"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="text-center p-8 border-b border-white/10 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
                <motion.h1
                  className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-2"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  UniConnect
                </motion.h1>
                <motion.p
                  className="text-gray-300 text-lg"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Sign in to continue your journey
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Roll Number */}
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                    placeholder="Enter Roll Number"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300"
                    placeholder="Enter Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Sign In
                </motion.button>

                {/* Footer */}
                <div className="text-center pt-2">
                  <p className="text-gray-400">
                    Need an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Login;
