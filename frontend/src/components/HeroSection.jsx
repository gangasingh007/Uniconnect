import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import Typewriter from 'typewriter-effect';
import { userAtom } from '../atoms/userAtom';
import Navbar from './Navbar';
import { CalendarCheck2, LibraryBig } from 'lucide-react';

const HeroSection = () => {
  const [animationDone, setAnimationDone] = useState(false);
  const user = useRecoilValue(userAtom);

  const userClass = user?.courseName
    ? `${user.courseName} - Section ${user.section}, Semester ${user.semester}`
    : '';

  if (!user) {
    return (
      <section className="w-full min-h-[30vh] flex items-center justify-center text-white">
        <div>Loading...</div>
      </section>
    );
  }

  return (
    <>
    <Navbar></Navbar>
    <section className="relative w-[500] min-h-[40vh] mt-3  px-6 z-[-10]  md:px-16 mt-10 md:pt-24 text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 w-[300px] h-[300px]">
        <div className="w-[300px] h-[300px] bg-purple-700 opacity-30 blur-3xl rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-[200px] h-[200px] bg-blue-500 opacity-20 blur-2xl rounded-full absolute bottom-10 right-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-10 shadow-xl shadow-purple-900/20">
        <h2 className="text-3xl pb-3 sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-4">
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
          <p className="text-sm md:text-base text-slate-300 mb-2">{userClass}</p>
        )}

        <p className="text-base md:text-lg font-medium text-slate-100 mb-4">
          What would you like to study today?
        </p>

        {/* Action Buttons */}
<div className="flex flex-wrap gap-4 mt-4">
  {/* Subjects Button */}
  <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-purple-800/30">
    <LibraryBig className="w-5 h-5" />
    <span>Subjects</span>
  </button>

  {/* Schedule Button */}
  <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2 rounded-lg hover:bg-white/20 transition-all">
    <CalendarCheck2 className="w-5 h-5" />
    <span>Schedule</span>
  </button>
</div>

      </div>
    </section></>
  );
};

export default HeroSection;
