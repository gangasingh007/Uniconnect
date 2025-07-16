import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Brain, Users, Search, FileText, Zap, Star, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UniConnect = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Centralized Resource Hubs",
      description: "Course-specific libraries where students can upload, access, and manage study materials in one organized location."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Note Summarizer",
      description: "Intelligent tool that provides concise summaries of lengthy documents, saving valuable study time."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "AI Flashcard Generator",
      description: "Automatically extracts key terms and definitions to create digital flashcards from uploaded content."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaborative Learning",
      description: "Connect with classmates and access resources shared by seniors, creating an inclusive learning environment."
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Search",
      description: "Quickly find specific files and information with advanced search capabilities across all resources."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Efficient Study Tools",
      description: "Transform passive materials into active study aids with AI-powered learning enhancements."
    }
  ];

  const problems = [
    {
      title: "Scattered Resources",
      description: "Notes and materials spread across WhatsApp, Telegram, Google Drive, and personal computers."
    },
    {
      title: "Inefficient Search",
      description: "Students waste time searching through endless chat histories and unorganized folders."
    },
    {
      title: "Information Silos",
      description: "New students lack access to valuable resources accumulated by their seniors."
    },
    {
      title: "Passive Learning",
      description: "Simply possessing documents doesn't guarantee effective learning outcomes."
    }
  ];

  return (
    <div className="min-h-screen  text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-1000/95 backdrop-blur-sm border-b border-gray-900 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                UniConnect
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#solution" className="text-gray-300 hover:text-white transition-colors">Solution</a>
              <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Benefits</a>
              <button onClick={() => navigate("/register")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                Sign Up
              </button>
            </div>

            <button 
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
     {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-3">
              <a 
                href="#features" 
                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 mr-3 text-blue-400" />
                Features
              </a>
              <a 
                href="#solution" 
                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Brain className="w-5 h-5 mr-3 text-purple-400" />
                Solution
              </a>
              <a 
                href="#benefits" 
                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="w-5 h-5 mr-3 text-green-400" />
                Benefits
              </a>
              <div className="pt-3 border-t border-gray-700">
                <button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className={`pt-34 pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            Revolutionize Your
            <br />
            Academic Experience
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            UniConnect streamlines university life by centralizing study materials, 
            integrating AI-powered tools, and fostering collaborative learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={()=>navigate("/register")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2">
              Get Started
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={()=>navigate("/login")} className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all">
              Login
            </button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problems" className={`py-16 px-4 sm:px-6 lg:px-8 bg-gray-1000/50 transition-all duration-1000 ${isVisible.problems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              The Academic Challenge
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Students face significant challenges in managing their study resources effectively
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {problems.map((problem, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-red-500/50 transition-all">
                <h3 className="text-xl font-semibold mb-4 text-red-400">{problem.title}</h3>
                <p className="text-gray-300">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.solution ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              The UniConnect Solution
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A comprehensive platform that transforms how students access, organize, and study their materials
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 p-8 rounded-xl border border-blue-500/30">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Centralized Resource Hubs</h3>
                <p className="text-gray-300 mb-4">
                  Course-specific libraries where students can upload, access, and manage study materials 
                  in one organized location. No more scattered files or lost resources.
                </p>
                <div className="flex items-center gap-2 text-blue-400">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold">Organized by Course</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-600/20 p-8 rounded-xl border border-purple-500/30">
                <h3 className="text-2xl font-bold mb-4 text-purple-400">AI-Enhanced Learning</h3>
                <p className="text-gray-300 mb-4">
                  Intelligent tools that actively assist in the learning process with automatic 
                  summarization and flashcard generation from your materials.
                </p>
                <div className="flex items-center gap-2 text-purple-400">
                  <Brain className="w-5 h-5" />
                  <span className="font-semibold">Smart Study Tools</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-1000 to-gray-900 p-8 rounded-xl border border-gray-700">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Upload Materials</h4>
                    <p className="text-gray-400 text-sm">PDFs, DOCX, images, and links</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">AI Processing</h4>
                    <p className="text-gray-400 text-sm">Automatic summarization & flashcards</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Enhanced Study</h4>
                    <p className="text-gray-400 text-sm">Active learning tools ready to use</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to excel in your academic journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all transform hover:scale-105">
                <div className="text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className={`py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose UniConnect?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your academic experience with our comprehensive platform
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-8 rounded-xl border border-blue-500/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Save Time</h3>
                <p className="text-gray-300">
                  Reduce hours spent searching for materials and organizing resources with our centralized system.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-8 rounded-xl border border-purple-500/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Learn Smarter</h3>
                <p className="text-gray-300">
                  AI-powered tools transform passive reading into active learning with summaries and flashcards.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-8 rounded-xl border border-green-500/30">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">Collaborate Better</h3>
                <p className="text-gray-300">
                  Access shared resources and contribute to a collaborative learning environment with your peers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* Footer */}
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
    </div>
  );
};

export default UniConnect;