import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Youtube, 
  FileText, 
  Plus, 
  X, 
  AlertCircle, 
  BookOpen, 
  ExternalLink,
  Search,
  Calendar,
  User,
  CheckCircle2,
  Sparkles,
  UploadCloud,
  Pencil,
  Trash2
} from 'lucide-react';

import { userAtom } from '../atoms/userAtom';
import { subjectAtom } from '../atoms/subjectAtom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import InteractiveBackground from '../components/InteractiveBackground';

// Helper to validate IDs before API calls
const isValidId = (val) => typeof val === 'string' && val.trim().length > 0;

// Main Page Component
const ResourcePage = () => {
    const user = useRecoilValue(userAtom);
    const subjectId = useRecoilValue(subjectAtom);
    const setSubject = useSetRecoilState(subjectAtom); // Hook to set state

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('Yt-Link');
    
    // Modal and Form State
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [resourceToEdit, setResourceToEdit] = useState(null);
    const [resourceToDelete, setResourceToDelete] = useState(null);
    const [newResource, setNewResource] = useState({ title: '', link: '', file: null });
    const [searchTerm, setSearchTerm] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    // --- LOGIC & DATA FETCHING ---

    // Restore subjectId from localStorage on initial load
    useEffect(() => {
        if (!isValidId(subjectId)) {
            const savedSubjectId = localStorage.getItem('subjectId');
            if (isValidId(savedSubjectId)) {
                setSubject(savedSubjectId);
            }
        }
    }, [subjectId, setSubject]);

    // Defer initial fetch to allow Recoil to hydrate
    useEffect(() => {
        const timerId = setTimeout(() => {
            fetchResources();
        }, 0);
        return () => clearTimeout(timerId);
    }, [user?.classId, subjectId]);

    const fetchResources = async () => {
        // Strict guard clause before fetching
        if (!isValidId(user?.classId) || !isValidId(subjectId)) {
            setLoading(false);
            setError("No subject selected. Please choose a subject first.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:3000/api/v1/resource/${user.classId}/${subjectId}`, { headers: { authorization: `Bearer ${token}` } });
            setResources(res.data.resources || []);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to fetch resources.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };
    
    const ensureIdsAreValid = () => {
        if (!isValidId(user?.classId) || !isValidId(subjectId)) {
            toast.error('Subject not selected or invalid. Please go back and select a subject.');
            return false;
        }
        return true;
    };

    const validateForm = () => {
        const errors = {};
        if (!newResource.title.trim() || newResource.title.length < 3) errors.title = 'Title must be at least 3 characters.';
        const resourceType = resourceToEdit ? resourceToEdit.type : activeTab;
        if (resourceType === 'Yt-Link') {
            if (!newResource.link.trim()) errors.link = 'Link is required.';
            else if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(newResource.link)) errors.link = 'Please enter a valid YouTube URL.';
        } else {
            if (!resourceToEdit && !newResource.file) errors.file = 'A file is required for new documents.';
            if (newResource.file && newResource.file.size > 15 * 1024 * 1024) errors.file = 'File size cannot exceed 15MB.';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ensureIdsAreValid() || !validateForm()) {
            toast.error('Please fix the errors before submitting.');
            return;
        }
        
        const token = localStorage.getItem('token');
        const toastId = toast.loading(`${resourceToEdit ? 'Updating' : 'Adding'} resource...`);
        const resourceType = resourceToEdit ? resourceToEdit.type : activeTab;

        try {
            const headers = { authorization: `Bearer ${token}` };
            
            if (resourceToEdit) { // --- UPDATE LOGIC ---
                const url = `http://localhost:3000/api/v1/resource/${subjectId}/${user.classId}/${resourceToEdit._id}`;
                if (resourceType === 'Yt-Link') {
                    await axios.put(url, { title: newResource.title, link: newResource.link }, { headers });
                } else {
                    const formData = new FormData();
                    formData.append('title', newResource.title);
                    if (newResource.file) formData.append('file', newResource.file);
                    headers['Content-Type'] = 'multipart/form-data';
                    await axios.put(url, formData, { headers });
                }
            } else { // --- ADD LOGIC ---
                if (resourceType === 'Yt-Link') {
                    await axios.post(`http://localhost:3000/api/v1/resource/${user.classId}/${subjectId}`, { title: newResource.title, link: newResource.link }, { headers });
                } else {
                    const formData = new FormData();
                    formData.append('title', newResource.title);
                    formData.append('file', newResource.file);
                    headers['Content-Type'] = 'multipart/form-data';
                    await axios.post(`http://localhost:3000/api/v1/resource/upload/${user.classId}/${subjectId}`, formData, { headers });
                }
            }
            toast.success(`Resource ${resourceToEdit ? 'updated' : 'added'}!`, { id: toastId });
            closeFormModal();
            fetchResources();
        } catch (err) {
            const errorMessage = err.response?.data?.message || `Failed to save resource.`;
            toast.error(errorMessage, { id: toastId });
        }
    };
    
    const handleDeleteResource = async () => {
        if (!ensureIdsAreValid() || !resourceToDelete) return;

        const token = localStorage.getItem('token');
        const toastId = toast.loading('Deleting resource...');
        try {
            await axios.delete(`http://localhost:3000/api/v1/resource/${user.classId}/${subjectId}/${resourceToDelete._id}`, { headers: { authorization: `Bearer ${token}` } });
            toast.success('Resource deleted!', { id: toastId });
            closeDeleteModal();
            fetchResources();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete resource.', { id: toastId });
        }
    };

    // --- Modal & Form State Helpers ---
    const openFormModal = (resource = null) => {
        if (resource) {
            setResourceToEdit(resource);
            setNewResource({ title: resource.title, link: resource.link || '', file: null });
        } else {
            setResourceToEdit(null);
            setNewResource({ title: '', link: '', file: null });
        }
        setIsFormModalOpen(true);
    };
    const closeFormModal = () => { setIsFormModalOpen(false); setValidationErrors({}); setResourceToEdit(null); };
    const openDeleteModal = (resource) => setResourceToDelete(resource);
    const closeDeleteModal = () => setResourceToDelete(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewResource({ ...newResource, [name]: value });
        if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) { setNewResource(prev => ({ ...prev, file })); if (validationErrors.file) setValidationErrors(prev => ({ ...prev, file: '' })); }
    };
    
    // --- DERIVED STATE FOR RENDERING ---
    const ytLinks = resources.filter((r) => r.type === 'Yt-Link');
    const documents = resources.filter((r) => r.type === 'Document');
    const filterResources = (list) => {
        if (!searchTerm) return list;
        return list.filter(resource => resource.title.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    if (loading) return <Loader />;

    // Render a user-friendly empty state if IDs are invalid
    if (!isValidId(user?.classId) || !isValidId(subjectId)) {
        return (
            <div className="min-h-screen w-full relative bg-gradient-to-br from-[#0a0a0f] via-[#141423] to-[#1a1a2e]">
                <div className="absolute inset-0 -z-10"><InteractiveBackground /></div>
                <Navbar />
                <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)]">
                    <div className="text-center p-8">
                        <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-3">Subject Not Selected</h2>
                        <p className="text-gray-400 mb-8 max-w-md">Please go back to the Subjects page and select a subject to view its resources.</p>
                        <motion.button onClick={() => window.location.assign('/subjects')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Go to Subjects
                        </motion.button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full relative bg-gradient-to-br from-[#0a0a0f] via-[#141423] to-[#1a1a2e]">
            <div className="absolute inset-0 -z-10"><InteractiveBackground /></div>
            <Navbar />
            <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <div className="space-y-3">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent leading-tight">Resources</h1>
                            <p className="text-lg text-gray-400 max-w-md">Access study materials, videos, and documents for your subjects.</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
                                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /><span>{resources.length} Total Resources</span></div>
                                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /><span>Updated Daily</span></div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative">
                                <Search className="absolute left-4 z-10 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-200 w-full sm:w-64" />
                            </div>
                            {user?.role === 'admin' && (
                                <motion.button onClick={() => openFormModal()} className="group relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 whitespace-nowrap" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />Add Resource
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                    
                    {/* Tabs */}
                    <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                        <div className="flex border-b border-white/10 bg-black/20 backdrop-blur-sm rounded-t-xl overflow-hidden">
                            {[{ key: 'Yt-Link', label: 'YouTube Links', icon: Youtube, count: ytLinks.length }, { key: 'Document', label: 'Documents', icon: FileText, count: documents.length }].map((tab) => (
                                <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 sm:px-6 py-4 font-semibold transition-colors duration-300 relative group flex-1 sm:flex-none ${activeTab === tab.key ? 'text-white' : 'text-gray-400 hover:text-white'} flex items-center justify-center gap-3`} whileTap={{ scale: 0.98 }}>
                                    <tab.icon size={18} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.key ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-500/20 text-gray-400'}`}>{tab.count}</span>
                                    {activeTab === tab.key && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400" layoutId="activeTab" />}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {error && !loading && (
                        <motion.div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-400 mb-8 backdrop-blur-sm" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                            <AlertCircle className="inline-block mr-2 w-5 h-5" /> {error}
                            <button onClick={fetchResources} className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-200">Try Again</button>
                        </motion.div>
                    )}
                    
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                            {activeTab === 'Yt-Link' ? <ResourceList list={filterResources(ytLinks)} type="YouTube Link" openModal={openFormModal} isAdmin={user?.role === 'admin'} onEdit={openFormModal} onDelete={openDeleteModal} /> : <ResourceList list={filterResources(documents)} type="Document" openModal={openFormModal} isAdmin={user?.role === 'admin'} onEdit={openFormModal} onDelete={openDeleteModal} />}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </main>
            
            <AnimatePresence>
                {isFormModalOpen && (
                    <FormModal isOpen={isFormModalOpen} onClose={closeFormModal} onSubmit={handleSubmit} resourceToEdit={resourceToEdit} activeTab={activeTab} newResource={newResource} validationErrors={validationErrors} onFieldChange={handleChange} onFileChange={handleFileChange} />
                )}
                {resourceToDelete && (
                    <DeleteConfirmationModal resource={resourceToDelete} onClose={closeDeleteModal} onConfirm={handleDeleteResource} />
                )}
            </AnimatePresence>
            <Footer />
        </div>
    );
};

// --- CHILD COMPONENTS ---

const ResourceList = ({ list, type, openModal, isAdmin, onEdit, onDelete }) => {
    if (list.length === 0) {
        return ( <motion.div className="text-center py-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}> <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-12 max-w-lg mx-auto border border-white/10"> <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="mx-auto w-fit"> <BookOpen size={64} className="text-gray-500 mb-6" /> </motion.div> <h3 className="text-2xl font-semibold text-gray-300 mb-3">No {type}s Found</h3> <p className="text-gray-400 mb-6">{!isAdmin ? "Check back later for new materials." : "Be the first to contribute to this subject!"}</p> {isAdmin && ( <motion.button onClick={() => openModal()} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}> Add First Resource </motion.button> )} </div> </motion.div> );
    }

    return (
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-white/10 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                <div className="col-span-6">Title</div>
                <div className="col-span-2 text-center">Date Added</div>
                <div className="col-span-2 text-center">Author</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>
            <motion.div layout>
                <AnimatePresence>
                    {list.map((resource) => <ResourceRow key={resource._id} resource={resource} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />)}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

const ResourceRow = ({ resource, isAdmin, onEdit, onDelete }) => {
    const getIcon = (type) => type === 'Yt-Link' ? <Youtube size={20}/> : <FileText size={20}/>;
    const getColor = (type) => type === 'Yt-Link' ? 'text-red-400' : 'text-cyan-400';
    const authorName = resource.author?.firstName || resource.createdBy || 'Admin';

    // Helper to modify the Cloudinary URL to force inline viewing
    const getInlineUrl = (originalUrl) => {
        if (!originalUrl || resource.type !== 'Document' || !originalUrl.includes('/upload/')) {
            return originalUrl;
        }
        // Insert 'fl_inline' flag right after '/upload/' to force viewing
        return originalUrl.replace('/upload/', '/upload/fl_inline/');
    };

    const viewableUrl = getInlineUrl(resource.link);

    return (
        <motion.a 
            layout 
            href={viewableUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-white/5 transition-colors duration-300 relative" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            transition={{ type: 'spring' }}
        >
            <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-pink-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300"/>
            <div className="col-span-12 md:col-span-6 flex items-center gap-4 overflow-hidden">
                <div className={`flex-shrink-0 p-3 rounded-lg bg-black/30 ${getColor(resource.type)}`}>{getIcon(resource.type)}</div>
                <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{resource.title}</p>
                    <div className="md:hidden flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <div className="flex items-center gap-1.5"><Calendar size={12} /><span>{new Date(resource.createdAt).toLocaleDateString()}</span></div>
                        <div className="flex items-center gap-1.5"><User size={12} /><span>{authorName}</span></div>
                    </div>
                </div>
            </div>
            <div className="hidden md:col-span-2 md:flex items-center justify-center text-gray-400 text-sm"><span>{new Date(resource.createdAt).toLocaleDateString()}</span></div>
            <div className="hidden md:col-span-2 md:flex items-center justify-center text-gray-400 text-sm"><span>{authorName}</span></div>
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
                {isAdmin && (
                    <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(resource); }} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 rounded-full transition-all" aria-label="Edit"><Pencil size={16} /></button>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(resource); }} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-full transition-all" aria-label="Delete"><Trash2 size={16} /></button>
                    </div>
                )}
                <ExternalLink size={18} className="text-gray-400 group-hover:text-white transition-colors"/>
            </div>
        </motion.a>
    );
};

const FormModal = ({ isOpen, onClose, onSubmit, resourceToEdit, activeTab, newResource, validationErrors, onFieldChange, onFileChange }) => (
    <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full border border-white/10 overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
            <div className="p-8 border-b border-white/10 relative">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{resourceToEdit ? 'Update Resource' : `Add New ${activeTab === 'Yt-Link' ? 'YouTube Link' : 'Document'}`}</h2>
                <motion.button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}><X size={24} /></motion.button>
            </div>
            <form onSubmit={onSubmit} className="p-8 space-y-6">
                <InputField icon={BookOpen} label="Resource Title" name="title" value={newResource.title} onChange={onFieldChange} error={validationErrors.title} placeholder="e.g., Intro to React Hooks" required />
                {(resourceToEdit?.type || activeTab) === 'Yt-Link' ? (
                    <InputField icon={Youtube} label="YouTube Link" name="link" value={newResource.link} onChange={onFieldChange} error={validationErrors.link} placeholder="https://youtube.com/watch?v=..." required />
                ) : (
                    <FileInput file={newResource.file} onChange={onFileChange} error={validationErrors.file} existingFileName={resourceToEdit?.title} />
                )}
                <div className="flex gap-4 pt-4">
                    <motion.button type="button" onClick={onClose} className="flex-1 py-3 text-gray-300 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
                    <motion.button type="submit" className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {resourceToEdit ? 'Update Resource' : 'Add Resource'}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    </motion.div>
);

const DeleteConfirmationModal = ({ resource, onClose, onConfirm }) => (
    <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-white/10 p-8" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
                <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Delete Resource</h3>
                <p className="text-gray-400 mb-6">Are you sure you want to delete "<span className="font-semibold text-gray-300">{resource.title}</span>"? This action is permanent.</p>
            </div>
            <div className="flex gap-4">
                <motion.button onClick={onClose} className="flex-1 py-3 text-gray-300 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
                <motion.button onClick={onConfirm} className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2 group" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Trash2 className="w-5 h-5" />Confirm Delete
                </motion.button>
            </div>
        </motion.div>
    </motion.div>
);

const InputField = ({ icon: Icon, label, name, error, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />}
            <input name={name} id={name} className={`w-full pl-12 pr-4 py-3 bg-black/30 border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:ring-purple-500/50'}`} {...props} />
        </div>
        <AnimatePresence>
            {error && <motion.p className="text-red-400 text-xs mt-1.5 flex items-center gap-1" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}> <AlertCircle size={14} />{error} </motion.p>}
        </AnimatePresence>
    </div>
);

const FileInput = ({ file, onChange, error, existingFileName }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Document File</label>
        <label htmlFor="file" className={`w-full flex flex-col items-center justify-center p-6 bg-black/30 border-2 rounded-xl cursor-pointer transition-all ${error ? 'border-red-500/50' : 'border-dashed border-white/20 hover:border-purple-500/50'}`}>
            <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
            <span className="font-semibold text-center text-white">{file ? file.name : (existingFileName ? `Update file for: "${existingFileName}"` : 'Click to upload a file')}</span>
            <span className="text-xs text-gray-500">{file ? `(${(file.size / 1024 / 1024).toFixed(2)} MB)` : (existingFileName ? "Leave empty to keep existing file" : 'PDF, DOCX, etc. (Max 15MB)')}</span>
        </label>
        <input type="file" id="file" name="file" onChange={onChange} className="hidden" />
        <AnimatePresence>
            {error && <motion.p className="text-red-400 text-xs mt-1.5 flex items-center gap-1" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}> <AlertCircle size={14} />{error} </motion.p>}
        </AnimatePresence>
    </div>
);

export default ResourcePage;
