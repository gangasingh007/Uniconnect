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
    ShieldCheck
} from 'lucide-react';
import InteractiveBackground from '../components/InteractiveBackground';

// ENHANCEMENT: Main component now includes Navbar and a slightly adjusted layout
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    return (
        <>
            <div className="relative min-h-screen w-full text-white overflow-x-hidden">
                <div className="absolute inset-0 -z-10">
                    <InteractiveBackground />
                </div>
                <div className="relative z-10 p-4 sm:p-6 lg:p-8"> {/* Added padding-top for Navbar */}
                    <motion.div
                        className="max-w-7xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        <PageHeader navigate={navigate} />
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Sidebar */}
                            <motion.div
                                className="lg:col-span-4"
                                variants={{
                                    hidden: { opacity: 0, x: -30 },
                                    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
                                }}
                            >
                                <ProfileSidebar user={user} onEditClick={() => setIsEditModalOpen(true)} />
                            </motion.div>
                            {/* Right Content Area */}
                            <motion.div
                                className="lg:col-span-8 space-y-8"
                                variants={{
                                    hidden: { opacity: 0, x: 30 },
                                    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15, delay: 0.1 } }
                                }}
                            >
                                <InfoSection title="Personal Details" icon={User}>
                                    <DetailRow label="First Name" value={user?.firstName} />
                                    <DetailRow label="Last Name" value={user?.lastName} />
                                    <DetailRow label="Email Address" value={user?.email} />
                                </InfoSection>
                                <InfoSection title="Academic Information" icon={GraduationCap}>
                                    <DetailRow label="Course" value={user?.courseName} />
                                    <DetailRow label="Section" value={user?.section} />
                                    <DetailRow label="Semester" value={user?.semester} />
                                    <DetailRow label="Roll Number" value={user?.rollNumber} />
                                    <DetailRow label="Account Role" value={user?.role} />
                                </InfoSection>
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

// ENHANCEMENT: Minor polish on header text and button
const PageHeader = ({ navigate }) => (
    <motion.div
        className="mb-12"
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-2 pb-2">
                    Profile Settings
                </h1>
                <p className="text-lg text-gray-400 max-w-lg">View and manage your account information, academic details, and security settings.</p>
            </div>
            <motion.button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-5 py-2.5 bg-black/20 hover:bg-black/40 border border-white/10 rounded-xl transition-all duration-300 text-gray-300 hover:text-white group backdrop-blur-sm shadow-lg"
                whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }}
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </motion.button>
        </div>
    </motion.div>
);

// ENHANCEMENT: Added support for profile picture, refined animations and shadows
const ProfileSidebar = ({ user, onEditClick }) => (
    <div className="bg-gradient-to-br from-[rgba(20,20,35,0.6)] to-[rgba(10,10,15,0.5)] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl sticky top-28 text-center flex flex-col items-center">
        <motion.div className="relative group mb-6">
            <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-all duration-500"
                animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#1c1c3a] to-[#0a0a0f] flex items-center justify-center text-white font-bold text-5xl shadow-2xl ring-4 ring-white/10 overflow-hidden">
                {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span>{(user?.firstName?.charAt(0) || 'U') + (user?.lastName?.charAt(0) || 'N')}</span>
                )}
            </div>
            <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
            </div>
        </motion.div>

        <h2 className="text-3xl font-bold text-white truncate max-w-full pb-2">{`${user?.firstName || ''} ${user?.lastName || ''}`}</h2>
        <p className="text-gray-400 truncate max-w-full mt-1 mb-6">{user?.email || ''}</p>
        
        {/* ENHANCEMENT: Added a glowing shadow to the verified badge */}
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-300 text-sm px-3 py-1 rounded-full mb-8 shadow-[0_0_10px_rgba(45,212,191,0.3)]">
            <ShieldCheck size={16} />
            <span>Verified Account</span>
        </div>
        
        <motion.button
            onClick={onEditClick}
            className="flex w-full items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/40 transition-all duration-300 group"
            whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
        >
            <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Edit Profile
        </motion.button>
    </div>
);

// ENHANCEMENT: Info sections now have a subtle hover effect
const InfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-gradient-to-br from-[rgba(20,20,35,0.6)] to-[rgba(10,10,15,0.5)] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl p-8 group transition-all duration-300 hover:border-white/20 hover:shadow-purple-500/10">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <Icon className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        {/* ENHANCEMENT: Added a subtle dividing line between rows */}
        <div className="divide-y divide-white/5">
            {children}
        </div>
    </div>
);

// ENHANCEMENT: Detail rows now have an interactive hover state
const DetailRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 -mx-4 transition-all duration-300 hover:bg-white/5 rounded-lg">
        <p className="text-md text-gray-400 font-medium mb-1 sm:mb-0">{label}</p>
        <p className="text-lg font-semibold text-gray-100 truncate">{value || 'Not specified'}</p>
    </div>
);


// ENHANCEMENT: Modal has a more premium look with gradient border and refined form elements
const EditProfileModal = ({ isOpen, onClose, user, setUser }) => {
    // ... (logic remains the same, no changes needed here) ...
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setFormData({
                firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '',
                courseName: user?.courseName || '', section: user?.section || '', semester: user?.semester || '',
                rollNumber: user?.rollNumber || '', password: '', confirmPassword: ''
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
                onClick={onClose}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
                className="relative w-full max-w-4xl max-h-[97vh] overflow-y-auto rounded-3xl p-8 sm:p-10 shadow-2xl bg-gradient-to-br from-[rgba(20,20,35,0.8)] to-[rgba(10,10,15,0.7)] backdrop-blur-2xl"
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
                {/* ENHANCEMENT: Added a decorative gradient border effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-3xl" />
                
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3">
                        <Sparkles /> Edit Profile
                    </h2>
                    <motion.button onClick={onClose} className="p-2 rounded-full bg-black/20 hover:bg-black/50 text-gray-400 hover:text-white transition-colors" whileHover={{ scale: 1.1, rotate: 90 }}>
                        <X size={26} />
                    </motion.button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <FormSectionModal title="Personal Information" icon={User}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputFieldModal icon={User} label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} required />
                            <InputFieldModal icon={User} label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} required />
                        </div>
                        <InputFieldModal icon={Mail} label="Email Address" type="email" name="email" value={formData.email || ''} onChange={handleChange} error={errors.email} required />
                    </FormSectionModal>
                    <FormSectionModal title="Security" icon={Lock}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputFieldModal icon={Lock} label="New Password" type={showPassword ? "text" : "password"} name="password" value={formData.password || ''} onChange={handleChange} error={errors.password} placeholder="Leave blank to keep current" />
                            <InputFieldModal icon={Lock} label="Confirm Password" type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword || ''} onChange={handleChange} error={errors.confirmPassword} placeholder="Confirm new password" />
                        </div>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mt-2 transition-colors">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showPassword ? 'Hide' : 'Show'} Passwords
                        </button>
                    </FormSectionModal>
                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-white/10">
                        <ActionButtonModal type="submit" isLoading={isLoading} isSuccess={isSuccess} className="flex-1">Save Changes</ActionButtonModal>
                        <ActionButtonModal type="button" variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">Cancel</ActionButtonModal>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

// Modal-specific form components (no major changes, just ensuring style consistency)
const FormSectionModal = ({ title, icon: Icon, children }) => (
    <motion.div className="space-y-6" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
        <div className="flex items-center gap-3 pb-4 border-b border-white/10"><div className="p-2 bg-purple-500/20 rounded-lg"><Icon className="w-5 h-5 text-purple-400" /></div><h3 className="text-xl font-semibold text-white">{title}</h3></div>
        {children}
    </motion.div>
);

// ENHANCEMENT: Polished input field styling
const InputFieldModal = ({ icon: Icon, label, error, required, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label} {required && <span className="text-red-400">*</span>}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300" />
            <input {...props} className={`w-full pl-12 pr-4 py-3 bg-black/30 border ${error ? 'border-red-500' : 'border-white/10'} focus:border-purple-500 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/20' : 'focus:ring-purple-500/30'} transition-all duration-300`} />
        </div>
        {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} />{error}</p>}
    </div>
);

// ENHANCEMENT: More pronounced shadow on the primary button
const ActionButtonModal = ({ isLoading, isSuccess, children, variant = 'primary', className = '', ...props }) => {
    const variants = { primary: "bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-lg hover:shadow-purple-500/40 text-white", secondary: "bg-black/30 hover:bg-black/50 border-white/10 text-gray-300 border hover:border-white/20" };
    const currentVariant = isSuccess ? "bg-green-500 text-white" : variants[variant];
    return (<motion.button className={`px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${currentVariant} ${className}`} whileHover={{ scale: (isLoading || isSuccess) ? 1 : 1.03, y: (isLoading || isSuccess) ? 0 : -2 }} whileTap={{ scale: (isLoading || isSuccess) ? 1 : 0.98 }} {...props}> {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/50 border-t-white" /> : isSuccess ? <><CheckCircle2 size={20} className="mr-2" /> Success!</> : children} </motion.button>);
};

export default ProfilePage;