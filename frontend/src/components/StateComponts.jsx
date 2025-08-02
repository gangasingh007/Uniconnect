import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, AlertCircle } from 'lucide-react';
import { ActionButton } from './ActionButton';

export const LoadingState = () => (
    <div className="text-center py-24">
        <div className="relative inline-flex items-center justify-center w-16 h-16">
            <motion.div 
                className="w-full h-full border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, loop: Infinity, ease: "linear" }}
            />
            <BookOpen className="absolute text-purple-400" />
        </div>
        <p className="text-lg text-gray-400 mt-4">Loading your subjects...</p>
    </div>
);

export const ErrorState = ({ message, onRetry }) => (
    <motion.div
        className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    >
        <AlertCircle className="mx-auto text-red-400 mb-4" size={40} />
        <h3 className="text-xl font-semibold text-white mb-2">An Error Occurred</h3>
        <p className="text-red-300 mb-6">{message}</p>
        <ActionButton variant="danger" onClick={onRetry}>Try Again</ActionButton>
    </motion.div>
);

export const EmptyState = ({ onAddClick, isAdmin }) => (
    <motion.div
        className="text-center py-24 bg-black/20 border border-white/10 rounded-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
    >
        <BookOpen className="mx-auto text-gray-600 mb-4" size={48} />
        <h3 className="text-2xl font-bold text-gray-300">No Subjects Found</h3>
        <p className="text-gray-500 mt-2 mb-6">It looks like there are no subjects available for your class yet.</p>
        {isAdmin && (
            <ActionButton onClick={onAddClick}>Add First Subject</ActionButton>
        )}
    </motion.div>
);
