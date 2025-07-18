import React, { useEffect, useState, useRef } from 'react';
import { LogOut, User } from 'lucide-react';
import { loadingAtom } from '../atoms/states.atom';
import { useRecoilState } from 'recoil';
import axios from 'axios';

const Navbar = () => {
    const [loading, setloading] = useRecoilState(loadingAtom);
    const [user, setuser] = useState({});
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchUser = async () => {
            setloading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get("http://localhost:3000/api/v1/auth/student/me", {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                const student = res.data.user;
                setuser(student);
                console.log(student);
            } catch (error) {
                setuser({});
            } finally {
                setloading(false);
            }
        };
        fetchUser();
    }, [user]);

    return (
        <nav className="w-full px-6 py-3 flex items-center justify-between bg-[#0f0f12] shadow-md">
            {/* Left: Logo */}
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                UniConnect
            </div>

            {/* Right: Profile + Logout */}
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full bg-[#1f1f24] hover:bg-[#2a2a30] transition">
                    <User className="text-purple-400 w-5 h-5" />
                </button>
                {user.firstName && (
                    <span className="text-white font-medium">{user.firstName}</span>
                )}
                <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg shadow hover:from-purple-700 hover:to-blue-600 transition">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
