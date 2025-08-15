import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import Typewriter from 'typewriter-effect';
import { userAtom } from '../atoms/userAtom';
import { CalendarCheck2, LibraryBig, BookOpen, Users, GraduationCap, Clock, Sparkles, ArrowRight, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveBackground from './InteractiveBackground';
import Loader from './Loader'

const HeroSection = () => {
    const [animationDone, setAnimationDone] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    // Mouse-tracking for aurora effect
   
    
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
        { icon: BookOpen, label: 'View Subjects', color: 'from-purple-500 to-blue-500', onClick: () => navigate('/subjects'), description: 'Browse your course subjects' },
        { icon: CalendarCheck2, label: 'Datesheet', color: 'from-blue-500 to-cyan-500', onClick: () => window.open('Datesheet.html', '_blank'), description: 'Check your exam schedule' },
        { icon: LibraryBig, label: 'Syllabus', color: 'from-green-500 to-teal-500', onClick: () => window.open('Syllabus.html', '_blank'), description: 'Review your curriculum' }
    ];

    return (
        <section className="relative w-full h-screen flex flex-col text-white overflow-hidden ">
            {/* ===== ENHANCED BACKGROUND ===== */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <InteractiveBackground />
            
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,#0a0a0f)]"></div>
            </div>
            
            <AnimatePresence>
                {!user ? (
                    <Loader />
                ) : (
                    <motion.div 
                        key="content"
                        className="flex flex-col h-[90vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full"
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                    >
                        {/* Header */}
                        <motion.header
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
                            variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <div className='flex flex-col justify-center items-center-safe'>
                                    <p className="px-2 text-xl font-semibold text-purple-400">{getGreeting()}</p>
                                    <p className="text-sm text-gray-400">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                </div>
                            <motion.div 
                                className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 mt-4 sm:mt-0 rounded-xl border border-white/10 shadow-lg"
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
                            >
                                <Clock className="w-4 h-4 text-purple-400" />
                                <span className="text-lg font-mono font-bold text-gray-200">
                                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </motion.div>
                        </motion.header>

                        {/* Main Content */}
                        <main className="flex-1 flex flex-col items-center justify-center text-center">
                            <motion.h1
                                className="text-6xl sm:text-7xl md:text-8xl lg:text-8xl font-black mb-4 leading-none"
                                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.1 } } }}
                            >
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                                    Welcome Back,
                                </span>
                                <motion.span 
                                    className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 mt-1 pb-4"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8, type: 'spring', stiffness: 100 }}
                                >
                                    {user.firstName || 'User'}!
                                </motion.span>
                            </motion.h1>
                            
                            <motion.div
                                className="flex flex-wrap justify-center items-center gap-4 mb-10"
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 1 } } }}
                            >
                                <InfoBadge icon={GraduationCap} text={userClass} />
                                <InfoBadge icon={Hash} text={`Roll No: ${user.rollNumber}`} />
                            </motion.div>
                        </main>

                        {/* Footer Actions */}
                        <motion.footer
                            className="pb-6"
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { delay: 1.2 } } }}
                        >
                             <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-200">What would you like to explore?</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                                {quickActions.map((action, index) => (
                                    <QuickActionButton 
                                        key={action.label} 
                                        {...action}
                                        index={index}
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



const InfoBadge = ({ icon: Icon, text }) => {
    if (!text) return null;
    return (
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
            <Icon className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-sm text-gray-300 tracking-wide">{text}</span>
        </div>
    );
};

const QuickActionButton = ({ icon: Icon, label, description, color, onClick, index }) => (
    <motion.button
        onClick={onClick}
        className="group relative text-left p-5 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 1.4 + index * 0.1 } } }}
        whileHover={{ y: -5, scale: 1.03, boxShadow: '0 10px 20px -5px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.98 }}
    >
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">{label}</h3>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
        <div className={`absolute top-0 right-0 h-12 w-12 bg-gradient-to-l ${color} rounded-bl-full opacity-0 group-hover:opacity-20 transition-opacity duration-400`}></div>
        <ArrowRight className="w-5 h-5 text-gray-500 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 transform translate-x-2" />
    </motion.button>
);

export default HeroSection;
