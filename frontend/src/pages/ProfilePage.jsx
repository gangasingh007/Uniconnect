import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { User, Edit3, Mail, GraduationCap, Calendar, Hash, Book, Users, X, Save, Eye, EyeOff, Home, ArrowLeft, UserRoundCheck, CheckCircle2, AlertCircle, Lock, Sparkles, Camera } from 'lucide-react';
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
        { icon: UserRoundCheck, label: 'Role', value: user?.role, color: 'orange' }
    ];

    return (
        <>
            <div className="relative min-h-screen w-full text-white  overflow-hidden">
                {/* Enhanced Animated Background */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-pink-600/15 blur-[120px] rounded-full -top-40 -left-40 animate-pulse"></div>
                    <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-cyan-600/15 blur-[100px] rounded-full -bottom-20 -right-20 opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
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
                        className="max-w-6xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                    >
                        <PageHeader navigate={navigate} />

                        <motion.div 
                            className="bg-black/20 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden"
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } } }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-3xl" />
                            <ProfileHeader user={user} onEditClick={() => setIsEditModalOpen(true)} />
                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                                variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } } }}
                            >
                                {profileCards.map((card) => (
                                    <ProfileDetailCard key={card.label} {...card} />
                                ))}
                            </motion.div>
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

const PageHeader = ({ navigate }) => (
    <motion.div
        className="mb-12"
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] mb-2">
                    Profile Settings
                </h1>
                <p className="text-lg text-gray-400 max-w-md">Manage your account information, preferences, and academic details.</p>
            </div>
            <motion.button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-white group backdrop-blur-sm"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Home
            </motion.button>
        </div>
    </motion.div>
);

const ProfileHeader = ({ user, onEditClick }) => (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <div className="flex items-center gap-6 mb-6 lg:mb-0">
            <motion.div className="relative group">
                <motion.div 
                    className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full blur opacity-60 group-hover:opacity-80 transition-opacity"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div className="relative w-28 h-28 flex items-center justify-center">
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#1c1c3a] to-[#0a0a0f] flex items-center justify-center text-white font-bold text-4xl shadow-2xl ring-4 ring-white/10 backdrop-blur-sm">
                        {(user?.firstName?.charAt(0) || 'U') + (user?.lastName?.charAt(0) || 'N')}
                    </div>
                </motion.div>
                <motion.div 
                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                >
                    <Camera className="w-8 h-8 text-white" />
                </motion.div>
            </motion.div>
            
            <div className="space-y-1">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                    {`${user?.firstName || ''} ${user?.lastName || ''}`}
                </h2>
                <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span className="truncate text-sm sm:text-base">{user?.email || ''}</span>
                </div>
            </div>
        </div>
        
        <motion.button
            onClick={onEditClick}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group"
            whileHover={{ scale: 1.05, y: -3 }} 
            whileTap={{ scale: 0.95 }}
        >
            <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Edit Profile
        </motion.button>
    </div>
);

const ProfileDetailCard = ({ icon: Icon, label, value, color }) => {
    const colors = {
        purple: { bg: 'from-purple-500/15', border: 'hover:border-purple-400/50', text: 'text-purple-400', glow: 'shadow-purple-500/15' },
        blue: { bg: 'from-blue-500/15', border: 'hover:border-blue-400/50', text: 'text-blue-400', glow: 'shadow-blue-500/15' },
        green: { bg: 'from-green-500/15', border: 'hover:border-green-400/50', text: 'text-green-400', glow: 'shadow-green-500/15' },
        pink: { bg: 'from-pink-500/15', border: 'hover:border-pink-400/50', text: 'text-pink-400', glow: 'shadow-pink-500/15' },
        orange: { bg: 'from-orange-500/15', border: 'hover:border-orange-400/50', text: 'text-orange-400', glow: 'shadow-orange-500/15' },
        teal: { bg: 'from-teal-500/15', border: 'hover:border-teal-400/50', text: 'text-teal-400', glow: 'shadow-teal-500/15' },
    };
    const c = colors[color] || colors.purple;

    return (
        <motion.div
            className={`bg-gradient-to-br ${c.bg} to-black/20 backdrop-blur-sm rounded-2xl p-6 ${c.border} border border-white/10 transition-all duration-300 group hover:shadow-xl ${c.glow} relative`}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, scale: 1.02 }}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-black/20 rounded-lg"><Icon className={`w-5 h-5 ${c.text}`} /></div>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</h3>
            </div>
            <p className="text-xl font-bold text-white truncate">{value || 'Not specified'}</p>
        </motion.div>
    );
};

const EditProfileModal = ({ isOpen, onClose, user, setUser }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    // 🔹 Lock scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

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
        if (!validate()) return toast.error("Please fix errors before submitting.");

        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const payload = { ...formData };
            if (!payload.password) delete payload.password;
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
            setTimeout(() => onClose(), 1500);

        } catch (error) {
            toast.error("An error occurred while updating.");
        } finally {
            setTimeout(() => setIsLoading(false), 1500);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 z-[999] flex items-center justify-center px-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 🔹 Backdrop with blur + strong dim */}
                    <motion.div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-lg cursor-pointer"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* 🔹 Centered Modal */}
                    <motion.div 
                        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto 
                                   rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 
                                   bg-gradient-to-br from-[#1a1a2e]/95 via-[#141427]/95 to-[#101020]/95
                                   backdrop-blur-xl"
                        initial={{ scale: 0.9, y: 30, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 30, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    >
                        {/* 🔹 Modal Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text 
                                           bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400">
                                ✨ Edit Profile
                            </h2>
                            <motion.button 
                                onClick={onClose} 
                                className="p-2 rounded-full bg-black/20 hover:bg-black/50 
                                           text-gray-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.1, rotate: 90 }}
                            >
                                <X size={26} />
                            </motion.button>
                        </div>

                        {/* 🔹 Modal Form */}
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <FormSection title="Personal Information" icon={User}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField icon={User} label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} required />
                                    <InputField icon={User} label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} required />
                                </div>
                                <InputField icon={Mail} label="Email Address" type="email" name="email" value={formData.email || ''} onChange={handleChange} error={errors.email} required />
                            </FormSection>

                            <FormSection title="Academic Information" icon={GraduationCap}>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <InputField icon={Book} label="Course Name" name="courseName" value={formData.courseName || ''} onChange={handleChange} error={errors.courseName} />
                                    <InputField icon={Users} label="Section" name="section" value={formData.section || ''} onChange={handleChange} error={errors.section} />
                                    <InputField icon={Calendar} label="Semester" name="semester" value={formData.semester || ''} onChange={handleChange} error={errors.semester} />
                                </div>
                                <InputField icon={Hash} label="Roll Number" name="rollNumber" value={formData.rollNumber || ''} onChange={handleChange} error={errors.rollNumber} />
                            </FormSection>

                            <FormSection title="Security" icon={Lock}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <InputField icon={Lock} label="New Password" type={showPassword ? "text" : "password"} name="password" value={formData.password || ''} onChange={handleChange} error={errors.password} placeholder="Min. 6 characters" />
                                    <InputField icon={Lock} label="Confirm Password" type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword || ''} onChange={handleChange} error={errors.confirmPassword} placeholder="Confirm new password" />
                                </div>
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mt-2">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    {showPassword ? 'Hide' : 'Show'} Passwords
                                </button>
                            </FormSection>

                            {/* 🔹 Actions */}
                            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-white/10">
                                <ActionButton type="submit" isLoading={isLoading} isSuccess={isSuccess} className="flex-1">Save Changes</ActionButton>
                                <ActionButton type="button" variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">Cancel</ActionButton>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const FormSection = ({ title, icon: Icon, children }) => (
    <motion.div className="space-y-6" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2 bg-purple-500/20 rounded-lg"><Icon className="w-5 h-5 text-purple-400" /></div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const InputField = ({ icon: Icon, label, error, required, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label} {required && <span className="text-red-400">*</span>}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input {...props} className={`w-full pl-12 pr-4 py-3 bg-black/30 border ${error ? 'border-red-500' : 'border-white/10'} focus:border-purple-500 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/20' : 'focus:ring-purple-500/20'} transition-all`} />
        </div>
        {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} />{error}</p>}
    </div>
);

const ActionButton = ({ isLoading, isSuccess, children, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: "bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-purple-500/25 text-white",
        secondary: "bg-black/30 hover:bg-black/50 border-white/10 text-gray-300 border"
    };
    const currentVariant = isSuccess ? "bg-green-500 text-white" : variants[variant];
    return (
        <motion.button 
            className={`px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-50 ${currentVariant} ${className}`}
            whileHover={{ scale: (isLoading || isSuccess) ? 1 : 1.03, y: (isLoading || isSuccess) ? 0 : -2 }}
            whileTap={{ scale: (isLoading || isSuccess) ? 1 : 0.98 }}
            {...props}
        >
            {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/50 border-t-white" />
             : isSuccess ? <><CheckCircle2 size={20} className="mr-2" /> Success!</>
             : children}
        </motion.button>
    );
};

export default ProfilePage;
