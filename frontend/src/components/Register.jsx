import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authAtom } from '../atoms/authAtom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [auth , setAuth] = useRecoilState(authAtom);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    courseName: '',
    section: '',
    semester: '',
    rollNumber: ''
  });
  const [loading, setloading] = useState(false);
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/v1/auth/user/register",formData)
      const data = res.data;
      const token  = data.token
      setAuth({user : data.user , token : token})
      localStorage.setItem("token",token)
      toast.success("Welcome!!")
      navigate("/")
    } catch (error) {
      toast.error("Something Went Wrong!")
      console.log(error)
    }
    finally{
      setloading(false)
    }
  };

  return (
    <motion.div
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
          <h2 className="text-2xl font-semibold text-white mb-2">Create Account</h2>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="bg-slate-1000/50 backdrop-blur-sm ">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="First Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="example@gmail.com"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Create a strong password"
                required
              />
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Class
                </label>
                <input
                  list="classes"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className="w-full px-4 py-3  bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Select class"
                  required
                />
                <datalist id="classes">
                  <option value="Btech" />
                  <option value="Mtech" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Section
                </label>
                <input
                  list="sections"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Select section"
                  required
                />
                <datalist id="sections">
                  <option value="A" />
                  <option value="B" />
                  <option value="C" />
                  <option value="CE" />
                  <option value="D" />
                </datalist>
              </div>
            </div>

            {/* Semester and Roll Number */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Semester
                </label>
                <input
                  list="semesters"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-3  bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Select semester"
                  required
                />
                <datalist id="semesters">
                  <option value="1" />
                  <option value="2" />
                  <option value="3" />
                  <option value="4" />
                  <option value="5" />
                  <option value="6" />
                  <option value="7" />
                  <option value="8" />
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Enter roll number"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {!loading ? "Create Account" : "Loading..."}
            </button>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button onClick={()=>{navigate("/login")}} className="text-purple-800 hover:text-purple-500 font-medium transition-colors">
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;