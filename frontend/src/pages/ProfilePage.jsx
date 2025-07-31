import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { User, Edit3, Mail, GraduationCap, Calendar, Hash, Book, Users, X, Save, Eye, EyeOff, Home, ArrowLeft, UserRoundCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
    const [user, setUser] = useRecoilState(userAtom);
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

    // Form validation logic
    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.courseName.trim()) errors.courseName = 'Course name is required';
        if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll number is required';
        if (!formData.section.trim()) errors.section = 'Section is required';
        if (!formData.semester.trim()) errors.semester = 'Semester is required';
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input changes and clear validation errors
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the errors before submitting.");
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
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            const data = await res.json();
            setUser(prev => ({ ...prev, ...data.user }));
            setIsEditModalOpen(false);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("An error occurred while updating.");
            console.error('Update failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Open and initialize the edit modal
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
    };

    // Data for the profile detail cards
    const profileCards = [
        { icon: GraduationCap, label: 'Course', value: user?.courseName, color: 'purple' },
        { icon: Users, label: 'Section', value: user?.section ? `Section ${user.section}` : '', color: 'blue' },
        { icon: Calendar, label: 'Semester', value: user?.semester ? `${user.semester}th Semester` : '', color: 'green' },
        { icon: Hash, label: 'Roll Number', value: user?.rollNumber, color: 'pink' },
        { icon: UserRoundCheck, label: 'Role', value: user?.role, color: 'orange' }
    ];

    // Color utility functions for cards and icons
    const getCardColorClasses = (color) => ({
        purple: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 shadow-purple-500/10',
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 shadow-blue-500/10',
        green: 'from-green-500/20 to-green-600/5 border-green-500/30 shadow-green-500/10',
        pink: 'from-pink-500/20 to-pink-600/5 border-pink-500/30 shadow-pink-500/10',
        orange: 'from-orange-500/20 to-orange-600/5 border-orange-500/30 shadow-orange-500/10'
    }[color] || 'from-gray-500/20 to-gray-600/5 border-gray-500/30 shadow-gray-500/10');

    const getIconColorClasses = (color) => ({
        purple: 'text-purple-400',
        blue: 'text-blue-400',
        green: 'text-green-400',
        pink: 'text-pink-400',
        orange: 'text-orange-400'
    }[color] || 'text-gray-400');

    return (
        <div className="relative min-h-screen w-full text-white overflow-hidden">
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Page Header */}
                    <motion.div 
                        className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 mb-2">
                                Profile Settings
                            </h1>
                            <p className="text-gray-400 text-sm sm:text-base">Manage your account information and preferences.</p>
                        </div>
                        <motion.button
                            onClick={goHome}
                            className="flex items-center px-4 py-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-white group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Home
                        </motion.button>
                    </motion.div>

                    {/* Main Profile Card */}
                    <motion.div 
                        className="bg-black/20 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-lg relative overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none" />
                        
                        {/* Profile Header within the card */}
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
                            <div className="flex items-center gap-6 mb-4 lg:mb-0">
                                <motion.div 
                                    className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl ring-4 ring-white/10"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                >
                                    {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')}
                                </motion.div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                                        {`${user?.firstName || ''} ${user?.lastName || ''}`}
                                    </h2>
                                    <p className="text-gray-400 flex items-center text-sm sm:text-base">
                                        <Mail className="w-4 h-4 mr-2" />
                                        <span className="truncate">{user?.email || ''}</span>
                                    </p>
                                </div>
                            </div>
                            <motion.button
                                onClick={openEditModal}
                                className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                                Edit Profile
                            </motion.button>
                        </div>

                        {/* Profile Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {profileCards.map((card, index) => (
                                <motion.div
                                    key={card.label}
                                    className={`bg-gradient-to-br ${getCardColorClasses(card.color)} rounded-xl p-5 border backdrop-blur-sm hover:shadow-lg transition-all duration-300 group`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    <div className="flex items-center mb-2">
                                        <card.icon className={`w-5 h-5 ${getIconColorClasses(card.color)} mr-3`} />
                                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                                            {card.label}
                                        </h3>
                                    </div>
                                    <p className="text-lg font-semibold text-white truncate">
                                        {card.value || 'Not specified'}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Edit Modal with AnimatePresence */}
                <AnimatePresence>
                    {isEditModalOpen && (
                        <motion.div 
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div 
                                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                                onClick={closeEditModal}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                            
                            <motion.div 
                                className="relative bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none rounded-3xl" />
                                
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                        Edit Profile
                                    </h2>
                                    <motion.button
                                        onClick={closeEditModal}
                                        className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-gray-400 hover:text-white transition-all"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Form fields... (condensed for brevity, same logic as before) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* All input fields go here, using the same structure as your original code */}
                                        {/* Example for one field: */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className={`w-full px-4 py-3 bg-black/30 border ${validationErrors.firstName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`} />
                                            {validationErrors.firstName && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className={`w-full px-4 py-3 bg-black/30 border ${validationErrors.lastName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`} />
                                            {validationErrors.lastName && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.lastName}</p>}
                                        </div>
                                    </div>
                                    {/* ... other fields like email, course, roll number, etc. ... */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Course Name *</label>
                                            <input type="text" name="courseName" value={formData.courseName} onChange={handleInputChange} required className={`w-full px-4 py-3 bg-black/30 border ${validationErrors.courseName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`} />
                                            {validationErrors.courseName && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.courseName}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Roll Number *</label>
                                            <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} required className={`w-full px-4 py-3 bg-black/30 border ${validationErrors.rollNumber ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`} />
                                            {validationErrors.rollNumber && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.rollNumber}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Section *</label>
                                            <input type="text" name="section" value={formData.section} onChange={handleInputChange} required className={`w-full px-4 py-3 bg-black/30 border ${validationErrors.section ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`} />
                                            {validationErrors.section && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.section}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Semester *</label>
                                            <input type="text" name="semester" value={formData.semester} onChange={handleInputChange} required className={`w-full px-4 py-3 bg-black/30 border ${validationErrors.semester ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`} />
                                            {validationErrors.semester && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.semester}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password (Optional)</label>
                                        <div className="relative">
                                            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} placeholder="Leave blank to keep current password" className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition pr-12" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center group"
                                            whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
                                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                        >
                                            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            onClick={closeEditModal}
                                            className="w-full px-6 py-3 bg-black/30 hover:bg-black/50 text-gray-300 border border-white/10 rounded-xl"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfilePage;
