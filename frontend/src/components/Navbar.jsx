import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, User, ChevronDown, BookOpenCheck, CalendarClock, Menu, X, BookOpen, Home, Sparkles } from 'lucide-react';

import { userAtom } from '../atoms/userAtom';
import { loadingAtom } from '../atoms/states.atom';

// NEW: Color mapping to ensure Tailwind CSS generates all required classes
const colorMap = {
    purple: { text: 'text-purple-400', gradient: 'from-purple-500 to-purple-600' },
    blue: { text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
    green: { text: 'text-green-400', gradient: 'from-green-500 to-emerald-500' },
    red: { text: 'text-red-400', gradient: 'from-orange-500 to-pink-500' },
};

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
        { href: "/", icon: Home, label: "Dashboard", color: "purple" },
        { href: "/subjects", icon: BookOpen, label: "Subjects", color: "blue" },
        { href: "Syllabus.html", icon: BookOpenCheck, label: "Syllabus", color: "green", external: true },
        { href: "Datesheet.html", icon: CalendarClock, label: "Datesheet", color: "red", external: true }
    ];

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-black/70 backdrop-blur-xl border-b border-purple-500/30 shadow-lg shadow-purple-500/10' 
                    : 'bg-transparent border-b border-transparent'
            }`}
        >
            <Logo />
            <DesktopNav navLinks={navLinks} />
            <div className="flex items-center gap-3">
                {user && <ProfileDropdown user={user} />}
                <MobileNav navLinks={navLinks} />
            </div>
        </motion.nav>
    );
};

// --- Child Components ---

const Logo = () => (
    <motion.a href="/" className="relative text-2xl sm:text-3xl font-bold cursor-pointer group">
        <motion.div
            className="absolute -inset-2.5 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-pink-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
                rotate: [0, 360],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <span className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            UniConnect
        </span>
        <Sparkles className="absolute -top-1.5 -right-2.5 w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
    </motion.a>
);

const DesktopNav = ({ navLinks }) => {
    const [activeLink, setActiveLink] = useState(null);

    return (
        <div className="hidden lg:flex items-center gap-2 bg-black/20 border border-white/10 rounded-full px-3 py-1.5 shadow-inner shadow-black/20">
            {navLinks.map((link) => (
                <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    rel={link.external ? "noopener noreferrer" : ""}
                    onHoverStart={() => setActiveLink(link.label)}
                    onHoverEnd={() => setActiveLink(null)}
                    className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white duration-300 rounded-full z-10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <link.icon
                        className={`${colorMap[link.color].text} w-4 h-4 transition-colors duration-300`}
                    />
                    <span>{link.label}</span>

                    {activeLink === link.label && (
                        <motion.div
                            layoutId="desktop-nav-indicator"
                            className="absolute inset-0 rounded-full bg-white/10 opacity-1 "
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    )}
                </motion.a>
            ))}
        </div>
    );
};


const ProfileDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [, setLoading] = useRecoilState(loadingAtom);
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
            toast.success("Logged out successfully.");
            setLoading(false);
        }, 500);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-2 px-2 py-1.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 hover:border-purple-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 group"
                whileTap={{ scale: 0.97 }}
            >
                <motion.div 
                    className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm"
                >
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </motion.div>
                
                {user?.firstName && (
                    <span className="hidden sm:inline text-white font-medium text-sm pr-1">
                        {user.firstName}
                    </span>
                )}
                
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="text-gray-400 group-hover:text-purple-300 transition-colors duration-300" size={16} />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-64 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/10">
                            <p className="font-semibold text-white flex items-center gap-2">
                                {user.firstName} {user.lastName || ''}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-1">{user.email}</p>
                        </div>
                        
                        <div className="py-2">
                            <MenuItem icon={User} label="Profile" onClick={() => { navigate("/profile"); setIsOpen(false); }} />
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

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const menuVariants = {
        open: { x: 0, transition: { type: "spring", stiffness: 260, damping: 30 } },
        closed: { x: "100%", transition: { type: "spring", stiffness: 260, damping: 30 } }
    };
    
    const listVariants = {
        open: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
        closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
    };
    
    const itemVariants = {
        open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
        closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } }
    };

    return (
        <div className="lg:hidden">
            <motion.button 
                onClick={() => setIsOpen(true)} 
                className="p-2.5 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 hover:border-purple-500/50 transition-all duration-300 group"
                whileTap={{ scale: 0.95 }}
            >
                <Menu className="text-white group-hover:text-purple-300 transition-colors duration-300" size={20} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm "
                        />
                        <motion.div
                            variants={menuVariants} initial="closed" animate="open" exit="closed"
                            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-black/50 backdrop-blur-2xl border-l border-white/10 shadow-2xl shadow-black/50"
                        >
                            <div className="p-6 h-full flex flex-col ">
                                <div className="flex justify-between items-center mb-15 pb-5 border-b border-white/30">
                                     <Logo />
                                     <motion.button 
                                        onClick={() => setIsOpen(false)} 
                                        className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 transition-colors duration-300 group"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <X className="text-gray-300 group-hover:text-red-400 transition-colors" size={24} />
                                    </motion.button>
                                </div>
                                
                                <motion.ul variants={listVariants} className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <motion.li key={link.label} variants={itemVariants}>
                                            <a
                                                href={link.href}
                                                target={link.external ? "_blank" : "_self"}
                                                rel={link.external ? "noopener noreferrer" : ""}
                                                onClick={() => setIsOpen(false)}
                                                className="relative flex items-center gap-4 p-4 text-lg font-semibold text-gray-200 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300 group"
                                            >
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-gradient-to-b ${colorMap[link.color].gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                                <link.icon className={`${colorMap[link.color].text} group-hover:scale-110 transition-transform duration-300`} size={24} />
                                                <span className="relative z-10">{link.label}</span>
                                            </a>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </div>
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
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200 ${
            isDanger 
                ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                : 'text-gray-300 hover:bg-white/5 hover:text-white'
        }`}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
        <Icon size={16} />
        <span>{label}</span>
    </motion.button>
);

export default Navbar;
