import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authAtom } from '../atoms/authAtom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { loadingAtom } from '../atoms/states.atom';
import InteractiveBackground from './InteractiveBackground';
import { User, Mail, Lock, Book, Users, Calendar, Hash, Eye, EyeOff, AlertCircle, ChevronDown } from 'lucide-react';

const Register = () => {
    const setAuth = useSetRecoilState(authAtom);
    const [isLoading, setIsLoading] = useRecoilState(loadingAtom);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
        courseName: '', section: '', semester: '', rollNumber: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        
        // Updated validation for select fields
        if (!formData.courseName) newErrors.courseName = 'Please select a course';
        if (!formData.section) newErrors.section = 'Please select a section';
        if (!formData.semester) newErrors.semester = 'Please select a semester';
        if (!formData.rollNumber) newErrors.rollNumber = 'Roll number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error("Please fix the highlighted errors.");
            return;
        }
        setIsLoading(true);
        try {
            const { confirmPassword, ...payload } = formData;
            const res = await axios.post("http://localhost:3000/api/v1/auth/student/register", payload);
            const { user, token } = res.data;
            setAuth({ user, token });
            localStorage.setItem("token", token);
            toast.success(`Welcome, ${user.firstName}!`);
            navigate("/");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center text-white relative overflow-hidden p-4">
            <InteractiveBackground />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-700/10 via-blue-700/10 to-pink-700/10 opacity-70"></div>

            <motion.div
                className="relative z-10 w-full max-w-2xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                    <div className="text-center p-6 border-b border-white/10 bg-gradient-to-br from-purple-600/20 to-blue-600/20">
                        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-1 tracking-wide">
                            UniConnect
                        </h1>
                        <p className="text-gray-300 text-base font-light">
                            Join the Community. Unlock Your Potential.
                        </p>
                    </div>

                    <form 
                        onSubmit={handleSubmit} 
                        className="p-6 space-y-5 overflow-y-auto"
                        // Add a custom scrollbar style if desired
                        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(168, 85, 247, 0.5) transparent' }}
                    >
                        <FormSection title="Personal Details" icon={User}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <InputField icon={User} name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} error={errors.firstName} required />
                                <InputField icon={User} name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} error={errors.lastName} required />
                            </div>
                        </FormSection>
                        
                        <FormSection title="Account Security" icon={Lock}>
                            <InputField icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} error={errors.email} required />
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <InputField icon={Lock} name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={formData.password} onChange={handleChange} error={errors.password} required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <InputField icon={Lock} name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />
                            </div>
                        </FormSection>

                        <FormSection title="Academic Info" icon={Book}>
                            <div className="grid md:grid-cols-3 gap-4">
                                <SelectField icon={Book} name="courseName" value={formData.courseName} onChange={handleChange} error={errors.courseName} required options={['Btech', 'Mtech']} />
                                <SelectField icon={Users} name="section" value={formData.section} onChange={handleChange} error={errors.section} required options={['A', 'B', 'C', 'CE', 'D']} />
                                <SelectField icon={Calendar} name="semester" value={formData.semester} onChange={handleChange} error={errors.semester} required options={['1', '2', '3', '4', '5', '6', '7', '8']} />
                            </div>
                            <InputField icon={Hash} name="rollNumber" placeholder="Roll Number" value={formData.rollNumber} onChange={handleChange} error={errors.rollNumber} required />
                        </FormSection>

                        <ActionButton type="submit" isLoading={isLoading}>
                            Create Account
                        </ActionButton>

                        <div className="text-center pt-1">
                            <p className="text-gray-400 text-sm">
                                Already have an account?{' '}
                                <button type="button" onClick={() => navigate("/login")} className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                                    Sign In
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

// --- Reusable Form Components ---

const FormSection = ({ title, icon: Icon, children }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b border-white/10">
            <div className="p-2 bg-purple-500/15 rounded-lg"><Icon className="w-5 h-5 text-purple-400" /></div>
            <h3 className="text-md font-semibold text-white tracking-wide">{title}</h3>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

const InputField = ({ icon: Icon, name, error, required, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        <input
            name={name}
            className={`w-full pl-12 pr-4 py-2.5 bg-black/30 border-2 ${error ? 'border-red-500/50' : 'border-white/10'}
            rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                error ? 'focus:ring-red-500/50 focus:border-red-500/50' : 'focus:ring-purple-500/50 focus:border-purple-500/50'
            } transition-all duration-300`}
            required={required}
            {...props}
        />
        <AnimatePresence>
            {error && (
                <motion.p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                >
                    <AlertCircle size={14} />{error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
);

const SelectField = ({ icon: Icon, name, error, required, options, ...props }) => (
    <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        <select
            name={name}
            className={`w-full pl-12 pr-10 py-2.5 bg-black/30 border-2 ${error ? 'border-red-500/50' : 'border-white/10'}
            rounded-xl text-white focus:outline-none focus:ring-2 ${
                error ? 'focus:ring-red-500/50 focus:border-red-500/50' : 'focus:ring-purple-500/50 focus:border-purple-500/50'
            } transition-all duration-300 appearance-none`}
            required={required}
            {...props}
        >
            <option value="" disabled className="bg-[#1a1a2e] text-gray-500">Select...</option>
            {options.map(option => (
                <option key={option} value={option} className="bg-[#1a1a2e] text-white">{option}</option>
            ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        <AnimatePresence>
            {error && (
                <motion.p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                >
                    <AlertCircle size={14} />{error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
);

const ActionButton = ({ isLoading, children, ...props }) => (
    <motion.button
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        disabled={isLoading}
        {...props}
    >
        {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/50 border-t-white"></div>
        ) : (
            children
        )}
    </motion.button>
);

export default Register;
