import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { InputField } from './InputField';
import { ActionButton } from './ActionButton';

export const ActionModal = ({ isOpen, onClose, config, classId, onSuccess }) => {
    const { mode, subject } = config;
    const [formData, setFormData] = useState({ title: '', subjectTeacher: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: mode === 'edit' ? subject?.title || '' : '',
                subjectTeacher: mode === 'edit' ? subject?.subjectTeacher || '' : ''
            });
            setErrors({});
            setIsLoading(false);
            setIsSuccess(false);
        }
    }, [isOpen, mode, subject]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required.';
        if (!formData.subjectTeacher.trim()) newErrors.subjectTeacher = 'Teacher name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return toast.error('Please fill all required fields.');
        
        const token = localStorage.getItem('token');
        const url = mode === 'add'
            ? `http://localhost:3000/api/v1/subject/create-subject/${classId}`
            : `http://localhost:3000/api/v1/subject/update-subject/${classId}/${subject._id}`;
        const method = mode === 'add' ? 'post' : 'put';

        setIsLoading(true);
        try {
            await axios[method](url, formData, { headers: { authorization: `Bearer ${token}` } });
            toast.success(`Subject ${mode === 'add' ? 'added' : 'updated'} successfully!`);
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed.');
        } finally {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        const url = `http://localhost:3000/api/v1/subject/delete-subject/${classId}/${subject._id}`;
        setIsLoading(true);
        try {
            await axios.delete(url, { headers: { authorization: `Bearer ${token}` } });
            toast.success('Subject deleted successfully!');
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed.');
        } finally {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    const renderContent = () => {
        if (mode === 'delete') {
            return (
                <div className="text-center space-y-4">
                    <Trash2 className="mx-auto text-red-500" size={48} />
                    <h3 className="text-xl font-semibold text-white">Delete Subject?</h3>
                    <p className="text-gray-400">Are you sure you want to delete "{subject?.title}"? This action cannot be undone.</p>
                    <div className="flex gap-4 pt-4">
                        <ActionButton variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</ActionButton>
                        <ActionButton variant="danger" onClick={handleDelete} isLoading={isLoading} isSuccess={isSuccess}>Delete</ActionButton>
                    </div>
                </div>
            );
        }
        return (
            <form onSubmit={handleFormSubmit} className="space-y-6">
                <InputField label="Subject Title" name="title" value={formData.title} onChange={handleChange} error={errors.title} />
                <InputField label="Subject Teacher" name="subjectTeacher" value={formData.subjectTeacher} onChange={handleChange} error={errors.subjectTeacher} />
                <div className="flex gap-4 pt-4">
                    <ActionButton variant="secondary" onClick={onClose} disabled={isLoading}>Cancel</ActionButton>
                    <ActionButton type="submit" isLoading={isLoading} isSuccess={isSuccess}>
                        {mode === 'add' ? 'Add Subject' : 'Save Changes'}
                    </ActionButton>
                </div>
            </form>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <motion.div
                        className="bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] rounded-2xl shadow-2xl max-w-md w-full border border-white/10"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">
                                {mode === 'add' && 'Add New Subject'}
                                {mode === 'edit' && 'Edit Subject'}
                                {mode === 'delete' && 'Confirm Deletion'}
                            </h2>
                            <motion.button onClick={onClose} whileHover={{ scale: 1.1, rotate: 90 }}>
                                <X className="text-gray-400" />
                            </motion.button>
                        </div>
                        <div className="p-6">{renderContent()}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
