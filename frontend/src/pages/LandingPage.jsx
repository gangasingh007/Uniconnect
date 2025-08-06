import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, Brain, Users, Search, FileText, Zap, Star, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';

// --- Reusable Card Components ---

const FeatureCard = ({ icon, title, description, index }) => (
  <div
    className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/80 transition-all duration-300 transform hover:-translate-y-2 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/10"
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    <div className="text-blue-400 mb-4 bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center">
      {React.cloneElement(icon, { className: "w-8 h-8" })}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white tracking-wide">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const ProblemCard = ({ title, description, index }) => (
  <div
    className="bg-gray-900 p-6 rounded-2xl border border-gray-800 transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-900/20"
    style={{ transitionDelay: `${index * 100}ms` }}
  >
    <h3 className="text-xl font-semibold mb-3 text-red-400">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

const BenefitCard = ({ icon, title, description, color, index }) => {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      iconBg: 'bg-blue-500',
      text: 'text-blue-300',
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      iconBg: 'bg-purple-500',
      text: 'text-purple-300',
    },
    green: {
      bg: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/30',
      iconBg: 'bg-green-500',
      text: 'text-green-300',
    },
  };
  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`bg-gradient-to-br backdrop-blur-sm ${selectedColor.bg} p-8 rounded-2xl border ${selectedColor.border} text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`w-16 h-16 ${selectedColor.iconBg} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
        {React.cloneElement(icon, { className: "w-8 h-8 text-white" })}
      </div>
      <h3 className={`text-2xl font-bold mb-4 ${selectedColor.text}`}>{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};


// --- Main Landing Page Component ---

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.15 } // A slightly higher threshold can feel better
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => sections.forEach(section => observer.disconnect());
  }, []);
  
  const features = [
    { icon: <BookOpen />, title: "Centralized Resource Hubs", description: "Course-specific libraries where students can upload, access, and manage study materials in one organized location." },
    { icon: <Brain />, title: "AI Note Summarizer", description: "Intelligent tool that provides concise summaries of lengthy documents, saving valuable study time." },
    { icon: <FileText />, title: "AI Flashcard Generator", description: "Automatically extracts key terms and definitions to create digital flashcards from uploaded content." },
    { icon: <Users />, title: "Collaborative Learning", description: "Connect with classmates and access resources shared by seniors, creating an inclusive learning environment." },
    { icon: <Search />, title: "Smart Search", description: "Quickly find specific files and information with advanced search capabilities across all resources." },
    { icon: <Zap />, title: "Efficient Study Tools", description: "Transform passive materials into active study aids with AI-powered learning enhancements." }
  ];

  const problems = [
    { title: "Scattered Resources", description: "Notes and materials spread across WhatsApp, Telegram, Google Drive, and personal computers." },
    { title: "Inefficient Search", description: "Students waste time searching through endless chat histories and unorganized folders." },
    { title: "Information Silos", description: "New students lack access to valuable resources accumulated by their seniors." },
    { title: "Passive Learning", description: "Simply possessing documents doesn't guarantee effective learning outcomes." }
  ];
  
  const getSectionClass = (id) => `transition-all duration-700 ease-in-out ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`;

  return (
    <div className="min-h-screen text-white bg-gray-1000">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-1000/80 backdrop-blur-md border-b border-gray-900 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
                UniConnect
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#solution" className="text-gray-300 hover:text-white transition-colors">Solution</a>
              <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Benefits</a>
              <button onClick={() => navigate("/register")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/20">
                Sign Up
              </button>
            </div>

            <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile menu with transition */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
            <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 shadow-lg px-2 pt-2 pb-4 space-y-1">
              {[
                { href: '#features', label: 'Features', icon: <BookOpen className="w-5 h-5 mr-3 text-blue-400" /> },
                { href: '#solution', label: 'Solution', icon: <Brain className="w-5 h-5 mr-3 text-purple-400" /> },
                { href: '#benefits', label: 'Benefits', icon: <Star className="w-5 h-5 mr-3 text-green-400" /> }
              ].map(item => (
                <a key={item.href} href={item.href} className="flex items-center px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                  {item.icon} {item.label}
                </a>
              ))}
              <div className="pt-3 mt-2 border-t border-gray-700">
                <button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                  onClick={() => navigate("/register")}
                >
                  Get Started <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className={`pt-48 pb-32 px-4 sm:px-6 lg:px-8 text-center ${getSectionClass('hero')}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            Revolutionize Your
            <br />
            Academic Experience
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            UniConnect streamlines university life by centralizing study materials, 
            integrating AI-powered tools, and fostering collaborative learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => navigate("/register")} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-purple-500/30">
              Get Started <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate("/login")} className="bg-gray-800/50 border border-gray-700 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 hover:border-gray-600 transition-all">
              Login
            </button>
          </div>
        </section>

        {/* Problem Statement */}
        <section id="problems" className={`py-24 px-4 sm:px-6 lg:px-8 bg-gray-1000/50 ${getSectionClass('problems')}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">The Academic Challenge</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">Students face significant challenges in managing their study resources effectively.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {problems.map((problem, index) => (
                <ProblemCard key={index} {...problem} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className={`py-24 px-4 sm:px-6 lg:px-8 ${getSectionClass('solution')}`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">The UniConnect Solution</h2>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto">A comprehensive platform that transforms how students access, organize, and study.</p>
                </div>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-blue-900/30 to-gray-900/30 p-8 rounded-2xl border border-blue-500/30">
                            <h3 className="text-2xl font-bold mb-4 text-blue-300">Centralized Resource Hubs</h3>
                            <p className="text-gray-400 mb-4 leading-relaxed">Course-specific libraries to upload, access, and manage study materials in one organized location. No more scattered files or lost resources.</p>
                            <div className="flex items-center gap-2 text-blue-400"><BookOpen className="w-5 h-5" /><span className="font-semibold">Organized by Course</span></div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-900/30 to-gray-900/30 p-8 rounded-2xl border border-purple-500/30">
                            <h3 className="text-2xl font-bold mb-4 text-purple-300">AI-Enhanced Learning</h3>
                            <p className="text-gray-400 mb-4 leading-relaxed">Intelligent tools to assist in the learning process with automatic summarization and flashcard generation from your materials.</p>
                            <div className="flex items-center gap-2 text-purple-400"><Brain className="w-5 h-5" /><span className="font-semibold">Smart Study Tools</span></div>
                        </div>
                    </div>
                    <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                        <div className="space-y-6">
                            {[
                                { icon: <FileText className="w-6 h-6 text-white" />, title: "Upload Materials", desc: "PDFs, DOCX, images, and links", color: "bg-blue-500" },
                                { icon: <Brain className="w-6 h-6 text-white" />, title: "AI Processing", desc: "Automatic summarization & flashcards", color: "bg-purple-500" },
                                { icon: <Zap className="w-6 h-6 text-white" />, title: "Enhanced Study", desc: "Active learning tools ready to use", color: "bg-green-500" }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/70 rounded-lg">
                                    <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center shadow-md`}>{item.icon}</div>
                                    <div>
                                        <h4 className="font-semibold text-white">{item.title}</h4>
                                        <p className="text-gray-400 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>


        {/* Features Section */}
        <section id="features" className={`py-24 px-4 sm:px-6 lg:px-8 bg-gray-1000/50 ${getSectionClass('features')}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Powerful Features</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">Everything you need to excel in your academic journey.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className={`py-24 px-4 sm:px-6 lg:px-8 ${getSectionClass('benefits')}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why Choose UniConnect?</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">Transform your study habits and collaborate like never before.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <BenefitCard icon={<Star />} title="Save Time" description="Reduce hours spent searching for materials and organizing resources with our centralized system." color="blue" index={0} />
                <BenefitCard icon={<Brain />} title="Learn Smarter" description="AI-powered tools transform passive reading into active learning with summaries and flashcards." color="purple" index={1} />
                <BenefitCard icon={<Users />} title="Collaborate Better" description="Access shared resources and contribute to a collaborative learning environment with your peers." color="green" index={2} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
