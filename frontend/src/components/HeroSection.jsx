import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import Typewriter from 'typewriter-effect';
import { userAtom } from '../atoms/userAtom';
import { CalendarCheck2, LibraryBig, BookOpen, Users, GraduationCap, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import InteractiveBackground from './InteractiveBackground'; // Import the new background

const HeroSection = () => {
  const [animationDone, setAnimationDone] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userClass = user?.courseName
    ? `${user.courseName} - Section ${user.section}, Semester ${user.semester}`
    : '';

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    { icon: BookOpen, label: 'View Subjects', color: 'from-purple-500 to-blue-500', onClick: () => navigate('/subjects'), description: 'Browse your subjects' },
    { icon: CalendarCheck2, label: 'Datesheet', color: 'from-blue-500 to-cyan-500', onClick: () => window.open('Datesheet.html', 'new'), description: 'Check your DateSheet' },
    { icon: LibraryBig, label: 'Syllabus', color: 'from-green-500 to-teal-500', onClick: () => window.open('Syllabus.html', 'new'), description: 'View curriculum' }
  ];

  if (!user) {
    return (
      <motion.section
        className="w-full h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#0a0a0f] via-[#141423] to-[#1a1a2e]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-12 h-12 border-4 border-blue-400/30 border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-5 w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-purple-200 text-xl font-medium">Loading your dashboard...</p>
            <p className="text-gray-400 text-sm">Preparing your personalized experience</p>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <section className="relative w-full h-[91vh]  flex flex-col text-white overflow-hidden ">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <InteractiveBackground />
        
        {/* Enhanced Blobs */}
        <motion.div
          className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-purple-900/60 to-blue-900/40 rounded-full -top-32 -left-32 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] bg-gradient-to-bl from-pink-900/50 to-indigo-900/40 rounded-full -bottom-24 -right-24 blur-[120px]"
          animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 5 }}
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] [background-size:40px_40px]"></div>
      </div>

      {/* ===== CONTENT CONTAINER ===== */}
      <div className="flex flex-col h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ===== TOP BAR: GREETING & TIME ===== */}
        <motion.header
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
              <Sparkles className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-xl font-semibold text-purple-200">{getGreeting()}</p>
              <p className="text-sm text-gray-400">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-lg font-mono font-bold text-blue-200">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </motion.div>
        </motion.header>

        {/* ===== MAIN CONTENT: WELCOME & INFO ===== */}
        <main className="flex-1 flex flex-col items-center justify-center text-center py-4">
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-black mb-7 pb-3 leading-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, type: 'spring', stiffness: 100 }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 drop-shadow-2xl">
              {!animationDone ? (
                <Typewriter
                  options={{ loop: false, delay: 100, cursor: '' }}
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(`Welcome Back,`)
                      .callFunction(() => setAnimationDone(true))
                      .start();
                  }}
                />
              ) : (
                `Welcome Back,`
              )}
            </span>
            <motion.span 
              className="block pb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: animationDone ? 1 : 0, y: animationDone ? 0 : 30 }}
              transition={{ duration: 0.8, delay: animationDone ? 0.5 : 0 }}
            >
              {user.firstName || 'User'}!
            </motion.span>
          </motion.h1>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            {userClass && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-gray-200">{userClass}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="font-mono font-medium text-gray-200 tracking-wider">{user.rollNumber}</span>
            </div>
          </motion.div>

          {/* Mobile-only Subjects Button */}
          <motion.div
            className="sm:hidden mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <motion.button
              onClick={() => navigate('/subjects')}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
            >
              <BookOpen className="w-5 h-5" />
              <span>View Your Subjects</span>
            </motion.button>
          </motion.div>
        </main>

        {/* ===== BOTTOM ACTIONS ===== */}
        <motion.footer
          className="pb-4 hidden sm:block"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  onClick={action.onClick}
                  className={`group relative text-left p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-300`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg`}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color}/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </motion.button>
              );
            })}
          </div>
        </motion.footer>

        {/* Status Indicator */}
        <motion.div
          className="flex justify-center items-center gap-6 text-xs text-gray-500 pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Role: {user.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Last Login: Today</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
