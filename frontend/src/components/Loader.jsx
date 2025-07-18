// components/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-90">
      <div className="relative flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-transparent border-t-purple-500 border-b-blue-500 rounded-full animate-spin"></div>
        <p className="text-lg font-semibold text-white animate-pulse tracking-widest">
          Loading<span className="text-purple-400">...</span>
        </p>
      </div>
    </div>
  );
};

export default Loader;
