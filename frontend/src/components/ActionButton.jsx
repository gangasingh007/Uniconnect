import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const ActionButton = ({ isLoading, isSuccess, children, variant = 'primary', ...props }) => {
    const variants = {
        primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-purple-500/20",
        secondary: "bg-white/10 text-gray-300 hover:bg-white/20",
        danger: "bg-red-600 text-white hover:bg-red-700",
        success: "bg-green-500 text-white",
    };
    const currentVariant = isSuccess ? 'success' : variant;

    return (
        <motion.button
            className={`flex-1 px-6 py-2.5 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${variants[currentVariant]}`}
            whileHover={{ scale: (isLoading || isSuccess) ? 1 : 1.03 }}
            whileTap={{ scale: (isLoading || isSuccess) ? 1 : 0.98 }}
            {...props}
        >
            {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white" />
             : isSuccess ? <><CheckCircle2 size={20} className="mr-2" /> Success!</>
             : children
            }
        </motion.button>
    );
};
