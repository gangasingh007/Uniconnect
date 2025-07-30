import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, ChevronDown, BookOpenCheck, CalendarClock, AlarmClockCheck, Menu, X } from 'lucide-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import { loadingAtom } from '../atoms/states.atom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const user = useRecoilValue(userAtom);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    try {
      localStorage.removeItem("token");
      navigate("/login");
      toast.success("You have been logged out");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { href: "Syllabus.html", icon: BookOpenCheck, label: "Syllabus", color: "purple" },
    { href: "Datesheet.html", icon: CalendarClock, label: "Datesheet", color: "blue" },
    { href: "#", icon: AlarmClockCheck, label: "Timetable", color: "green" }
  ];

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      purple: {
        text: "text-purple-400",
        hover: "hover:text-purple-300",
        bg: "hover:bg-purple-500/10",
        border: "border-purple-500/20",
        glow: "shadow-purple-500/20"
      },
      blue: {
        text: "text-blue-400",
        hover: "hover:text-blue-300",
        bg: "hover:bg-blue-500/10",
        border: "border-blue-500/20",
        glow: "shadow-blue-500/20"
      },
      green: {
        text: "text-green-400",
        hover: "hover:text-green-300",
        bg: "hover:bg-green-500/10",
        border: "border-green-500/20",
        glow: "shadow-green-500/20"
      }
    };
    return colors[color];
  };

  return (
    <nav className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#141423] via-[#1a1a2e] to-[#141423] border-b border-[#2a2a40] shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm sticky top-0 z-40">
      {/* Left: Logo */}
      <div className="flex items-center">
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm cursor-pointer hover:scale-105 transition-transform duration-300">
          UniConnect
        </div>
      </div>
      {/* Right: Profile & Mobile Menu */}
      <div className="flex items-center space-x-3">
        {/* Mobile Menu Button */}
        <div className="lg:hidden relative" ref={mobileMenuRef}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#151528] hover:bg-[#1f1f35] border border-[#2a2a40] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            {mobileMenuOpen ? (
              <X className="text-gray-400 w-5 h-5" />
            ) : (
              <Menu className="text-gray-400 w-5 h-5" />
            )}
          </button>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1f1f35] border border-[#3a3a50] rounded-lg overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
              <div className="py-2">
                {navLinks.map((link) => {
                  const colorClasses = getColorClasses(link.color);
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href !== "#" ? "new" : undefined}
                      className={`w-full px-4 py-3 text-sm text-gray-300 hover:bg-[#252540] hover:text-white transition-colors duration-150 flex items-center group`}
                    >
                      <Icon className={`w-4 h-4 mr-3 ${colorClasses.text} ${colorClasses.hover} transition-colors`} />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg bg-[#151528]/80 hover:bg-[#1f1f35] border border-[#2a2a40] hover:border-[#3a3a50] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center text-white font-medium text-xs sm:text-sm shadow-lg ring-2 ring-purple-500/20">
              {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            {user?.firstName && (
              <span className="text-white font-medium hidden sm:inline max-w-[100px] truncate text-sm">
                {user.firstName}
              </span>
            )}
            <ChevronDown className={`text-gray-400 w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && user && (
            <div className="absolute right-0 mt-2 w-64 bg-[#1f1f35]/95 border border-[#3a3a50] rounded-lg z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 shadow-[0_0_30px_rgba(124,58,237,0.3)] backdrop-blur-md">
              <div className="px-4 py-3 border-b border-[#2a2a40] bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10">
                <p className="text-sm font-medium text-white">
                  {user.firstName} {user.lastName || ''}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>

              {/* Profile */}
              <div className="py-1">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-[#252540] hover:text-white transition-colors duration-150 flex items-center group"
                >
                  <User className="w-4 h-4 mr-3 text-orange-400 group-hover:text-purple-400 transition-colors" />
                  Profile
                </button>
              </div>

              {/* Sign Out */}
              <div className="py-1 border-t border-[#2a2a40]">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150 flex items-center group"
                >
                  <LogOut className="w-4 h-4 mr-3 group-hover:scale-105 transition-transform" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
