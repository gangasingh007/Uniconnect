import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Subjects from '../components/Subjects'
import { motion } from 'framer-motion'
import { ChevronRight, BookOpen, Brain, Users, Search, FileText, Zap, Star, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



const Home = () => {
  return (
    <>
    <div>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Navbar />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
      >
        <HeroSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
      >
        <Subjects />
      </motion.div>
    </div>
     <footer className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
     <div className="max-w-7xl mx-auto">
       <div className="grid md:grid-cols-4 gap-8 mb-8">
         {/* Brand */}
         <div className="md:col-span-2">
           <div className="flex items-center space-x-2 mb-4">
             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
               <BookOpen className="w-6 h-6 text-white" />
             </div>
             <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
               UniConnect
             </span>
           </div>
           <p className="text-gray-400 mb-4 max-w-md">
             Streamlining academic lives through centralized resources and AI-powered learning tools. 
             Connecting students for collaborative success.
           </p>
         </div>

         {/* Quick Links */}
         <div>
           <h3 className="text-white font-semibold mb-4">Quick Links</h3>
           <div className="space-y-2">
             <a href="#features" className="block text-gray-400 hover:text-white transition-colors">Features</a>
             <a href="#solution" className="block text-gray-400 hover:text-white transition-colors">Solution</a>
             <a href="#benefits" className="block text-gray-400 hover:text-white transition-colors">Benefits</a>
             <a href="#" className="block text-gray-400 hover:text-white transition-colors">About Us</a>
           </div>
         </div>

         {/* Contact Info */}
         <div>
           <h3 className="text-white font-semibold mb-4">Contact Us</h3>
           <div className="space-y-3">
             <div className="flex items-center space-x-2 text-gray-400">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
               </svg>
               <span>gangasingh1734@gmail.com</span>
             </div>
             <div className="flex items-center space-x-2 text-gray-400">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
               </svg>
               <span>Ludhiana, Punjab, India</span>
             </div>
             <div className="flex items-center space-x-2 text-gray-400">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
               </svg>
               <span>+91 7087550589</span>
             </div>
           </div>
         </div>
       </div>

       {/* Bottom section */}
       <div className="pt-8 border-t border-gray-800">
         <div className="flex flex-col md:flex-row justify-between items-center">
           <p className="text-gray-400 text-sm mb-4 md:mb-0 align-center md:text-left">
             &copy; 2025 UniConnect. All rights reserved. Streamlining academic success.<br/>

           </p>
           <p className='text-gray-400 text-sm mb-4 md:mb-0 align-center md:text-left'> Developed and managed by Ganga Singh.</p>
           <div className="flex space-x-6">
             <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
             <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
             <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Support</a>
           </div>
         </div>
       </div>
     </div>
   </footer>
   </>)
}

export default Home