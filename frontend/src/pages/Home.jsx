import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import { motion } from 'framer-motion'
import { ChevronRight, BookOpen, Brain, Users, Search, FileText, Zap, Star, Menu, X } from 'lucide-react';
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
    </div>
     <Footer />
   </>)
}

export default Home