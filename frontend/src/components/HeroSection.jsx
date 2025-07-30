import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import Typewriter from 'typewriter-effect';
import { userAtom } from '../atoms/userAtom';
import { CalendarCheck2, LibraryBig, BookOpen, Users, GraduationCap, Clock, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    { 
      icon: BookOpen, 
      label: 'View Subjects', 
      color: 'from-purple-500 to-blue-500',
      onClick: () => navigate('/subjects'),
      description: 'Browse your subjects'
    },
    { 
      icon: CalendarCheck2, 
      label: 'Datesheet', 
      color: 'from-blue-500 to-cyan-500',
      onClick: () => window.open('Datesheet.html', 'new'),
      description: 'Check your DateSheet'
    },
    { 
      icon: LibraryBig, 
      label: 'Syllabus', 
      color: 'from-green-500 to-teal-500',
      onClick: () => window.open('Syllabus.html', 'new'),
      description: 'View curriculum'
    }
  ];

  if (!user) {
    return (
      <motion.section 
        className="w-full min-h-[40vh] flex items-center justify-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-8 h-8 border-4 border-blue-400/30 border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-4 w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
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
    <section className="flex justify-center items-center mt-10 px-4 md:px-6 w-full min-h-[70vh] text-white relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div 
          className="absolute w-[800px] h-[800px] rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute w-[600px] h-[600px]  blur-[120px] rounded-full bottom-0 right-0 translate-x-1/2 translate-y-1/2"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '80px 80px'
            }}
          />
        </div>
      </div>
      <motion.div 
        className="max-w-5xl w-full rounded-3xl p-8 md:p-12 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Enhanced Glass Card */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-3xl border border-white/20 "></div>

        <div className="relative z-10">
          {/* Time and Greeting Section */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-lg font-medium text-purple-200">{getGreeting()}</p>
                <p className="text-sm text-gray-400">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-mono text-blue-200">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-4xl pb-4 sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)] mb-8 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {!animationDone ? (
              <Typewriter
                options={{
                  strings: [`Welcome back, ${user.firstName || 'User'}!`],
                  autoStart: true,
                  loop: false,
                  delay: 80,
                  deleteSpeed: 50,
                  cursor: '|'
                }}
                onInit={(typewriter) => {
                  typewriter
                    .callFunction(() => setAnimationDone(false))
                    .typeString(`Welcome back, ${user.firstName || 'User'}!`)
                    .callFunction(() => setAnimationDone(true))
                    .start();
                }}
              />
            ) : (
              <span>{`Welcome back, ${user.firstName || 'User'}!`}</span>
            )}
          </motion.h1>

          {/* User Info Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {userClass && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Current Course</p>
                    <p className="text-base font-medium text-white">{userClass}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Roll Number</p>
                  <p className="text-base font-mono font-medium text-white">{user.rollNumber}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-2 leading-relaxed">
              What would you like to explore today?
            </h2>
            <p className="text-gray-300 text-sm md:text-base">
              Choose from your personalized dashboard options below
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  onClick={action.onClick}
                  className={`group relative bg-gradient-to-br ${action.color}/20 hover:${action.color}/30 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <motion.div
                      className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg group-hover:shadow-xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-gray-100 transition-colors">
                        {action.label}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color}/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Bottom Stats */}
          <motion.div 
            className="mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
