import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import { CalendarCheck2, LibraryBig, BookOpen, GraduationCap, Clock, ArrowRight, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveBackground from './InteractiveBackground';
import Loader from './Loader';

// ENHANCED HeroSection Component
const HeroSection = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const userClass = user?.courseName ? `${user.courseName} - Section ${user.section}, Sem ${user.semester}` : '';

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const quickActions = [
        { icon: BookOpen, label: 'View Subjects', color: 'from-purple-500 to-indigo-500', href: '/subjects', description: 'Browse your course subjects' },
        { icon: CalendarCheck2, label: 'Datesheet', color: 'from-sky-500 to-cyan-500', href: "/datesheet", description: 'Check your exam schedule' },
        { icon: LibraryBig, label: 'Syllabus', color: 'from-emerald-500 to-teal-500', href: "/syllabus", description: 'Review your curriculum' }
    ];

    return (
        <section className="relative w-full min-h-screen flex flex-col text-white overflow-hidden">
            {/* ===== ENHANCED BACKGROUND ===== */}
            <div className="absolute inset-0 -z-10">
                <InteractiveBackground />
                {/* Subtle grid overlay for texture */}
                <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0a0f)]"></div>
            </div>
            
            <AnimatePresence>
                {!user ? (
                    <Loader />
                ) : (
                    <motion.div 
                        key="content"
                        className="flex flex-col flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                    >
                        {/* Header */}
                        <motion.header
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                            variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                        >
                            <div>
                                <p className="text-xl font-semibold text-purple-500">{getGreeting()}</p>
                                <p className="text-sm text-gray-400">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <motion.div 
                                className="flex items-center gap-3 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 shadow-lg"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.4)" }}
                            >
                                <Clock className="w-4 h-4 text-purple-500" />
                                <span className="text-lg font-mono font-bold text-gray-200 tracking-wider">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </motion.div>
                        </motion.header>

                        {/* Main Content */}
                        <main className="flex-1 flex flex-col items-center justify-center text-center my-12 md:my-16">
                            <motion.h1
                                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 leading-tight"
                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } } }}
                            >
                                {/* Animated Gradient Text */}
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-pan bg-[length:200%_auto] drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                                    Welcome Back,
                                </span>
                                <motion.span 
                                    className="block mt-1 pb-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 100 }}
                                >
                                    {user.firstName || 'User'}!
                                </motion.span>
                            </motion.h1>
                            
                            <motion.div
                                className="flex flex-wrap justify-center items-center gap-4 mb-10"
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 0.8 } } }}
                            >
                                <InfoBadge icon={GraduationCap} text={userClass} />
                                <InfoBadge icon={Hash} text={`Roll No: ${user.rollNumber}`} />
                            </motion.div>
                        </main>

                        {/* Footer Actions */}
                        <motion.footer
                            className="pb-6"
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: 1 } } }}
                        >
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-200">What would you like to explore?</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {quickActions.map((action, index) => (
                                    <QuickActionButton 
                                        key={action.label} 
                                        {...action}
                                        index={index}
                                        onClick={() => navigate(action.href)}
                                    />
                                ))}
                            </div>
                        </motion.footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

// ENHANCED InfoBadge Component
const InfoBadge = ({ icon: Icon, text }) => {
    if (!text) return null;
    return (
        <motion.div 
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10"
            whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
            <Icon className="w-5 h-5 text-purple-300" />
            <span className="font-medium text-sm text-gray-300 tracking-wide">{text}</span>
        </motion.div>
    );
};

// ENHANCED QuickActionButton Component
const QuickActionButton = ({ icon: Icon, label, description, color, onClick, index }) => (
    <motion.button
        onClick={onClick}
        className="group relative text-left p-5 bg-gray-900/50 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 transition-colors duration-300 overflow-hidden"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 1.2 + index * 0.1 } } }}
        whileHover={{ 
            y: -6, 
            scale: 1.03, 
            boxShadow: `0 10px 30px -5px rgba(0,0,0,0.4), 0 0 15px ${color.startsWith('from-purple') ? 'rgba(192, 132, 252, 0.2)' : color.startsWith('from-sky') ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
        }}
        whileTap={{ scale: 0.98, y: -2 }}
    >
        {/* Glint Effect */}
        <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[100%] opacity-50"></div>
        
        <div className="flex items-center gap-4 relative z-10">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">{label}</h3>
                <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-500 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 transform translate-x-2 z-10" />
    </motion.button>
);

export default HeroSection;
