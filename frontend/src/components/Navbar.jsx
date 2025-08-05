import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, User, ChevronDown, BookOpenCheck, CalendarClock, Menu, X, BookOpen, Home, Sparkles } from 'lucide-react';

import { userAtom } from '../atoms/userAtom';
import { loadingAtom } from '../atoms/states.atom';

// Main Navbar Component
const Navbar = () => {
    const user = useRecoilValue(userAtom);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: "/", icon: Home, label: "Dashboard", color: "purple", gradient: "from-purple-500 to-purple-600" },
        { href: "/subjects", icon: BookOpen, label: "Subjects", color: "blue", gradient: "from-blue-500 to-cyan-500" },
        { href: "Syllabus.html", icon: BookOpenCheck, label: "Syllabus", color: "green", gradient: "from-green-500 to-emerald-500", external: true },
        { href: "Datesheet.html", icon: CalendarClock, label: "Datesheet", color: "orange", gradient: "from-orange-500 to-pink-500", external: true }
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`w-full px-4 sm:px-6 py-3 flex items-center justify-between relative sticky top-0 z-50 transition-all duration-500 ${
                scrolled 
                    ? 'bg-black/60 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl shadow-purple-500/10' 
                    : 'bg-black/40 backdrop-blur-lg border-b border-white/10'
            }`}
            style={{
                background: scrolled 
                    ? 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(16,16,40,0.9) 50%, rgba(30,16,50,0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(16,16,40,0.6) 50%, rgba(30,16,50,0.4) 100%)'
            }}
        >
            {/* Left: Logo */}
            <Logo scrolled={scrolled} />
            
            {/* Center: Desktop Navigation */}
            <DesktopNav navLinks={navLinks} />

            {/* Right: Profile & Mobile Menu */}
            <div className="flex items-center gap-3">
                <ProfileDropdown user={user} />
                <MobileNav navLinks={navLinks} />
            </div>
        </motion.nav>
    );
};

// --- Child Components ---

const Logo = ({ scrolled }) => (
    <motion.div 
        className="relative text-2xl sm:text-3xl font-bold cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
    >
        <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
                background: [
                    'linear-gradient(45deg, rgba(168,85,247,0.2) 0%, rgba(59,130,246,0.2) 50%, rgba(236,72,153,0.2) 100%)',
                    'linear-gradient(45deg, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.2) 50%, rgba(59,130,246,0.2) 100%)',
                    'linear-gradient(45deg, rgba(59,130,246,0.2) 0%, rgba(236,72,153,0.2) 50%, rgba(168,85,247,0.2) 100%)'
                ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <span className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            UniConnect
        </span>
        <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
);

const DesktopNav = ({ navLinks }) => (
    <div className="hidden lg:flex items-center gap-1">
        {navLinks.map((link, i) => (
            <motion.div
                key={link.label}
                className="relative group"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1, ease: "easeOut" }}
            >
                <motion.a
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    rel={link.external ? "noopener noreferrer" : ""}
                    className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-lg group overflow-hidden"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* Hover background */}
                    <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg`}
                    />
                    
                    {/* Icon with gradient */}
                    <link.icon className={`w-4 h-4 text-${link.color}-400 group-hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.6)] transition-all duration-300`} />
                    
                    {/* Text */}
                    <span className="relative z-10">{link.label}</span>
                    
                    {/* Animated underline */}
                    <motion.span 
                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${link.gradient} w-0 group-hover:w-full transition-all duration-300 rounded-full`}
                        whileHover={{ boxShadow: `0 0 8px rgba(168,85,247,0.6)` }}
                    />
                    
                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    />
                </motion.a>
            </motion.div>
        ))}
    </div>
);

const ProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useRecoilState(loadingAtom);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setLoading(true);
        setTimeout(() => {
            localStorage.removeItem("token");
            navigate("/login");
            toast.success("You have been logged out.");
            setLoading(false);
        }, 500);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 hover:border-purple-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 group overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                {/* Animated background */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Avatar with animated border */}
                <motion.div 
                    className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm"
                    animate={{
                        background: [
                            'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #ec4899 100%)',
                            'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
                            'linear-gradient(135deg, #3b82f6 0%, #ec4899 50%, #8b5cf6 100%)'
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                </motion.div>
                
                {user?.firstName && (
                    <span className="hidden sm:inline text-white font-medium text-sm relative z-10">
                        {user.firstName}
                    </span>
                )}
                
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="text-gray-400 group-hover:text-purple-300 transition-colors duration-300" size={16} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && user && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-64 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, rgba(26,26,46,0.95) 0%, rgba(22,33,62,0.95) 100%)'
                        }}
                    >
                        {/* Animated border */}
                        <motion.div
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 p-px"
                            animate={{
                                background: [
                                    'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(59,130,246,0.2) 50%, rgba(236,72,153,0.2) 100%)',
                                    'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.2) 50%, rgba(59,130,246,0.2) 100%)'
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        />
                        
                        <div className="relative z-10 p-4 border-b border-white/10">
                            <p className="font-semibold text-white flex items-center gap-2">
                                {user.firstName} {user.lastName || ''}
                                <motion.div
                                    className="w-2 h-2 bg-green-400 rounded-full"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-1">{user.email}</p>
                        </div>
                        
                        <div className="relative z-10 py-2">
                            <MenuItem icon={User} label="Profile" onClick={() => navigate("/profile")} />
                            <MenuItem icon={LogOut} label="Sign Out" onClick={handleLogout} isDanger />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MobileNav = ({ navLinks }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Effect to lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Cleanup function to ensure scroll is restored on component unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);


    // Animation variants for the slide-in panel
    const menuVariants = {
        open: { 
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        closed: { 
            x: "100%",
            transition: { type: "spring", stiffness: 300, damping: 30 }
        }
    };
    
    // Animation variants for the list and items (staggered effect)
    const listVariants = {
        open: {
            transition: { staggerChildren: 0.07, delayChildren: 0.2 }
        },
        closed: {
            transition: { staggerChildren: 0.05, staggerDirection: -1 }
        }
    };
    
    const itemVariants = {
        open: {
            y: 0,
            opacity: 1,
            transition: {
                y: { stiffness: 1000, velocity: -100 }
            }
        },
        closed: {
            y: 50,
            opacity: 0,
            transition: {
                y: { stiffness: 1000 }
            }
        }
    };

    return (
        <div className="lg:hidden">
            {/* Mobile Menu Button */}
            <motion.button 
                onClick={() => setIsOpen(true)} 
                className="relative p-2.5 rounded-lg bg-black/30 hover:bg-black/50 border border-white/20 hover:border-purple-500/50 transition-all duration-300 group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <Menu className="text-white relative z-10 group-hover:text-purple-300 transition-colors duration-300" size={20} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop with blur and click-to-close */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        />

                        {/* The actual menu panel that slides in */}
                        <motion.div
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col p-6"
                            style={{
                                background: 'linear-gradient(135deg, rgba(16,16,40,0.95) 0%, rgba(30,16,50,0.98) 100%)'
                            }}
                        >
                             {/* Animated particles background */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-1 bg-purple-400 rounded-full"
                                        style={{
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            opacity: [0.2, 0.8, 0.2],
                                            scale: [1, 1.5, 1],
                                        }}
                                        transition={{
                                            duration: 2 + Math.random() * 2,
                                            repeat: Infinity,
                                            delay: Math.random() * 2,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="relative z-10 flex justify-end items-center mb-10">
                                
                                <motion.button 
                                    onClick={() => setIsOpen(false)} 
                                    className="p-2 rounded-lg bg-black/30 hover:bg-red-500/20 border border-white/20 hover:border-red-500/50 transition-all duration-300 group"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="text-white group-hover:text-red-400 transition-colors duration-300" size={24} />
                                </motion.button>
                            </div>
                            
                            <motion.ul variants={listVariants} className="relative z-10 flex flex-col gap-3">
                                {navLinks.map((link, index) => (
                                    <motion.li key={link.label} variants={itemVariants}>
                                        <motion.a
                                            href={link.href}
                                            target={link.external ? "_blank" : "_self"}
                                            rel={link.external ? "noopener noreferrer" : ""}
                                            className="relative  flex items-center gap-4 p-4 text-xl font-semibold text-gray-300 hover:text-white rounded-xl transition-all duration-300 group overflow-hidden"
                                            style={{
                                                background: '#111212'
                                            }}
                                            whileHover={{ scale: 1.02, x: 10 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <motion.div
                                                className={`absolute inset-0 bg-gradient-to-r ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}
                                            />
                                            <motion.div
                                                animate={{
                                                    boxShadow: [
                                                        `0 0 0px rgba(168,85,247,0)`,
                                                        `0 0 20px rgba(168,85,247,0.3)`,
                                                        `0 0 0px rgba(168,85,247,0)`
                                                    ]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                                className="rounded-lg p-2"
                                            >
                                                <link.icon className={`text-${link.color}-400 group-hover:scale-110 transition-transform duration-300`} size={24} />
                                            </motion.div>
                                            
                                            <span className="relative z-10">{link.label}</span>
                                            
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                                            />
                                        </motion.a>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const MenuItem = ({ icon: Icon, label, onClick, isDanger = false }) => (
    <motion.button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 relative group overflow-hidden ${
            isDanger 
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
        whileHover={{ x: 5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        {/* Hover background effect */}
        <motion.div
            className={`absolute inset-0 ${isDanger ? 'bg-red-500/5' : 'bg-white/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />
        
        <Icon size={16} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
        <span className="relative z-10">{label}</span>
        
        {/* Shine effect */}
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"
        />
    </motion.button>
);

export default Navbar;