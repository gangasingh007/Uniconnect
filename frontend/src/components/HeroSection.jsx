import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import Typewriter from 'typewriter-effect';
import { userAtom } from '../atoms/userAtom';
import Navbar from './Navbar';
import { CalendarCheck2, LibraryBig } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [animationDone, setAnimationDone] = useState(false);
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const userClass = user?.courseName
    ? `${user.courseName} - Section ${user.section}, Semester ${user.semester}`
    : '';

  if (!user) {
    return (
      <section className="w-full min-h-[30vh] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-8 h-8 border-3 border-blue-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <span className="text-purple-200 text-lg font-medium">Loading your dashboard...</span>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="flex justify-center z-[-10] items-center px-4 md:px-0 w-full min-h-[60vh] text-white relative z-10 overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          {/* Primary glow effects
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-600/30 via-blue-500/20 to-indigo-600/25 blur-3xl rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-pink-500/20 via-purple-500/15 to-blue-600/20 blur-2xl rounded-full bottom-10 right-10 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-cyan-400/15 to-blue-500/20 blur-xl rounded-full top-1/2 right-20 animate-pulse" style={{ animationDelay: '2s' }} /> */}
          
          {/* Subtle mesh gradient overlay */}
          <div className="absolute inset-0 " />
          
          {/* Animated grid pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
              backgroundSize: '50px 50px',
              animation: 'float 20s ease-in-out infinite'
            }} />
          </div>
        </div>

        {/* Main Content with enhanced styling */}
        <div className="max-w-4xl w-full rounded-3xl p-8 md:p-12 relative">
          {/* Content background with glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-4xl pb-4 sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 leading-tight">
              {!animationDone ? (
                <Typewriter
                  options={{
                    strings: [`Welcome back, ${user.firstName || 'User'}!`],
                    autoStart: true,
                    loop: false,
                    delay: 60,
                    deleteSpeed: 40,
                    cursor: '|',
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
            </h2>

            {userClass && (
              <p className="text-base md:text-lg text-slate-200/90 mb-3 font-medium tracking-wide">{userClass}</p>
            )}
            
            <p className="text-sm md:text-base text-slate-300/80 mb-3 font-mono tracking-wider">
              Roll Number - {user.rollNumber}
            </p>
            
            <p className="text-lg md:text-xl font-semibold text-slate-50 mb-8 leading-relaxed">
              What would you like to study today?
            </p>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl shadow-purple-900/40 hover:shadow-purple-900/60 transform hover:-translate-y-1 hover:scale-105">
                <div  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                <LibraryBig className="w-6 h-6 relative z-10 transform group-hover:rotate-6 transition-transform duration-300" />
                <span onClick={()=>navigate("/syllabus")} className="relative z-10 font-semibold text-lg">Syllabus</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="group relative flex items-center gap-3 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CalendarCheck2 className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10 font-semibold text-lg">Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
