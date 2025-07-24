import { motion } from 'framer-motion'
import React, { useState } from 'react';
import { User, Edit3, Mail, GraduationCap, Calendar, Hash, Book, Users, X, Save, Eye, EyeOff, Home, ArrowRightLeft, ArrowLeft, UserRoundCheck } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Mock user data - replace with your actual user data


const ProfilePage = () => {
    const [user, setUser] = useRecoilState(userAtom)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        courseName: user?.courseName || '',
        section: user?.section || '',
        semester: user?.semester || '',
        rollNumber: user?.rollNumber || '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const goHome = () => navigate('/');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Call backend API to update user
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/v1/auth/student/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Failed to update user");
            const data = await res.json();
            // Update user data (remove password from display data)
            const { user: updatedUser } = data;
            setUser(prev => ({
                ...prev,
                ...updatedUser
            }));
            setIsEditModalOpen(false);
            toast.success("User Updated Successfully")
            console.log('User updated successfully');
        } catch (error) {
            toast.error("Something went wrong")
            console.error('Update failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openEditModal = () => {
        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            courseName: user?.courseName || '',
            section: user?.section || '',
            semester: user?.semester || '',
            rollNumber: user?.rollNumber || '',
            password: ''
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setShowPassword(false);
    };

    return (
       <> <motion.div
       initial={{ opacity: 0, y: 40 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
     >
        <div className="min-h-screen  p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 mb-2">
                            Profile Settings
                        </h1>
                        <p className="text-gray-400">Manage your account information and preferences</p>
                    </div>
                    <button
                        onClick={goHome}
                        className="px-4 py-2 hover:bg-purple-500/20 rounded-xl transition-all duration-200 hover:scale-110 "
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 " /> 
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-[#1f1f35] border border-[#3a3a50] rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">
                                    {(user?.firstName || '') + ' ' + (user?.lastName || '')}
                                </h2>
                                <p className="text-gray-400 flex items-center overflow-hidden">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {user?.email || ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={openEditModal}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    </div>

                    {/* Profile Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-[#252540] rounded-lg p-6 border border-[#3a3a50]">
                            <div className="flex items-center mb-3">
                                <GraduationCap className="w-5 h-5 text-purple-400 mr-3" />
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Course</h3>
                            </div>
                            <p className="text-lg font-semibold text-white">{user?.courseName || ''}</p>
                        </div>

                        <div className="bg-[#252540] rounded-lg p-6 border border-[#3a3a50]">
                            <div className="flex items-center mb-3">
                                <Users className="w-5 h-5 text-blue-400 mr-3" />
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Section</h3>
                            </div>
                            <p className="text-lg font-semibold text-white">Section {user?.section || ''}</p>
                        </div>

                        <div className="bg-[#252540] rounded-lg p-6 border border-[#3a3a50]">
                            <div className="flex items-center mb-3">
                                <Calendar className="w-5 h-5 text-green-400 mr-3" />
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Semester</h3>
                            </div>
                            <p className="text-lg font-semibold text-white">{user?.semester || ''}th Semester</p>
                        </div>

                        <div className="bg-[#252540] rounded-lg p-6 border border-[#3a3a50]">
                            <div className="flex items-center mb-3">
                                <Hash className="w-5 h-5 text-pink-400 mr-3" />
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Roll Number</h3>
                            </div>
                            <p className="text-lg font-semibold text-white">{user?.rollNumber || ''}</p>
                        </div>
                        <div className="bg-[#252540] rounded-lg p-6 border border-[#3a3a50]">
                            <div className="flex items-center mb-3">
                            <UserRoundCheck className="w-5 h-5 text-orange-400 mr-3" />
                            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide"/>
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Role </h3>
                            </div>
                            <p className="text-lg font-semibold text-white">{user?.role || ''}</p>
                        </div>
                    </div>
                </div>
                
            </div>
       
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                        onClick={closeEditModal}
                    />
                    
                    {/* Modal */}
                    <div className="relative bg-[#1f1f35] border border-[#3a3a50] rounded-2xl p-7 w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl transform transition-all duration-300 scale-100">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                Edit Profile
                            </h2>
                            <button
                                onClick={closeEditModal}
                                className="p-2 rounded-lg bg-[#252540] hover:bg-[#2f2f4a] text-gray-400 hover:text-white transition-all duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Course Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Course Name
                                    </label>
                                    <input
                                        type="text"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>

                                {/* Roll Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Roll Number
                                    </label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={formData.rollNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Section
                                    </label>
                                    <input
                                        type="text"
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>

                                {/* Semester */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Semester
                                    </label>
                                    <input
                                        type="text"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password (Optional)
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Leave blank to keep current password"
                                        className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Form Buttons */}
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 px-6 py-3 bg-[#252540] hover:bg-[#2f2f4a] text-gray-300 hover:text-white border border-[#3a3a50] rounded-lg transition-all duration-200"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    onClick={handleSubmit}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </motion.div>
        </>
    );
};

export default ProfilePage;