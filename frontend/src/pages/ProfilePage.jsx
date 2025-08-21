import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import {
    User, Edit3, Mail, GraduationCap, Calendar, Hash, Book, Users, X, Eye, EyeOff,
    ArrowLeft, CheckCircle2, AlertCircle, Lock, Camera, Sparkles,
    ShieldCheck, Star, Crown, Settings
} from 'lucide-react';
import InteractiveBackground from '../components/InteractiveBackground';

const ProfilePage = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            toast.error("Please log in to view your profile.");
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#141423] to-[#1a1a2e]">
                <motion.div 
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-400 rounded-full"></div>
                    <div className="absolute top-2 left-2 w-12 h-12 border-4 border-blue-500/20 border-t-blue-400 rounded-full animate-spin"></div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="relative min-h-screen w-full text-white overflow-x-hidden">
                {/* Enhanced background with overlay */}
                <div className="absolute inset-0 -z-10">
                    <InteractiveBackground />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-purple-900/10"></div>
                </div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 -z-5 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [-20, -100],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                    <motion.div
                        className="max-w-7xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
                        }}
                    >
                        <PageHeader navigate={navigate} />
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Enhanced Left Sidebar */}
                            <motion.div
                                className="lg:col-span-4"
                                variants={{
                                    hidden: { opacity: 0, x: -50 },
                                    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } }
                                }}
                            >
                                <ProfileSidebar user={user} onEditClick={() => setIsEditModalOpen(true)} />
                            </motion.div>
                            
                            {/* Enhanced Right Content Area */}
                            <motion.div
                                className="lg:col-span-8 space-y-8"
                                variants={{
                                    hidden: { opacity: 0, x: 50 },
                                    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120, damping: 20, delay: 0.1 } }
                                }}
                            >
                                <InfoSection title="Personal Details" icon={User} gradient="from-blue-500/20 to-purple-500/20">
                                    <DetailRow label="First Name" value={user?.firstName} icon={User} />
                                    <DetailRow label="Last Name" value={user?.lastName} icon={User} />
                 
                                </InfoSection>
                                
                                <InfoSection title="Academic Information" icon={GraduationCap} gradient="from-purple-500/20 to-pink-500/20">
                                    <DetailRow label="Course" value={user?.courseName} icon={Book} />
                                    <DetailRow label="Section" value={user?.section} icon={Users} />
                                    <DetailRow label="Semester" value={user?.semester} icon={Calendar} />
                                    <DetailRow label="Roll Number" value={user?.rollNumber} icon={Hash} />
                                    <DetailRow label="Account Role" value={user?.role} icon={Crown} />
                                </InfoSection>

                                {/* New Stats Section */}
                                <StatsSection />
                            </motion.div>
                        </div>
                    </motion.div>
                    
                    <AnimatePresence>
                        {isEditModalOpen && (
                            <EditProfileModal
                                isOpen={isEditModalOpen}
                                onClose={() => setIsEditModalOpen(false)}
                                user={user}
                                setUser={setUser}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <Footer />
        </>
    );
};

const PageHeader = ({ navigate }) => (
    <motion.div
        className="mb-16"
        variants={{ 
            hidden: { opacity: 0, y: -30 }, 
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } 
        }}
    >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="relative">
                {/* Glowing background effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-2xl rounded-full opacity-30"></div>
                <div className="relative">
                    <motion.h1 
                        className="text-2xl sm:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent pb-3 mb-4"
                        initial={{ backgroundPosition: "0% 50%" }}
                        animate={{ backgroundPosition: "100% 50%" }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        style={{ backgroundSize: "200% 200%" }}
                    >
                        Profile Settings
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-gray-300 max-w-2xl leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Manage your account information, academic details, and personalize your experience
                    </motion.p>
                </div>
            </div>
            
            <motion.button
                onClick={() => navigate('/')}
                className="group relative overflow-hidden px-8 py-4 bg-black/30 hover:bg-black/50 border border-white/20 hover:border-purple-500/50 rounded-2xl transition-all duration-500 text-gray-300 hover:text-white backdrop-blur-lg shadow-xl hover:shadow-purple-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="relative flex items-center gap-3">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-semibold">Back to Home</span>
                </div>
            </motion.button>
        </div>
    </motion.div>
);

const ProfileSidebar = ({ user, onEditClick }) => (
    <motion.div 
        className="relative group"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
        {/* Enhanced glowing border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
        
        <div className="relative bg-gradient-to-br from-[rgba(20,20,35,0.8)] to-[rgba(10,10,15,0.6)] border border-white/20 rounded-3xl p-10 shadow-2xl backdrop-blur-2xl text-center flex flex-col items-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

            {/* Enhanced Profile Picture */}
            <motion.div 
                className="relative group/pic mb-8"
                whileHover={{ scale: 1.05 }}
            >
                <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 rounded-full blur opacity-50 group-hover/pic:opacity-75"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[#2a2a4a] to-[#0a0a0f] flex items-center justify-center text-white font-bold text-6xl shadow-2xl ring-4 ring-white/20 overflow-hidden">
                    {user?.profilePic ? (
                        <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <span className="bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {(user?.firstName?.charAt(0) || 'U') + (user?.lastName?.charAt(0) || 'N')}
                        </span>
                    )}
                </div>
                <motion.div 
                    className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover/pic:opacity-100 transition-opacity duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                >
                    <Camera className="w-10 h-10 text-white" />
                </motion.div>
            </motion.div>

            {/* Enhanced User Info */}
            <motion.h2 
                className="text-4xl font-bold text-white truncate max-w-full pb-2 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {`${user?.firstName || ''} ${user?.lastName || ''}`}
            </motion.h2>
            
            <motion.p 
                className="text-gray-400 truncate max-w-full mb-8 text-lg "
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {user?.email || ''}
            </motion.p>
            
            {/* Enhanced Verified Badge */}
            <motion.div 
                className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 text-green-300 text-sm px-6 py-3 rounded-full mb-10 shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
            >
                <ShieldCheck size={18} className="text-green-400" />
                <span className="font-medium">Verified Account</span>
                <Star size={16} className="text-yellow-400" />
            </motion.div>
            
            {/* Enhanced Edit Button */}
            <motion.button
                onClick={onEditClick}
                className="group/btn relative w-full overflow-hidden px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-purple-500/50 transition-all duration-500"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                <div className="relative flex items-center justify-center gap-3">
                    <Edit3 className="w-6 h-6 group-hover/btn:rotate-12 transition-transform duration-300" />
                    <span>Edit Profile</span>
                    <Settings className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                </div>
            </motion.button>
        </div>
    </motion.div>
);

const InfoSection = ({ title, icon: Icon, children, gradient = "from-purple-500/20 to-blue-500/20" }) => (
    <motion.div 
        className="group relative overflow-hidden"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        {/* Enhanced background with gradient */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className={`relative bg-gradient-to-br from-[rgba(20,20,35,0.8)] to-[rgba(10,10,15,0.6)] border border-white/10 group-hover:border-white/25 rounded-3xl shadow-2xl backdrop-blur-xl p-8 transition-all duration-500 overflow-hidden`}>
            {/* Decorative gradient overlay */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${gradient}`}></div>
            
            {/* Enhanced Section Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                <motion.div 
                    className={`p-4 bg-gradient-to-br ${gradient} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                >
                    <Icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">{title}</h3>
            </div>
            
            <div className="space-y-2">
                {children}
            </div>
        </div>
    </motion.div>
);

const DetailRow = ({ label, value, icon: Icon }) => (
    <motion.div 
        className="group/row flex items-center justify-between p-5 -mx-5 transition-all duration-300 hover:bg-white/5 rounded-xl cursor-default"
        whileHover={{ x: 5 }}
    >
        <div className="flex items-center gap-4">
            {Icon && (
                <div className="p-2 bg-white/5 rounded-lg group-hover/row:bg-white/10 transition-colors">
                    <Icon className="w-5 h-5 text-gray-400 group-hover/row:text-white transition-colors" />
                </div>
            )}
            <p className="text-lg text-gray-400 font-medium group-hover/row:text-gray-300 transition-colors">{label}</p>
        </div>
        <p className="text-xl font-bold text-gray-100 group-hover/row:text-white transition-colors">
            {value || 'Not specified'}
        </p>
    </motion.div>
);

// New Stats Section Component
const StatsSection = () => (
    <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
        }}
    >
        <StatCard title="Profile Complete" value="85%" color="from-green-500 to-emerald-500" />
        <StatCard title="Account Status" value="Active" color="from-blue-500 to-cyan-500" />
        <StatCard title="Member Since" value="2025" color="from-purple-500 to-pink-500" />
    </motion.div>
);

const StatCard = ({ title, value, color }) => (
    <motion.div
        className="group relative overflow-hidden bg-gradient-to-br from-[rgba(20,20,35,0.8)] to-[rgba(10,10,15,0.6)] border border-white/10 rounded-2xl p-6 hover:border-white/25 transition-all duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 }
        }}
    >
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
        <div className="text-center">
            <p className="text-gray-400 text-sm font-medium mb-2">{title}</p>
            <p className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
        </div>
    </motion.div>
);

// Enhanced Modal Components (keeping the same structure but with better styling)
const EditProfileModal = ({ isOpen, onClose, user, setUser }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setFormData({
                firstName: user?.firstName || '', 
                lastName: user?.lastName || '', 
                email: user?.email || '',
                courseName: user?.courseName || '', 
                section: user?.section || '', 
                semester: user?.semester || '',
                rollNumber: user?.rollNumber || '', 
                password: '', 
                confirmPassword: ''
            });
            setErrors({});
            setIsSuccess(false);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
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

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/student/update`, {
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
            console.error("Update Error:", error);
            toast.error("An error occurred while updating.");
        } finally {
            setTimeout(() => setIsLoading(false), 1500);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-lg cursor-pointer"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
            
            <motion.div
                className="relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl p-10 shadow-2xl bg-gradient-to-br from-[rgba(20,20,35,0.95)] to-[rgba(10,10,15,0.9)] backdrop-blur-3xl border border-white/20"
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {/* Enhanced decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-t-3xl"></div>
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-10 h-10" />
                        </motion.div>
                        Edit Profile
                    </h2>
                    <motion.button
                        onClick={onClose}
                        className="p-3 rounded-full bg-black/30 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all duration-300 group"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X size={28} className="group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </motion.button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-10">
                    <FormSectionModal title="Personal Information" icon={User}>
                        <div className="grid md:grid-cols-2 gap-8">
                            <InputFieldModal 
                                icon={User} 
                                label="First Name" 
                                name="firstName" 
                                value={formData.firstName || ''} 
                                onChange={handleChange} 
                                error={errors.firstName} 
                                required 
                            />
                            <InputFieldModal 
                                icon={User} 
                                label="Last Name" 
                                name="lastName" 
                                value={formData.lastName || ''} 
                                onChange={handleChange} 
                                error={errors.lastName} 
                                required 
                            />
                        </div>
                        <InputFieldModal 
                            icon={Mail} 
                            label="Email Address" 
                            type="email" 
                            name="email" 
                            value={formData.email || ''} 
                            onChange={handleChange} 
                            error={errors.email} 
                            required 
                        />
                    </FormSectionModal>
                    
                    <FormSectionModal title="Security Settings" icon={Lock}>
                        <div className="grid md:grid-cols-2 gap-8">
                            <InputFieldModal 
                                icon={Lock} 
                                label="New Password" 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                value={formData.password || ''} 
                                onChange={handleChange} 
                                error={errors.password} 
                                placeholder="Leave blank to keep current" 
                            />
                            <InputFieldModal 
                                icon={Lock} 
                                label="Confirm Password" 
                                type={showPassword ? "text" : "password"} 
                                name="confirmPassword" 
                                value={formData.confirmPassword || ''} 
                                onChange={handleChange} 
                                error={errors.confirmPassword} 
                                placeholder="Confirm new password" 
                            />
                        </div>
                        <motion.button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="text-sm text-gray-400 hover:text-purple-400 flex items-center gap-3 mt-4 transition-colors group"
                            whileHover={{ x: 5 }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            <span className="group-hover:underline">{showPassword ? 'Hide' : 'Show'} Passwords</span>
                        </motion.button>
                    </FormSectionModal>
                    
                    <div className="flex flex-col-reverse sm:flex-row gap-6 pt-8 border-t border-white/20">
                        <ActionButtonModal 
                            type="submit" 
                            isLoading={isLoading} 
                            isSuccess={isSuccess} 
                            className="flex-1"
                        >
                            Save Changes
                        </ActionButtonModal>
                        <ActionButtonModal 
                            type="button" 
                            variant="secondary" 
                            onClick={onClose} 
                            disabled={isLoading} 
                            className="flex-1"
                        >
                            Cancel
                        </ActionButtonModal>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

const FormSectionModal = ({ title, icon: Icon, children }) => (
    <motion.div 
        className="space-y-8 p-6 bg-black/20 rounded-2xl border border-white/10"
        variants={{ 
            hidden: { opacity: 0, x: -30 }, 
            visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } } 
        }}
        initial="hidden"
        animate="visible"
    >
        <div className="flex items-center gap-4 pb-6 border-b border-white/20">
            <motion.div 
                className="p-3 bg-purple-500/20 rounded-xl"
                whileHover={{ scale: 1.1, rotate: 5 }}
            >
                <Icon className="w-6 h-6 text-purple-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
        {children}
    </motion.div>
);

const InputFieldModal = ({ icon: Icon, label, error, required, ...props }) => (
    <div className="space-y-3">
        <label className="block text-lg font-semibold text-gray-300">
            {label} {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300 z-10" />
            <input 
                {...props} 
                className={`w-full pl-14 pr-6 py-4 bg-black/40 border-2 ${
                    error ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-purple-500'
                } rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 backdrop-blur-sm hover:bg-black/50 focus:bg-black/50 text-lg`} 
            />
            {/* Glowing effect on focus */}
            <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ${
                error ? 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'shadow-[0_0_20px_rgba(168,85,247,0.3)]'
            } pointer-events-none`}></div>
        </div>
        {error && (
            <motion.p 
                className="text-red-400 text-sm flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <AlertCircle size={16} />
                {error}
            </motion.p>
        )}
    </div>
);

const ActionButtonModal = ({ isLoading, isSuccess, children, variant = 'primary', className = '', ...props }) => {
    const variants = { 
        primary: "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg hover:shadow-purple-500/50", 
        secondary: "bg-black/40 hover:bg-black/60 border-2 border-white/20 hover:border-white/40 text-gray-300 hover:text-white" 
    };
    
    const currentVariant = isSuccess 
        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50" 
        : variants[variant];
    
    return (
        <motion.button 
            className={`px-10 py-5 font-bold rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group ${currentVariant} ${className}`}
            whileHover={{ 
                scale: (isLoading || isSuccess) ? 1 : 1.05, 
                y: (isLoading || isSuccess) ? 0 : -3 
            }} 
            whileTap={{ scale: (isLoading || isSuccess) ? 1 : 0.95 }} 
            {...props}
        >
            {/* Animated background effect */}
            {!isLoading && !isSuccess && (
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            )}
            
            <div className="relative flex items-center gap-3 text-lg">
                {isLoading ? (
                    <>
                        <motion.div 
                            className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Processing...</span>
                    </>
                ) : isSuccess ? (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <CheckCircle2 size={24} />
                        </motion.div>
                        <span>Success!</span>
                    </>
                ) : (
                    children
                )}
            </div>
        </motion.button>
    );
};

export default ProfilePage;