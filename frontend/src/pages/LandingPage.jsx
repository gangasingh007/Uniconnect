import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Brain, Users, Search, FileText, Zap, Star, Menu, X, ArrowRight, Sparkles, Shield, Clock, Target } from 'lucide-react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Enhanced Feature Card with better animations and styling
const FeatureCard = ({ icon, title, description, index }) => (
  <div
    className="group relative bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 transition-all duration-500 transform hover:-translate-y-3 hover:border-blue-400/60 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden"
    style={{ transitionDelay: `${index * 150}ms` }}
  >
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Floating particles effect */}
    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
    <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" style={{animationDelay: '1s'}}></div>
    
    <div className="relative z-10">
      <div className="text-blue-400 mb-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
        {React.cloneElement(icon, { className: "w-8 h-8" })}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white tracking-wide group-hover:text-blue-100 transition-colors duration-300">{title}</h3>
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{description}</p>
      
      {/* Hover arrow indicator */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
        <ArrowRight className="w-5 h-5 text-blue-400" />
      </div>
    </div>
  </div>
);

// Enhanced Problem Card with better visual hierarchy
const ProblemCard = ({ title, description, index }) => (
  <div
    className="group relative bg-gradient-to-br from-red-950/30 to-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-red-900/30 transition-all duration-500 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-900/30"
    style={{ transitionDelay: `${index * 120}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
    <div className="relative z-10">
      <div className="w-3 h-3 bg-red-400 rounded-full mb-4 animate-pulse"></div>
      <h3 className="text-2xl font-semibold mb-4 text-red-300 group-hover:text-red-200 transition-colors duration-300">{title}</h3>
      <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{description}</p>
    </div>
  </div>
);

// Enhanced Benefit Card with gradient backgrounds and animations
const BenefitCard = ({ icon, title, description, color, index }) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500/20 via-blue-600/10 to-cyan-500/20',
      border: 'border-blue-500/40',
      iconBg: 'from-blue-500 to-blue-600',
      text: 'text-blue-200',
      glow: 'shadow-blue-500/30',
    },
    purple: {
      bg: 'from-purple-500/20 via-purple-600/10 to-pink-500/20',
      border: 'border-purple-500/40',
      iconBg: 'from-purple-500 to-purple-600',
      text: 'text-purple-200',
      glow: 'shadow-purple-500/30',
    },
    green: {
      bg: 'from-green-500/20 via-emerald-600/10 to-teal-500/20',
      border: 'border-green-500/40',
      iconBg: 'from-green-500 to-green-600',
      text: 'text-green-200',
      glow: 'shadow-green-500/30',
    },
  };
  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`group relative bg-gradient-to-br backdrop-blur-xl ${selectedColor.bg} p-10 rounded-3xl border ${selectedColor.border} text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${selectedColor.glow} overflow-hidden`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-4 left-4 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/3 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10">
        <div className={`w-20 h-20 bg-gradient-to-br ${selectedColor.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {React.cloneElement(icon, { className: "w-10 h-10 text-white" })}
        </div>
        <h3 className={`text-3xl font-bold mb-6 ${selectedColor.text}`}>{title}</h3>
        <p className="text-slate-300 leading-relaxed text-lg">{description}</p>
        
        {/* Subtle sparkle effect */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// Enhanced Stats Component
const StatsSection = () => (
  <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-950/20 to-purple-950/20 backdrop-blur-sm">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8 text-center">
        {[
          { number: "10K+", label: "Active Students", icon: <Users className="w-8 h-8" /> },
          { number: "500+", label: "Study Materials", icon: <FileText className="w-8 h-8" /> },
          { number: "95%", label: "Time Saved", icon: <Clock className="w-8 h-8" /> },
          { number: "4.9/5", label: "User Rating", icon: <Star className="w-8 h-8" /> },
        ].map((stat, index) => (
          <div key={index} className="group p-6">
            <div className="text-blue-400 mb-4 mx-auto w-fit group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
              {stat.number}
            </div>
            <div className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Main Landing Page Component
const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users , setusers ] = useState("")
  const [resources , setresources ] = useState("")
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate()

  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

   
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.disconnect());
  }, []);
  
  const features = [
    { icon: <BookOpen />, title: "Centralized Resource Hubs", description: "Course-specific libraries where students can upload, access, and manage study materials in one organized location with smart categorization." },
    { icon: <Brain />, title: "AI Note Summarizer", description: "Intelligent tool that provides concise summaries of lengthy documents, saving valuable study time with advanced NLP algorithms." },
    { icon: <FileText />, title: "AI Flashcard Generator", description: "Automatically extracts key terms and definitions to create interactive digital flashcards from uploaded content with spaced repetition." },
    { icon: <Users />, title: "Collaborative Learning", description: "Connect with classmates and access resources shared by seniors, creating an inclusive and supportive learning environment." },
    { icon: <Search />, title: "Smart Search", description: "Quickly find specific files and information with advanced search capabilities across all resources using semantic search technology." },
    { icon: <Zap />, title: "Efficient Study Tools", description: "Transform passive materials into active study aids with AI-powered learning enhancements and personalized recommendations." }
  ];

  const problems = [
    { title: "Scattered Resources", description: "Notes and materials spread across WhatsApp, Telegram, Google Drive, and personal computers, making access difficult and time-consuming." },
    { title: "Inefficient Search", description: "Students waste precious time searching through endless chat histories and unorganized folders instead of studying." },
    { title: "Information Silos", description: "New students lack access to valuable resources accumulated by their seniors, missing out on proven study materials." },
    { title: "Passive Learning", description: "Simply possessing documents doesn't guarantee effective learning outcomes without proper organization and active engagement." }
  ];
  
  const getSectionClass = (id) => `transition-all duration-1000 ease-out ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`;

 

  return (
    <div className="min-h-screen text-white ">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
                UniConnect
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {[
                { href: "#features", label: "Features" },
                { href: "#solution", label: "Solution" },
                { href: "#benefits", label: "Benefits" }
              ].map(item => (
                <a key={item.href} href={item.href} className="text-slate-300 hover:text-white transition-colors duration-300 relative group">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <button onClick={() => navigate("/register")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 transform hover:scale-105 font-semibold">
                Sign Up
              </button>
            </div>

            <button className="md:hidden text-slate-300 hover:text-white transition-colors duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 shadow-2xl px-4 pt-4 pb-6 space-y-2">
            {[
              { href: '#features', label: 'Features', icon: <BookOpen className="w-5 h-5 mr-3 text-blue-400" /> },
              { href: '#solution', label: 'Solution', icon: <Brain className="w-5 h-5 mr-3 text-purple-400" /> },
              { href: '#benefits', label: 'Benefits', icon: <Star className="w-5 h-5 mr-3 text-green-400" /> }
            ].map(item => (
              <a key={item.href} href={item.href} className="flex items-center px-4 py-4 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-300 transform hover:translate-x-2" onClick={() => setIsMenuOpen(false)}>
                {item.icon} {item.label}
              </a>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-700/50">
              <button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                onClick={() => navigate("/register")}
              >
                Get Started <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Enhanced Hero Section */}
        <section id="hero" className={`pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden ${getSectionClass('hero')}`}>
          {/* Hero background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border border-blue-500/30 mb-8">
                <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-blue-200 font-semibold">Revolutionizing Academic Success</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight leading-tight">
              Transform Your
              <br />
              <span className="relatibg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20ve">
                Academic Journey
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              UniConnect streamlines university life by centralizing study materials, 
              integrating AI-powered tools, and fostering collaborative learning experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button onClick={() => navigate("/register")} className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-5 rounded-xl text-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 shadow-2xl hover:shadow-purple-500/40">
                Get Started 
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button onClick={() => navigate("/login")} className="bg-slate-800/50 border-2 border-slate-700/50 text-slate-200 px-10 py-5 rounded-xl text-xl font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 backdrop-blur-xl">
                Login
              </button>
            </div>

            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              {[
                { icon: <Shield className="w-8 h-8" />, title: "Secure & Private", desc: "Your data is encrypted and protected" },
                { icon: <Zap className="w-8 h-8" />, title: "Lightning Fast", desc: "Instant access to all your materials" },
                { icon: <Target className="w-8 h-8" />, title: "Goal Oriented", desc: "Track your academic progress" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-6 bg-slate-900/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300">
                  <div className="text-blue-400 bg-blue-500/10 p-3 rounded-xl">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Enhanced Problem Statement */}
        <section id="problems" className={`py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-950/10 to-slate-950/50 ${getSectionClass('problems')}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-2 bg-red-500/10 backdrop-blur-xl rounded-full border border-red-500/20 mb-6">
                <span className="text-red-300 font-semibold">The Challenge</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Academic Struggles Students Face</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">Students face significant challenges in managing their study resources effectively, impacting their academic performance.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {problems.map((problem, index) => (
                <ProblemCard key={index} {...problem} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Solution Section */}
        <section id="solution" className={`py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-950/10 to-purple-950/10 ${getSectionClass('solution')}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-2 bg-blue-500/10 backdrop-blur-xl rounded-full border border-blue-500/20 mb-6">
                <span className="text-blue-300 font-semibold">The Solution</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">The UniConnect Revolution</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">A comprehensive platform that transforms how students access, organize, and study their academic materials.</p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
              <div className="space-y-8">
                <div className="group bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-xl p-10 rounded-3xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-200">Centralized Resource Hubs</h3>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed text-lg">Course-specific libraries to upload, access, and manage study materials in one organized location. No more scattered files or lost resources.</p>
                  <div className="flex items-center gap-3 text-blue-300 font-semibold">
                    <Target className="w-5 h-5" />
                    <span>Organized by Course & Topic</span>
                  </div>
                </div>
                
                <div className="group bg-gradient-to-br from-purple-900/40 to-slate-900/40 backdrop-blur-xl p-10 rounded-3xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-200">AI-Enhanced Learning</h3>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed text-lg">Intelligent tools to assist in the learning process with automatic summarization and flashcard generation from your materials.</p>
                  <div className="flex items-center gap-3 text-purple-300 font-semibold">
                    <Sparkles className="w-5 h-5" />
                    <span>Smart Study Tools</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-xl p-10 rounded-3xl border border-slate-700/50">
                <h3 className="text-2xl font-bold mb-8 text-center text-white">How It Works</h3>
                <div className="space-y-8">
                  {[
                    { icon: <FileText className="w-8 h-8 text-white" />, title: "Upload Materials", desc: "PDFs, DOCX, images, and links", color: "from-blue-500 to-blue-600", step: "01" },
                    { icon: <Brain className="w-8 h-8 text-white" />, title: "AI Processing", desc: "Automatic summarization & flashcards", color: "from-purple-500 to-purple-600", step: "02" },
                    { icon: <Zap className="w-8 h-8 text-white" />, title: "Enhanced Study", desc: "Active learning tools ready to use", color: "from-green-500 to-green-600", step: "03" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300">
                      <div className="relative">
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                          {item.icon}
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 text-slate-300 rounded-full flex items-center justify-center text-xs font-bold">
                          {item.step}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg mb-1">{item.title}</h4>
                        <p className="text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" className={`py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950/50 to-slate-900/80 ${getSectionClass('features')}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-2 bg-green-500/10 backdrop-blur-xl rounded-full border border-green-500/20 mb-6">
                <span className="text-green-300 font-semibold">Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Powerful Features for Success</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">Everything you need to excel in your academic journey, powered by cutting-edge technology.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Benefits Section */}
        <section id="benefits" className={`py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-950/20 to-slate-950 ${getSectionClass('benefits')}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-6 py-2 bg-purple-500/10 backdrop-blur-xl rounded-full border border-purple-500/20 mb-6">
                <span className="text-purple-300 font-semibold">Benefits</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Why Choose UniConnect?</h2>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">Transform your study habits and collaborate like never before with our innovative platform.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-10 mb-16">
              <BenefitCard icon={<Star />} title="Save Time" description="Reduce hours spent searching for materials and organizing resources with our centralized system and smart organization." color="blue" index={0} />
              <BenefitCard icon={<Brain />} title="Learn Smarter" description="AI-powered tools transform passive reading into active learning with summaries, flashcards, and personalized study plans." color="purple" index={1} />
              <BenefitCard icon={<Users />} title="Collaborate Better" description="Access shared resources and contribute to a collaborative learning environment with your peers and seniors." color="green" index={2} />
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl p-12 rounded-3xl border border-blue-500/20">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Academic Journey?</h3>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Join thousands of students who have already revolutionized their learning experience with UniConnect.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate("/register")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl">
                  Start Free Today <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => navigate("/login")} className="border-2 border-slate-600 text-slate-300 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-slate-800 hover:border-slate-500 transition-all duration-300">
                  Login
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What Students Say</h2>
              <p className="text-lg text-slate-400">Real feedback from students who transformed their academic experience</p>
            </div>
            {/* <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "Computer Science Student",
                  quote: "UniConnect saved me countless hours. I can find any material instantly and the AI summaries are incredibly helpful for exam prep.",
                  rating: 5
                },
                {
                  name: "Michael Rodriguez",
                  role: "Engineering Student",
                  quote: "The collaborative features are amazing. I can access notes from seniors and share my own materials easily. It's like having a study group 24/7.",
                  rating: 5
                },
                {
                  name: "Emily Johnson",
                  role: "Medical Student",
                  quote: "The AI flashcard generator is a game-changer. It automatically creates study cards from my textbooks and lecture notes. My grades improved significantly!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-slate-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div> */}
            <div className='flex justify-center text-center text-slate-400 text-xl font-bold border-2 border-slate-600 rounded-xl p-4'>Testimonials Coming Soon</div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;