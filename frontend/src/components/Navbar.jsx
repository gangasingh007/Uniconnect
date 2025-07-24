import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, ChevronDown, BookOpenCheck, CalendarClock, CalendarClockIcon, AlarmClockCheck } from 'lucide-react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import { loadingAtom } from '../atoms/states.atom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const user = useRecoilValue(userAtom);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[#141423] to-[#1a1a2e] border-b border-[#2a2a40] shadow-lg backdrop-blur-sm">
      {/* Left: Logo */}
      <div className="flex items-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          UniConnect
        </div>
      </div>

      {/* Right: Profile Dropdown */}
      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-[#151528] hover:bg-[#1f1f35] border border-[#2a2a40] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm shadow-md">
              {user?.firstName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            {user?.firstName && (
              <span className="text-white font-medium hidden md:inline max-w-[100px] truncate">
                {user.firstName}
              </span>
            )}
            <ChevronDown className={`text-gray-400 w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && user && (
            <div className="absolute right-0 mt-2 w-60 bg-[#1f1f35] border border-[#3a3a50] rounded-lg z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 shadow-[0_0_20px_rgba(124,58,237,0.2)]">
              <div className="px-4 py-3 border-b border-[#2a2a40] bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                <p className="text-sm font-medium text-white">
                  {user.firstName} {user.lastName || ''}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>

              {/* Profile */}
              <div className="py-1">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#252540] hover:text-white transition-colors duration-150 flex items-center group"
                >
                  <User className="w-4 h-4 mr-3 text-orange-400 group-hover:text-purple-400 transition-colors" />
                  Profile
                </button>
              </div>

              {/* View Syllabus */}
              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#252540] hover:text-white transition-colors duration-150 flex items-center group"
                >
                  <BookOpenCheck className="w-4 h-4 mr-3 text-purple-400 group-hover:text-purple-300" />
                  View Syllabus
                </button>
              </div>

              {/* View Datesheet */}
              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#252540] hover:text-white transition-colors duration-150 flex items-center group"
                >
                  <CalendarClock className="w-4 h-4 mr-3 text-blue-400 group-hover:text-blue-300" />
                  View Datesheet
                </button>
              </div>

              <div className="py-1">
                <button
                  className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#252540] hover:text-white transition-colors duration-150 flex items-center group"
                >
                  <AlarmClockCheck className="w-4 h-4 mr-3 text-green-400 group-hover:text-blue-300" />
                  View Time Table
                </button>
              </div>

              {/* Sign Out */}
              <div className="py-1 border-t border-[#2a2a40]">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-150 flex items-center group"
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
