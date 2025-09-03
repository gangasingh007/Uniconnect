import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Youtube, FileText, Plus, X, AlertCircle, BookOpen, ExternalLink,
    Search, Trash2, Pencil, Sparkles, ServerCrash
} from 'lucide-react';

import { userAtom } from '../atoms/userAtom';
import { subjectAtom } from '../atoms/subjectAtom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import InteractiveBackground from '../components/InteractiveBackground';

// --- Utility ---
const isValidMongoId = (id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

// --- Custom Hook for API Logic ---
const useResourcesAPI = (classId, subjectId) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    const fetchResources = useCallback(async () => {
        if (!classId || !subjectId) {
            setError("No subject selected. Please choose a subject first.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_URL}/api/v1/resource/${classId}/${subjectId}`, {
                headers: { authorization: `Bearer ${token}` }
            });
            setResources(res.data.resources || []);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch resources.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [classId, subjectId, token, API_URL]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleApiCall = async (apiCall, successMsg) => {
        try {
            await apiCall();
            toast.success(successMsg);
            fetchResources();
            return true;
        } catch (err) {
            const message = err.response?.data?.message || 'An unexpected error occurred.';
            toast.error(message);
            return false;
        }
    };

    const addResource = (formData, type) => {
        const url = type === 'Yt-Link'
            ? `${API_URL}/api/v1/resource/${classId}/${subjectId}`
            : `${API_URL}/api/v1/resource/${classId}/${subjectId}/document-link`;
        
        return handleApiCall(
            () => axios.post(url, formData, { headers: { authorization: `Bearer ${token}` } }),
            'Resource added successfully!'
        );
    };

    const updateResource = (resourceId, formData) => {
        return handleApiCall(
            () => axios.put(`${API_URL}/api/v1/resource/${subjectId}/${classId}/${resourceId}`, formData, { headers: { authorization: `Bearer ${token}` } }),
            'Resource updated successfully!'
        );
    };

    const deleteResource = (resourceId) => {
        return handleApiCall(
            () => axios.delete(`${API_URL}/api/v1/resource/${classId}/${subjectId}/${resourceId}`, { headers: { authorization: `Bearer ${token}` } }),
            'Resource deleted successfully!'
        );
    };

    return { resources, loading, error, fetchResources, addResource, updateResource, deleteResource };
};

// --- Main Page Component ---
const ResourcePage = () => {
    const navigate = useNavigate();
    const user = useRecoilValue(userAtom);
    const [subjectId, setSubjectId] = useRecoilState(subjectAtom);
    
    // Ensure subjectId is loaded from localStorage if not in atom
    useEffect(() => {
        if (!isValidMongoId(subjectId)) {
            const savedSubjectId = localStorage.getItem('subjectId');
            if (isValidMongoId(savedSubjectId)) {
                setSubjectId(savedSubjectId);
            }
        }
    }, [subjectId, setSubjectId]);
    
    const { resources, loading, error, fetchResources, addResource, updateResource, deleteResource } = useResourcesAPI(user?.classId, subjectId);
    
    const [modal, setModal] = useState({ isOpen: false, mode: 'add', resource: null });
    const [activeTab, setActiveTab] = useState('Yt-Link');
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = (mode, resource = null) => setModal({ isOpen: true, mode, resource });
    const closeModal = () => setModal({ isOpen: false, mode: 'add', resource: null });

    const handleSummarize = (resourceId) => {
        navigate(`/summary?resourceId=${resourceId}&classId=${user.classId}&subjectId=${subjectId}`);
    };

    const filteredResources = useMemo(() => {
        const list = resources.filter(r => r.type === activeTab);
        if (!searchTerm) return list;
        return list.filter(resource => resource.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [resources, activeTab, searchTerm]);

    if (!isValidMongoId(subjectId) || !isValidMongoId(user?.classId)) {
        return (
             <div className="min-h-screen w-full relative bg-gradient-to-br from-[#0a0a0f] via-[#141423] to-[#1a1a2e]">
                 <div className="absolute inset-0 -z-10"><InteractiveBackground /></div>
                 <Navbar />
                 <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)]">
                     <div className="text-center p-8">
                         <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
                         <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">Invalid State</h2>
                         <p className="text-gray-400 mb-8 max-w-md">No subject selected. Please go back and choose a subject first.</p>
                         <motion.button onClick={() => navigate('/subjects')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                             Go to Subjects
                         </motion.button>
                     </div>
                 </main>
                 <Footer />
             </div>
        );
    }

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
                            resourceCount={resources.length}
                            onAddClick={() => openModal('add')}
                            isAdmin={user?.role === 'admin'}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                        <AiFeatureCard />
                        {/* TABS */}
                        <motion.div className="mb-8" variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } } }}>
                            <div className="flex border-b border-white/10 bg-black/20 backdrop-blur-sm rounded-t-xl overflow-hidden">
                                {[{ key: 'Yt-Link', label: 'YouTube Links', icon: Youtube }, { key: 'Document', label: 'Documents', icon: FileText }].map((tab) => {
                                    const count = resources.filter(r => r.type === tab.key).length;
                                    return (
                                        <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 sm:px-6 py-4 font-semibold transition-colors duration-300 relative group flex-1 sm:flex-none ${activeTab === tab.key ? 'text-white' : 'text-gray-400 hover:text-white'} flex items-center justify-center gap-3`} whileTap={{ scale: 0.98 }}>
                                            <tab.icon size={18} /><span className="hidden sm:inline">{tab.label}</span><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.key ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-500/20 text-gray-400'}`}>{count}</span>
                                            {activeTab === tab.key && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400" layoutId="activeTab" />}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </motion.div>
                        
                        <ResourceGrid
                            resources={filteredResources}
                            loading={loading}
                            error={error}
                            onRetry={fetchResources}
                            onAddClick={() => openModal('add')}
                            onEdit={(resource) => openModal('edit', resource)}
                            onDelete={(resource) => openModal('delete', resource)}
                            onSummarize={handleSummarize}
                            isAdmin={user?.role === 'admin'}
                            activeTab={activeTab}
                        />
                    </motion.div>
                </div>
            </div>
            <ActionModal
                modalState={modal}
                onClose={closeModal}
                addResource={addResource}
                updateResource={updateResource}
                deleteResource={deleteResource}
                activeTab={activeTab}
            />
            <Footer />
        </>
    );
};

// --- UI Components ---
const PageHeader = ({ resourceCount, onAddClick, isAdmin, searchTerm, setSearchTerm }) => (
    <motion.div
        className="mb-12"
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
            <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r pb-3 from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                    Resources
                </h1>
                <p className="text-lg text-gray-400 max-w-md">Access study materials, videos, and documents.</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><BookOpen size={16} /><span>{resourceCount} Total Resources</span></div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                    <Search className="absolute left-4 z-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-200 w-full sm:w-64" />
                </div>
                {isAdmin && (
                    <motion.button onClick={onAddClick} className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Resource
                    </motion.button>
                )}
            </div>
        </div>
    </motion.div>
);

const AiFeatureCard = () => ( <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="relative max-w-7xl mx-auto mb-8 p-6 bg-gradient-to-r from-blue-900/30 to-purple-500/30 rounded-2xl border border-blue-400/30 overflow-hidden" > <div className="absolute -top-1/2 -left-1/4 w-full h-[200%] bg-[radial-gradient(circle_at_center,_rgba(128,90,213,0.3),_transparent_40%)] animate-pulse-slow"></div> <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4"> <div className="p-3 bg-white/10 rounded-full"> <Sparkles className="w-8 h-8 text-purple-300" /> </div> <div> <h3 className="text-xl font-bold text-white">AI Summarization Feature is Coming Soon!</h3> <p className="text-blue-200 mt-1">Summarization for the image based and Scanned documents is not avaliable yet</p> </div> </div> </motion.div> );

const ResourceGrid = ({ resources, loading, error, onRetry, onAddClick, onEdit, onDelete, onSummarize, isAdmin, activeTab }) => {
    if (loading && resources.length === 0) return <Loader message='Loading Resources...' />;
    if (error) return <ErrorState message={error} onRetry={onRetry} />;
    if (!loading && resources.length === 0) return <EmptyState onAddClick={onAddClick} isAdmin={isAdmin} type={activeTab} />;

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
            {resources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} onEdit={onEdit} onDelete={onDelete} onSummarize={onSummarize} isAdmin={isAdmin} />
            ))}
        </motion.div>
    );
};

const ResourceCard = ({ resource, onEdit, onDelete, onSummarize, isAdmin }) => {
    const getIcon = (type) => type === 'Yt-Link' ? <Youtube size={24}/> : <FileText size={24}/>;
    const authorName = resource.createdBy || 'Admin';

    return (
        <motion.div
            className="group relative bg-gray-900/40 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-all duration-400 p-6 border border-white/10 hover:border-purple-500/50 overflow-hidden flex flex-col"
            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, scale: 1.03 }}
        >
            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out -translate-x-full group-hover:translate-x-full opacity-50" />
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                         {getIcon(resource.type)}
                    </div>
                     {isAdmin && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <button onClick={(e) => { e.stopPropagation(); onEdit(resource); }} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"><Pencil size={18} /></button>
                             <button onClick={(e) => { e.stopPropagation(); onDelete(resource); }} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                     )}
                </div>
                <div className="flex-grow">
                     <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{resource.title}</h3>
                     <p className="text-sm text-gray-400 line-clamp-1">Added by: {authorName}</p>
                </div>
                 <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         {resource.type === 'Document' && (
                             <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.95}} onClick={(e) => { e.stopPropagation(); onSummarize(resource._id); }} className="p-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded-full" aria-label="Summarize">
                                 <div className="flex justify-center items-center px-2">
                                <div className="flex justify-center items-center px-1"><Sparkles size={16} /></div>
                                 Summarize With AI
                                 </div>
                             </motion.button>
                         )}
                    </div>
                     <a href={resource.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-sm font-semibold text-purple-300 hover:text-white flex items-center gap-2 transition-colors" aria-label="Open Link">
                         Open Link <ExternalLink size={16} />
                     </a>
                 </div>
            </div>
        </motion.div>
    );
};

const ActionModal = ({ modalState, onClose, addResource, updateResource, deleteResource, activeTab }) => {
    const { isOpen, mode, resource } = modalState;
    const [formData, setFormData] = useState({ title: '', link: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && resource) {
                setFormData({ title: resource.title, link: resource.link });
            } else {
                setFormData({ title: '', link: '' });
            }
            setErrors({});
            setIsSubmitting(false);
        }
    }, [isOpen, mode, resource]);
    
    const validate = () => {
        const newErrors = {};
        const resourceType = resource?.type || activeTab;

        if (!formData.title.trim()) newErrors.title = 'Title is required.';
        if (!formData.link.trim()) newErrors.link = 'Link is required.';
        else if (resourceType === 'Yt-Link' && !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(formData.link)) {
            newErrors.link = 'Please enter a valid YouTube URL.';
        } else if (resourceType === 'Document' && !/^https?:\/\//.test(formData.link)) {
            newErrors.link = 'Please enter a valid URL.';
        }
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
            ? await addResource(formData, activeTab)
            : await updateResource(resource._id, formData);
        if (success) onClose();
        setIsSubmitting(false);
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        const success = await deleteResource(resource._id);
        if (success) onClose();
        setIsSubmitting(false);
    };
    
    const renderContent = () => {
        if (mode === 'delete') {
            return (
                <div className="text-center space-y-6 p-8">
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center"><Trash2 className="text-red-400" size={32} /></div>
                    <h3 className="text-xl font-bold">Delete Resource</h3>
                    <p className="text-gray-400">Are you sure you want to delete "{resource?.title}"? This cannot be undone.</p>
                    <div className="flex gap-4">
                        <ActionButton fullWidth variant="secondary" onClick={onClose}>Cancel</ActionButton>
                        <ActionButton fullWidth variant="danger" onClick={handleDelete} loading={isSubmitting}>Delete</ActionButton>
                    </div>
                </div>
            );
        }
        
        const resourceType = resource?.type || activeTab;

        return (
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <FormInput name="title" label="Title" value={formData.title} onChange={handleChange} error={errors.title} placeholder="Resource Title" />
                <FormInput name="link" label="Link" value={formData.link} onChange={handleChange} error={errors.link} placeholder={resourceType === 'Yt-Link' ? 'https://youtube.com/...' : 'https://docs.google.com/...'} />
                <div className="flex gap-4 pt-4">
                    <ActionButton fullWidth variant="secondary" type="button" onClick={onClose}>Cancel</ActionButton>
                    <ActionButton fullWidth variant="primary" type="submit" loading={isSubmitting}>{mode === 'add' ? 'Add Resource' : 'Save Changes'}</ActionButton>
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
                            <h2 className="text-xl font-bold">{mode.charAt(0).toUpperCase() + mode.slice(1)} Resource</h2>
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

const ErrorState = ({ message, onRetry }) => (
    <div className="text-center py-20 bg-red-900/20 border border-red-500/30 rounded-2xl max-w-md mx-auto p-8">
        <ServerCrash className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
        <p className="text-red-300 mb-6">{message}</p>
        <ActionButton onClick={onRetry} variant="danger">Try Again</ActionButton>
    </div>
);

const EmptyState = ({ onAddClick, isAdmin, type }) => (
    <div className="text-center flex justify-center flex-col py-20 bg-gray-900/40 border border-white/10 rounded-2xl max-w-md mx-auto p-8">
        {type === 'Yt-Link' ? <Youtube size={48} className="text-gray-500 mx-auto mb-4" /> : <FileText size={48} className="text-gray-500 mx-auto mb-4" />}
        <h3 className="text-2xl font-bold mb-2">No {type === 'Yt-Link' ? 'Videos' : 'Documents'} Found</h3>
        <p className="text-gray-400 mb-6">It looks like there are no resources here yet. Get started by adding one!</p>
        {isAdmin && <ActionButton onClick={onAddClick}>Add First Resource</ActionButton>}
    </div>
);

export default ResourcePage;