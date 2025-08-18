import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, X, BookOpen, AlertCircle, CheckCircle2, Users, GraduationCap, ServerCrash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { subjectAtom } from '../atoms/subjectAtom';
import { useNavigate } from 'react-router-dom';
import InteractiveBackground from '../components/InteractiveBackground';

// --- Custom Hook for API Logic ---
// This hook centralizes all API interactions and related state (data, loading, error).
const useSubjectsAPI = (classId) => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchSubjects = useCallback(async () => {
        if (!classId) return;
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_URL}/api/v1/subject/all-subjects/${classId}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setSubjects(res.data.subjects || []);
        } catch (err) {
            setError('Failed to fetch subjects. Please try again.');
            toast.error('Failed to fetch subjects.');
        } finally {
            setLoading(false);
        }
    }, [classId, token, API_URL]);

    const handleApiCall = async (apiCall, successMsg, errorMsg) => {
        try {
            await apiCall();
            toast.success(successMsg);
            fetchSubjects();
            return true;
        } catch (err) {
            const message = err.response?.data?.message || errorMsg;
            toast.error(message);
            return false;
        }
    };

    const addSubject = (formData) => handleApiCall(
        () => axios.post(`${API_URL}/api/v1/subject/create-subject/${classId}`, formData, { headers: { authorization: `Bearer ${token}` } }),
        'Subject added successfully!',
        'Failed to add subject.'
    );

    const updateSubject = (subjectId, formData) => handleApiCall(
        () => axios.put(`${API_URL}/api/v1/subject/update-subject/${classId}/${subjectId}`, formData, { headers: { authorization: `Bearer ${token}` } }),
        'Subject updated successfully!',
        'Failed to update subject.'
    );

    const deleteSubject = (subjectId) => handleApiCall(
        () => axios.delete(`${API_URL}/api/v1/subject/delete-subject/${classId}/${subjectId}`, { headers: { authorization: `Bearer ${token}` } }),
        'Subject deleted successfully!',
        'Failed to delete subject.'
    );

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    return { subjects, loading, error, fetchSubjects, addSubject, updateSubject, deleteSubject };
};

// --- Main Page Component ---
const SubjectPage = () => {
    const user = useRecoilValue(userAtom);
    const { subjects, loading, error, fetchSubjects, addSubject, updateSubject, deleteSubject } = useSubjectsAPI(user?.classId);
    const [modal, setModal] = useState({ isOpen: false, mode: 'add', subject: null });

    const openModal = (mode, subject = null) => setModal({ isOpen: true, mode, subject });
    const closeModal = () => setModal({ isOpen: false, mode: 'add', subject: null });

    return (
        <>
            <Navbar />
            <div className="min-h-screen relative w-full text-white overflow-hidden">
                <InteractiveBackground />
                <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                        className="max-w-7xl mx-auto"
                    >
                        <PageHeader
                            subjectCount={subjects.length}
                            userInfo={`${user?.courseName || 'N/A'} ${user?.section} Sem ${user?.semester}`}
                            onAddClick={() => openModal('add')}
                            isAdmin={user?.role === 'admin'}
                        />
                        <SubjectGrid
                            subjects={subjects}
                            loading={loading}
                            error={error}
                            onRetry={fetchSubjects}
                            onAddClick={() => openModal('add')}
                            onEdit={(subject) => openModal('edit', subject)}
                            onDelete={(subject) => openModal('delete', subject)}
                            isAdmin={user?.role === 'admin'}
                        />
                    </motion.div>
                </div>
            </div>
            <ActionModal
                modalState={modal}
                onClose={closeModal}
                addSubject={addSubject}
                updateSubject={updateSubject}
                deleteSubject={deleteSubject}
            />
            <Footer />
        </>
    );
};

// --- UI Components ---

const PageHeader = ({ subjectCount, userInfo, onAddClick, isAdmin }) => (
    <motion.div
        className="mb-12"
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
            <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r pb-3 from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                    Subjects
                </h1>
                <p className="text-lg text-gray-400 max-w-md">Manage your academic subjects and course materials.</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><GraduationCap size={16} /><span>{subjectCount} Subjects</span></div>
                    <div className="flex items-center gap-2"><Users size={16} /><span>{userInfo}</span></div>
                </div>
            </div>
            {isAdmin && (
                <motion.button onClick={onAddClick} className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Subject
                </motion.button>
            )}
        </div>
    </motion.div>
);

const SubjectGrid = ({ subjects, loading, error, onRetry, onAddClick, onEdit, onDelete, isAdmin }) => {
    const setSubjectId = useSetRecoilState(subjectAtom);
    const navigate = useNavigate();

    const handleCardClick = (subjectId) => {
        setSubjectId(subjectId);
        navigate('/subjects/resource');
    };

    if (loading && subjects.length === 0) return <LoadingState />;
    if (error) return <ErrorState message={error} onRetry={onRetry} />;
    if (!loading && subjects.length === 0) return <EmptyState onAddClick={onAddClick} isAdmin={isAdmin} />;

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
            {subjects.map((subject) => (
                <SubjectCard key={subject._id} subject={subject} onClick={() => handleCardClick(subject._id)} onEdit={onEdit} onDelete={onDelete} isAdmin={isAdmin} />
            ))}
        </motion.div>
    );
};

const SubjectCard = ({ subject, onClick, onEdit, onDelete, isAdmin }) => (
    <motion.div
        onClick={onClick}
        className="group relative bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-400 p-6 border border-white/10 hover:border-purple-500/50 cursor-pointer overflow-hidden"
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ y: -5, scale: 1.03 }}
    >
        <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out -translate-x-full group-hover:translate-x-full opacity-50" />
        <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                    <BookOpen size={24} />
                </div>
                {isAdmin && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(subject); }} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"><Edit size={18} /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(subject); }} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                )}
            </div>
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{subject.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-1">Teacher: {subject.subjectTeacher}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-500">
                {subject.resources?.length || 0} Resources
            </div>
        </div>
    </motion.div>
);

const ActionModal = ({ modalState, onClose, addSubject, updateSubject, deleteSubject }) => {
    const { isOpen, mode, subject } = modalState;
    const [formData, setFormData] = useState({ title: '', subjectTeacher: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && subject) {
                setFormData({ title: subject.title, subjectTeacher: subject.subjectTeacher });
            } else {
                setFormData({ title: '', subjectTeacher: '' });
            }
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen, mode, subject]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.subjectTeacher.trim()) newErrors.subjectTeacher = 'Teacher name is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        const success = mode === 'add'
            ? await addSubject(formData)
            : await updateSubject(subject._id, formData);
        if (success) onClose();
        setIsSubmitting(false);
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        const success = await deleteSubject(subject._id);
        if (success) onClose();
        setIsSubmitting(false);
    };

    const renderContent = () => {
        if (mode === 'delete') {
            return (
                <div className="text-center space-y-6 p-8">
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center"><Trash2 className="text-red-400" size={32} /></div>
                    <h3 className="text-xl font-bold">Delete Subject</h3>
                    <p className="text-gray-400">Are you sure you want to delete "{subject?.title}"? This cannot be undone.</p>
                    <div className="flex gap-4">
                        <ActionButton fullWidth variant="secondary" onClick={onClose}>Cancel</ActionButton>
                        <ActionButton fullWidth variant="danger" onClick={handleDelete} loading={isSubmitting}>Delete</ActionButton>
                    </div>
                </div>
            );
        }
        return (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <FormInput name="title" label="Subject Title" value={formData.title} onChange={handleChange} error={errors.title} placeholder="e.g., Quantum Physics" />
                <FormInput name="subjectTeacher" label="Subject Teacher" value={formData.subjectTeacher} onChange={handleChange} error={errors.subjectTeacher} placeholder="e.g., Dr. Jane Doe" />
                <div className="flex gap-4 pt-4">
                    <ActionButton fullWidth variant="secondary" type="button" onClick={onClose}>Cancel</ActionButton>
                    <ActionButton fullWidth variant="primary" type="submit" loading={isSubmitting}>{mode === 'add' ? 'Add Subject' : 'Save Changes'}</ActionButton>
                </div>
            </form>
        );
    };
    
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="bg-gray-950/80 rounded-2xl shadow-2xl max-w-md w-full border border-white/10" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}>
                        <div className="flex justify-between items-center p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold">{mode.charAt(0).toUpperCase() + mode.slice(1)} Subject</h2>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10"><X size={20} /></button>
                        </div>
                        {renderContent()}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- Reusable UI Elements ---

const FormInput = ({ label, name, error, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input id={name} name={name} className={`w-full px-4 py-2.5 bg-black/30 border ${error ? 'border-red-500' : 'border-white/10'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all`} {...props} />
        {error && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={14} />{error}</p>}
    </div>
);

const ActionButton = ({ children, loading, variant = 'primary', fullWidth, ...props }) => {
    const baseClasses = "px-6 py-2.5 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg";
    const variantClasses = {
        primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/30",
        secondary: "bg-white/5 text-gray-300 hover:bg-white/10",
        danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-500/30"
    };
    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`} disabled={loading} {...props}>
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/50 border-t-white" /> : children}
        </button>
    );
};

const LoadingState = () => (
    <div className="text-center py-20 flex flex-col items-center gap-4 text-gray-400">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/20 border-t-purple-500" />
        <p>Loading subjects...</p>
    </div>
);

const ErrorState = ({ message, onRetry }) => (
    <div className="text-center py-20 bg-red-900/20 border border-red-500/30 rounded-2xl max-w-md mx-auto p-8">
        <ServerCrash className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
        <p className="text-red-300 mb-6">{message}</p>
        <ActionButton onClick={onRetry} variant="danger">Try Again</ActionButton>
    </div>
);

const EmptyState = ({ onAddClick, isAdmin }) => (
    <div className="text-center flex justify-center flex-col py-20 bg-gray-900/40 border border-white/10 rounded-2xl max-w-md mx-auto p-8">
        <BookOpen size={48} className="text-gray-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">No Subjects Found</h3>
        <p className="text-gray-400 mb-6">It looks like there are no subjects here yet. Get started by adding one!</p>
        {isAdmin && <ActionButton onClick={onAddClick}>Add First Subject</ActionButton>}
    </div>
);

export default SubjectPage;
