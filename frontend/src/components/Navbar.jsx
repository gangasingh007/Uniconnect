import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, User, ChevronDown, BookOpenCheck, CalendarClock, Menu, X, BookOpen, Home } from 'lucide-react';

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
        { href: "/", icon: Home, label: "Dashboard", color: "purple" },
        { href: "/subjects", icon: BookOpen, label: "Subjects", color: "blue" },
        { href: "Syllabus.html", icon: BookOpenCheck, label: "Syllabus", color: "green", external: true },
        { href: "Datesheet.html", icon: CalendarClock, label: "Datesheet", color: "orange", external: true }
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`w-full px-4 sm:px-6 py-3 flex items-center justify-between bg-black/50 backdrop-blur-lg border-b sticky top-0 z-50 transition-all duration-300 ${
                scrolled ? 'border-purple-500/20 shadow-lg shadow-purple-500/5' : 'border-white/10'
            }`}
        >
            {/* Left: Logo */}
            <Logo />
            
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

const Logo = () => (
    <motion.div 
        className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
        whileHover={{ scale: 1.05 }}
    >
        UniConnect
    </motion.div>
);

const DesktopNav = ({ navLinks }) => (
    <div className="hidden lg:flex items-center gap-2">
        {navLinks.map((link, i) => (
            <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : "_self"}
                rel={link.external ? "noopener noreferrer" : ""}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
            >
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 hover:bg-white/10 border border-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                whileHover={{ scale: 1.05 }}
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
                {user?.firstName && <span className="hidden sm:inline text-white font-medium text-sm">{user.firstName}</span>}
                <ChevronDown className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={16} />
            </motion.button>
            <AnimatePresence>
                {isOpen && user && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-64 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl"
                    >
                        <div className="p-4 border-b border-white/10">
                            <p className="font-semibold text-white">{user.firstName} {user.lastName || ''}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <div className="py-2">
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

    const menuVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { when: "beforeChildren" } }
    };
    const listVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="lg:hidden">
            <motion.button onClick={() => setIsOpen(true)} className="p-2.5 rounded-lg bg-black/20 hover:bg-white/10 border border-white/10 transition-colors">
                <Menu className="text-white" size={20} />
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col p-6"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <Logo />
                            <motion.button onClick={() => setIsOpen(false)} className="p-2">
                                <X size={24} />
                            </motion.button>
                        </div>
                        <motion.ul variants={listVariants} className="flex flex-col gap-2">
                            {navLinks.map(link => (
                                <motion.li key={link.label} variants={itemVariants}>
                                    <a
                                        href={link.href}
                                        target={link.external ? "_blank" : "_self"}
                                        rel={link.external ? "noopener noreferrer" : ""}
                                        className="bg-black/70 flex items-center gap-4 p-4 text-xl font-semibold text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <link.icon className={`text-${link.color}-400`} size={24} />
                                        {link.label}
                                    </a>
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const MenuItem = ({ icon: Icon, label, onClick, isDanger = false }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
            isDanger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
    >
        <Icon size={16} />
        {label}
    </button>
);

export default Navbar;
