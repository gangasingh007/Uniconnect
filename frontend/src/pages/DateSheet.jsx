import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar'; // Assuming Navbar is in components folder
import Footer from '../components/Footer'; // Assuming Footer is in components folder
import InteractiveBackground from '../components/InteractiveBackground'; // Assuming InteractiveBackground is in components folder

const DateSheet = () => {
  return (
    <div className="min-h-screen w-full relative  from-[#0a0a0f] via-[#141423] to-[#1a1a2e]">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <InteractiveBackground />
      </div>

      <Navbar />

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-160px)] px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto shadow-2xl shadow-purple-900/20"
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 leading-tight bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 bg-clip-text text-transparent"
          >
            <span>Coming</span> <br className="sm:hidden"/>Soon
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="text-lg sm:text-xl text-gray-300 max-w-md mx-auto"
          >
            The datesheet will be uploaded once it has been officially released. Stay tuned for updates!
          </motion.p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default DateSheet;
