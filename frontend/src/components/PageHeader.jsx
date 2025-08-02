import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, GraduationCap } from 'lucide-react';

export const PageHeader = ({ user, subjectCount, onAddClick }) => (
    <motion.div
        className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
    >
        <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent leading-tight mb-2">
                Your Subjects
            </h1>
            <p className="text-lg text-gray-400 max-w-md">
                Browse materials, track progress, and manage your academic courses.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                <div className="flex items-center gap-2"><GraduationCap size={16} /><span>{subjectCount} Subjects</span></div>
                <div className="flex items-center gap-2"><Users size={16} /><span>{user?.courseName} - Sem {user?.semester}</span></div>
            </div>
        </div>
        {user?.role === 'admin' && (
            <motion.button
                onClick={onAddClick}
                className="group fixed bottom-8 right-8 z-40 md:static flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
            >
                <Plus className="group-hover:rotate-90 transition-transform duration-300" size={20} />
                Add Subject
            </motion.button>
        )}
    </motion.div>
);
