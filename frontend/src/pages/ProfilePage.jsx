import { motion } from 'framer-motion'
import React, { useState } from 'react';
import { User, Edit3, Mail, GraduationCap, Calendar, Hash, Book, Users, X, Save, Eye, EyeOff, Home, ArrowRightLeft, ArrowLeft, UserRoundCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();
    const goHome = () => navigate('/');

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.courseName.trim()) errors.courseName = 'Course name is required';
        if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll number is required';
        if (!formData.section.trim()) errors.section = 'Section is required';
        if (!formData.semester.trim()) errors.semester = 'Semester is required';
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the validation errors");
            return;
        }

        setIsLoading(true);

        try {
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
            const { user: updatedUser } = data;
            setUser(prev => ({
                ...prev,
                ...updatedUser
            }));
            setIsEditModalOpen(false);
            toast.success("Profile updated successfully!")
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
        setValidationErrors({});
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setShowPassword(false);
        setValidationErrors({});
    };

    const profileCards = [
        { icon: GraduationCap, label: 'Course', value: user?.courseName, color: 'purple' },
        { icon: Users, label: 'Section', value: `Section ${user?.section}`, color: 'blue' },
        { icon: Calendar, label: 'Semester', value: `${user?.semester}th Semester`, color: 'green' },
        { icon: Hash, label: 'Roll Number', value: user?.rollNumber, color: 'pink' },
        { icon: UserRoundCheck, label: 'Role', value: user?.role, color: 'orange' }
    ];

    const getCardColorClasses = (color) => {
        const colors = {
            purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 shadow-purple-500/10',
            blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 shadow-blue-500/10',
            green: 'from-green-500/20 to-green-600/5 border-green-500/30 shadow-green-500/10',
            pink: 'from-pink-500/20 to-pink-600/5 border-pink-500/30 shadow-pink-500/10',
            orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 shadow-orange-500/10'
        };
        return colors[color] || colors.purple;
    };

    const getIconColorClasses = (color) => {
        const colors = {
            purple: 'text-purple-400',
            blue: 'text-blue-400',
            green: 'text-green-400',
            pink: 'text-pink-400',
            orange: 'text-orange-400'
        };
        return colors[color] || colors.purple;
    };

    return (
        <div className="min-h-screen  p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <motion.div 
                    className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div>
                        <h1 className="text-3xl pb-1 sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 mb-2">
                            Profile Settings
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base">Manage your account information and preferences</p>
                    </div>
                    <button
                        onClick={goHome}
                        className="flex items-center px-4 py-2 hover:bg-purple-500/20 rounded-xl transition-all duration-300 hover:scale-110 text-gray-300 hover:text-white group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span className="hidden sm:inline">Back to Home</span>
                    </button>
                </motion.div>

                {/* Profile Card */}
                <motion.div 
                    className="bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] border border-[#3a3a50] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
                    
                    {/* Profile Header */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 relative">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4 lg:mb-0">
                            <motion.div 
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-purple-500/20"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                            >
                                {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')}
                            </motion.div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    {(user?.firstName || '') + ' ' + (user?.lastName || '')}
                                </h2>
                                <p className="text-gray-400 flex items-center text-sm sm:text-base">
                                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">{user?.email || ''}</span>
                                </p>
                            </div>
                        </div>
                        <motion.button
                            onClick={openEditModal}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                            Edit Profile
                        </motion.button>
                    </div>

                    {/* Profile Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {profileCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <motion.div
                                    key={card.label}
                                    className={`bg-gradient-to-br ${getCardColorClasses(card.color)} rounded-xl p-6 border backdrop-blur-sm hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    <div className="flex items-center mb-3">
                                        <Icon className={`w-5 h-5 ${getIconColorClasses(card.color)} mr-3 group-hover:scale-110 transition-transform duration-300`} />
                                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide group-hover:text-gray-300 transition-colors duration-300">
                                            {card.label}
                                        </h3>
                                    </div>
                                    <p className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">
                                        {card.value || 'Not specified'}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>

            {/* Enhanced Edit Modal */}
            {isEditModalOpen && (
                <motion.div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Enhanced Backdrop */}
                    <motion.div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
                        onClick={closeEditModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                    
                    {/* Enhanced Modal */}
                    <motion.div 
                        className="relative bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] border border-[#3a3a50] rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl transform"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-3xl" />
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-8 relative">
                            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                Edit Profile
                            </h2>
                            <motion.button
                                onClick={closeEditModal}
                                className="p-2 rounded-xl bg-[#252540] hover:bg-[#2f2f4a] text-gray-400 hover:text-white transition-all duration-200 group"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Enhanced Form */}
                        <form onSubmit={handleSubmit} className="space-y-6 relative">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.firstName ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    />
                                    {validationErrors.firstName && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {validationErrors.firstName}
                                        </p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.lastName ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    />
                                    {validationErrors.lastName && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {validationErrors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.email ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                                    required
                                />
                                {validationErrors.email && (
                                    <p className="text-red-400 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {validationErrors.email}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Course Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Course Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="courseName"
                                        value={formData.courseName}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.courseName ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    />
                                    {validationErrors.courseName && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {validationErrors.courseName}
                                        </p>
                                    )}
                                </div>

                                {/* Roll Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Roll Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={formData.rollNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.rollNumber ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    />
                                    {validationErrors.rollNumber && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {validationErrors.rollNumber}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Section *
                                    </label>
                                    <input
                                        type="text"
                                        name="section"
                                        value={formData.section}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.section ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    />
                                    {validationErrors.section && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {validationErrors.section}
                                        </p>
                                    )}
                                </div>

                                {/* Semester */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Semester *
                                    </label>
                                    <input
                                        type="text"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.semester ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    />
                                    {validationErrors.semester && (
                                        <p className="text-red-400 text-xs mt-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            {validationErrors.semester}
                                        </p>
                                    )}
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
                                        className="w-full px-4 py-3 bg-[#252540] border border-[#3a3a50] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 pr-12"
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

                            {/* Enhanced Form Buttons */}
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                                <motion.button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="flex-1 px-6 py-3 bg-[#252540] hover:bg-[#2f2f4a] text-gray-300 hover:text-white border border-[#3a3a50] rounded-xl transition-all duration-200 hover:shadow-lg"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                            Save Changes
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default ProfilePage;
