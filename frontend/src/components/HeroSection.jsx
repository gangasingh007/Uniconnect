import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import Typewriter from 'typewriter-effect';
import { userAtom } from '../atoms/userAtom';
import { CalendarCheck2, LibraryBig, BookOpen, Users, GraduationCap, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveBackground from './InteractiveBackground'; // Assumes this component exists

const HeroSection = () => {
  const [animationDone, setAnimationDone] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  // Mouse-tracking for aurora effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userClass = user?.courseName
    ? `${user.courseName} - Section ${user.section}, Sem ${user.semester}`
    : '';

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { icon: BookOpen, label: 'View Subjects', color: 'from-purple-500 to-blue-500', onClick: () => navigate('/subjects'), description: 'Browse your subjects' },
    { icon: CalendarCheck2, label: 'Datesheet', color: 'from-blue-500 to-cyan-500', onClick: () => window.open('Datesheet.html', '_blank'), description: 'Check your DateSheet' },
    { icon: LibraryBig, label: 'Syllabus', color: 'from-green-500 to-teal-500', onClick: () => window.open('Syllabus.html', '_blank'), description: 'View curriculum' }
  ];

  return (
    <section className="relative w-full h-screen flex flex-col text-white overflow-hidden ">
      {/* ===== BACKGROUND EFFECTS ===== */}
        <InteractiveBackground />
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-purple-800/50 to-blue-800/30 rounded-full -top-32 -left-32 blur-[150px] opacity-60"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] bg-gradient-to-bl from-pink-800/40 to-indigo-800/30 rounded-full -bottom-24 -right-24 blur-[150px] opacity-60"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 5 }}
        />
        
        {/* Vignette effect to focus the center */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0a0f)]"></div>
      </div>
      
      <AnimatePresence>
        {!user ? (
          <motion.div
            key="loader"
            className="w-full h-full flex flex-col items-center justify-center text-white"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-24 h-24 mb-6">
              <motion.div 
                className="w-full h-full border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, loop: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-2 w-20 h-20 border-4 border-blue-400/30 border-b-blue-400 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, loop: Infinity, ease: "linear" }}
              />
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-purple-300" />
            </div>
            <div className="text-center text-xl font-medium text-purple-200 h-8">
              <Typewriter
                options={{
                  strings: ['Authenticating...', 'Loading resources...', 'Personalizing dashboard...'],
                  autoStart: true,
                  loop: true,
                  delay: 60,
                  deleteSpeed: 30
                }}
              />
            </div>
            <p className="text-gray-400 text-sm mt-2">Preparing your academic hub</p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            className="flex flex-col h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* ===== TOP BAR: GREETING & TIME ===== */}
            <motion.header
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div>
                <p className="text-xl font-semibold text-gray-200">{getGreeting()}</p>
                <p className="text-sm text-gray-400">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              </div>
              
              <motion.div 
                className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 mt-4 sm:mt-0 rounded-xl border border-white/10 shadow-lg"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-lg font-mono font-bold text-gray-200">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                </span>
              </motion.div>
            </motion.header>

            {/* ===== MAIN CONTENT: WELCOME & INFO ===== */}
            <main className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-black mb-2 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4, type: 'spring', stiffness: 100 }}
              >
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  Welcome Back,
                </span>
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 mt-1 pb-1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  {user.firstName || 'User'}!
                </motion.span>
              </motion.h1>

              <motion.p 
                className="max-w-xl text-gray-400 mb-8 text-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                Your central hub for academic success. What would you like to do today?
              </motion.p>
              
              <motion.div
                className="flex flex-wrap justify-center items-center gap-4 mb-8"
                variants={{
                  visible: { transition: { staggerChildren: 0.1, delayChildren: 1.4 } }
                }}
                initial="hidden"
                animate="visible"
              >
                <InfoBadge icon={GraduationCap} text={userClass} color="purple" />
                <InfoBadge icon={Users} text={user.rollNumber} color="blue" />
              </motion.div>
            </main>

            {/* ===== BOTTOM ACTIONS ===== */}
            <motion.footer
              className="pb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                {quickActions.map((action, index) => (
                  <QuickActionButton 
                    key={action.label} 
                    {...action}
                    delay={1.8 + index * 0.15}
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

// Helper component for info badges
const InfoBadge = ({ icon: Icon, text, color }) => {
  if (!text) return null;
  const colors = {
    purple: "text-purple-400",
    blue: "text-blue-400",
  }
  return (
    <motion.div
      className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 hover:border-white/20 hover:bg-black/30 transition-all duration-300"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -2 }}
    >
      <Icon className={`w-5 h-5 ${colors[color]}`} />
      <span className="font-medium text-sm text-gray-300 tracking-wide">{text}</span>
    </motion.div>
  );
};

// Helper component for action cards to keep code clean
const QuickActionButton = ({ icon: Icon, label, description, color, onClick, delay }) => {
  return (
    <motion.button
      onClick={onClick}
      className="group relative text-left p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            {label}
          </h3>
          <p className="text-sm text-gray-400">
            {description}
          </p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-500 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {/* Subtle glow effect */}
      <div className={`absolute -inset-px bg-gradient-to-br ${color} rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md`}></div>
    </motion.button>
  );
};

export default HeroSection;
