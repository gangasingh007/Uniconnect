import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Edit, Trash2 } from 'lucide-react';

export const SubjectCard = ({ subject, index, user, onClick, onEdit, onDelete }) => {
    const cardColors = [
        { border: 'hover:border-purple-500/50', bg: 'bg-purple-500' },
        { border: 'hover:border-blue-500/50', bg: 'bg-blue-500' },
        { border: 'hover:border-cyan-500/50', bg: 'bg-cyan-500' },
        { border: 'hover:border-green-500/50', bg: 'bg-green-500' },
        { border: 'hover:border-pink-500/50', bg: 'bg-pink-500' },
        { border: 'hover:border-orange-500/50', bg: 'bg-orange-500' },
    ];
    const color = cardColors[index % cardColors.length];

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 }
    };

    return (
        <motion.div
            variants={cardVariants}
            onClick={onClick}
            className={`group relative bg-black/20 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-white/10 ${color.border} cursor-pointer overflow-hidden`}
            whileHover={{ y: -5 }}
        >
            <div className={`absolute top-0 left-0 h-1 w-0 bg-gradient-to-r ${color.bg} to-transparent group-hover:w-full transition-all duration-500`} />
            
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl shadow-lg ${color.bg} text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <BookOpen size={24} />
                </div>
                {user?.role === 'admin' && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <IconButton icon={Edit} onClick={onEdit} label="Edit" color="hover:bg-blue-500/20 hover:text-blue-300" />
                        <IconButton icon={Trash2} onClick={onDelete} label="Delete" color="hover:bg-red-500/20 hover:text-red-400" />
                    </div>
                )}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{subject.title}</h3>
            <p className="text-gray-400 text-sm">{subject.subjectTeacher}</p>
        </motion.div>
    );
};

const IconButton = ({ icon: Icon, onClick, label, color }) => (
    <button
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        aria-label={label}
        className={`p-2 rounded-lg transition-all duration-200 ${color}`}
    >
        <Icon size={18} />
    </button>
);
