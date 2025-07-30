import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import Subjects from '../components/Subjects'
import { motion } from 'framer-motion'
import { ChevronRight, BookOpen, Brain, Users, Search, FileText, Zap, Star, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'



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
     <Footer />
   </>)
}

export default Home