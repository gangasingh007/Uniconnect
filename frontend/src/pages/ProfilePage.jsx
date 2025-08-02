import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { User, Edit3, Mail, GraduationCap, Calendar, Hash, Book, Users, X, Save, Eye, EyeOff, Home, ArrowLeft, UserRoundCheck, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

// Main Page Component
const ProfilePage = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    const profileCards = [
        { icon: GraduationCap, label: 'Course', value: user?.courseName, color: 'purple' },
        { icon: Users, label: 'Section', value: user?.section ? `Section ${user.section}` : '', color: 'blue' },
        { icon: Calendar, label: 'Semester', value: user?.semester ? `${user.semester}th Semester` : '', color: 'green' },
        { icon: Hash, label: 'Roll Number', value: user?.rollNumber, color: 'pink' },
        { icon: UserRoundCheck, label: 'Role', value: user?.role, color: 'orange' },
        { icon: Book, label: 'Total Subjects', value: user?.subjects?.length || 0, color: 'teal' },
    ];

    return (
        <>
            <Navbar/>
            <div className="relative min-h-screen w-full text-white bg-[#0a0a0f] overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div 
                      className="absolute inset-0 bg-[length:60px_60px] opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
                        `,
                        animation: 'grid 20s linear infinite'
                      }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0a0f)]"></div>
                </div>

                <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                        className="max-w-6xl mx-auto"
                    >
                        {/* Page Header */}
                        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 mb-2">
                                    Profile Settings
                                </h1>
                                <p className="text-gray-400 text-sm sm:text-base">Manage your account information and preferences.</p>
                            </div>
                            <motion.button
                                onClick={() => navigate('/')}
                                className="flex items-center px-4 py-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-white group"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                                Back to Home
                            </motion.button>
                        </div>

                        {/* Main Profile Card */}
                        <motion.div 
                            className="bg-[#101014] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-lg relative overflow-hidden"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <ProfileHeader user={user} onEditClick={() => setIsEditModalOpen(true)} />
                            
                            {/* Profile Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {profileCards.map((card, index) => (
                                    <ProfileDetailCard key={card.label} {...card} delay={0.8 + index * 0.1} />
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    <EditProfileModal 
                        isOpen={isEditModalOpen} 
                        onClose={() => setIsEditModalOpen(false)} 
                        user={user} 
                        setUser={setUser} 
                    />
                </div>
            </div>
            <Footer />
        </>
    );
};

// --- Helper Components ---

const ProfileHeader = ({ user, onEditClick }) => (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <div className="flex items-center gap-6 mb-4 lg:mb-0">
            <motion.div className="relative w-24 h-24 flex items-center justify-center">
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"
                    animate={{ scale: [1, 1.05, 1], rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl ring-4 ring-white/10">
                    {(user?.firstName?.charAt(0) || '') + (user?.lastName?.charAt(0) || '')}
                </div>
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
            onClick={onEditClick}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
        >
            <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Edit Profile
        </motion.button>
    </div>
);

const ProfileDetailCard = ({ icon: Icon, label, value, color, delay }) => {
    const colors = {
        purple: { bg: 'from-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', shadow: 'shadow-purple-500/10' },
        blue: { bg: 'from-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', shadow: 'shadow-blue-500/10' },
        green: { bg: 'from-green-500/10', border: 'border-green-500/30', text: 'text-green-400', shadow: 'shadow-green-500/10' },
        pink: { bg: 'from-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', shadow: 'shadow-pink-500/10' },
        orange: { bg: 'from-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', shadow: 'shadow-orange-500/10' },
        teal: { bg: 'from-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', shadow: 'shadow-teal-500/10' },
    };
    const c = colors[color] || colors.purple;

    return (
        <motion.div
            className={`bg-gradient-to-br ${c.bg} to-black/10 rounded-xl p-5 ${c.border} border backdrop-blur-sm hover:shadow-lg ${c.shadow} transition-all duration-300 group`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5, scale: 1.02 }}
        >
            <div className="flex items-center mb-2">
                <Icon className={`w-5 h-5 ${c.text} mr-3 group-hover:scale-110 transition-transform`} />
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</h3>
            </div>
            <p className="text-lg font-semibold text-white truncate">{value || 'Not specified'}</p>
        </motion.div>
    );
};

const EditProfileModal = ({ isOpen, onClose, user, setUser }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData({
                firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '',
                courseName: user?.courseName || '', section: user?.section || '', semester: user?.semester || '',
                rollNumber: user?.rollNumber || '', password: '', confirmPassword: ''
            });
            setErrors({});
            setIsSuccess(false);
        }
    }, [isOpen, user]);

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors before submitting.");
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const payload = { ...formData };
            if (!payload.password) {
                delete payload.password; // Don't send empty password
            }
            delete payload.confirmPassword;

            const res = await fetch("http://localhost:3000/api/v1/auth/student/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            const data = await res.json();
            
            setUser(prev => ({ ...prev, ...data.user }));
            toast.success("Profile updated successfully!");
            setIsSuccess(true);
            setTimeout(() => onClose(), 1500); // Close after success animation

        } catch (error) {
            toast.error("An error occurred while updating.");
            console.error('Update failed:', error);
        } finally {
            setTimeout(() => setIsLoading(false), 1500);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                        onClick={onClose}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    />
                    <motion.div 
                        className="relative bg-gradient-to-br from-[#090910] to-[#02020c] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[95vh] overflow-y-auto shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Edit Profile</h2>
                            <motion.button onClick={onClose} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-gray-400 hover:text-white transition-all" whileHover={{ scale: 1.1, rotate: 90 }}>
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={User} label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                                <InputField icon={User} label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
                            </div>
                            <InputField icon={Mail} label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} />
                            <div className="grid md:grid-cols-2 gap-6">
                                <InputField icon={Lock} label="New Password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} error={errors.password} placeholder="Min. 6 characters" />
                                <InputField icon={Lock} label="Confirm Password" type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                            </div>
                            <div className="flex items-center">
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {showPassword ? 'Hide' : 'Show'} Passwords
                                </button>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
                                <ActionButton type="submit" isLoading={isLoading} isSuccess={isSuccess}>Save Changes</ActionButton>
                                <ActionButton type="button" variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</ActionButton>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const InputField = ({ icon: Icon, label, error, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
                {...props}
                className={`w-full pl-12 pr-4 py-3 bg-black/30 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
            />
        </div>
        {error && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{error}</p>}
    </div>
);

const ActionButton = ({ isLoading, isSuccess, children, variant = 'primary', ...props }) => {
    const baseClasses = "w-full px-6 py-3 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center";
    const primaryClasses = "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed";
    const secondaryClasses = "bg-black/30 hover:bg-black/50 text-gray-300 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed";
    const successClasses = "bg-green-500 text-white";

    return (
        <motion.button 
            className={`${baseClasses} ${isSuccess ? successClasses : (variant === 'primary' ? primaryClasses : secondaryClasses)}`}
            whileHover={{ scale: (isLoading || isSuccess) ? 1 : 1.03, y: (isLoading || isSuccess) ? 0 : -2 }}
            whileTap={{ scale: (isLoading || isSuccess) ? 1 : 0.98 }}
            {...props}
        >
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
             : isSuccess ? <><CheckCircle2 className="w-5 h-5 mr-2" /> Success!</>
             : children
            }
        </motion.button>
    );
};

export default ProfilePage;
