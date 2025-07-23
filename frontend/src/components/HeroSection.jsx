// Improved HeroSection Component Styling
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
      <section className="w-full min-h-[30vh]  flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div
              className="absolute inset-0 w-8 h-8 border-3 border-blue-400 border-b-transparent rounded-full animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
            ></div>
          </div>
          <span className="text-purple-200 text-lg font-medium">Loading your dashboard...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="flex justify-center z-[-10] items-center px-4 md:px-0 w-full min-h-[60vh] text-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-700/40 via-blue-600/20 to-indigo-700/25 blur-[120px] rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div
            className="absolute inset-0 animate-[float_30s_ease-in-out_infinite]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      </div>

      <div className="max-w-4xl w-full rounded-3xl p-8 md:p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_10px_50px_5px_rgba(100,100,255,0.05)]"></div>

        <div className="relative z-10">
          <h2 className="text-4xl pb-4 sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-[0_1px_3px_rgba(255,255,255,0.2)] mb-6 leading-tight">
            {!animationDone ? (
              <Typewriter
                options={{
                  strings: [`Welcome back, ${user.firstName || 'User'}!`],
                  autoStart: true,
                  loop: false,
                  delay: 60,
                  deleteSpeed: 40,
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

          <div className="flex flex-wrap gap-4 mt-6">
            <button className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl shadow-purple-900/40 hover:shadow-purple-900/60 transform hover:-translate-y-1 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-300"></div>
              <LibraryBig className="w-6 h-6 relative z-10 transform group-hover:rotate-6 transition-transform duration-300" />
              <span onClick={() => navigate('/syllabus')} className="relative z-10 font-semibold text-lg">
                Syllabus
              </span>
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
  );
};

export default HeroSection;
