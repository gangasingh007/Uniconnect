import React from 'react';
import { AlertCircle } from 'lucide-react';

export const InputField = ({ label, name, error, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            id={name}
            name={name}
            className={`w-full px-4 py-2.5 bg-black/30 border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
            {...props}
        />
        {error && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={14} />{error}</p>}
    </div>
);
