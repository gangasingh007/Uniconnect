import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
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
  ArrowRight,
  Sparkles,
  UploadCloud
} from 'lucide-react';

import { userAtom } from '../atoms/userAtom';
import { subjectAtom } from '../atoms/subjectAtom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import InteractiveBackground from '../components/InteractiveBackground';

const ResourcePage = () => {
  const user = useRecoilValue(userAtom);
  const subjectId = useRecoilValue(subjectAtom);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Yt-Link');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', link: '', file: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newResource.title.trim() || newResource.title.length < 3) {
      errors.title = 'Title must be at least 3 characters.';
    }

    if (activeTab === 'Yt-Link') {
      if (!newResource.link.trim()) errors.link = 'Link is required.';
      else if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(newResource.link)) {
        errors.link = 'Please enter a valid YouTube URL.';
      }
    } else {
      if (!newResource.file) errors.file = 'A file is required.';
      else if (newResource.file.size > 10 * 1024 * 1024) errors.file = 'File size cannot exceed 10MB.';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchResources = async () => {
    if (!user?.classId || !subjectId) {
      setLoading(false);
      setError("No subject selected. Please go back and choose a subject.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/v1/resource/${user.classId}/${subjectId}`, { headers: { authorization: `Bearer ${token}` } });
      setResources(res.data.resources || []);
    } catch (err) {
      setError('Failed to fetch resources.');
      toast.error('Failed to fetch resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [user?.classId, subjectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the validation errors.');
      return;
    }

    const token = localStorage.getItem('token');
    const toastId = toast.loading(`Adding ${activeTab === 'Yt-Link' ? 'link' : 'document'}...`);

    try {
      if (activeTab === 'Yt-Link') {
        await axios.post(
          `http://localhost:3000/api/v1/resource/${user.classId}/${subjectId}`,
          { title: newResource.title, link: newResource.link },
          { headers: { authorization: `Bearer ${token}` } }
        );
      } else {
        const formData = new FormData();
        formData.append('title', newResource.title);
        formData.append('file', newResource.file);
        await axios.post(
          `http://localhost:3000/api/v1/resource/upload/${user.classId}/${subjectId}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data', 'authorization': `Bearer ${token}` }}
        );
      }
      
      toast.success('Resource added successfully!', { id: toastId });
      closeModal();
      fetchResources();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add resource.';
      toast.error(errorMessage, { id: toastId });
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setValidationErrors({});
    setNewResource({ title: '', link: '', file: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewResource(prev => ({ ...prev, file: file }));
      if (validationErrors.file) setValidationErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const ytLinks = resources.filter((r) => r.type === 'Yt-Link');
  const documents = resources.filter((r) => r.type === 'Document');

  const filterResources = (list) => {
    if (!searchTerm) return list;
    return list.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.link && resource.link.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };
  
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen w-full relative ">
        <div className="absolute inset-0 -z-10"></div>
        <Navbar />
        <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="space-y-3">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent leading-tight">Resources</h1>
                        <p className="text-lg text-gray-400 max-w-md">Access study materials, videos, and documents for your subjects</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 pt-2">
                            <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /><span>{resources.length} Total Resources</span></div>
                            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /><span>Updated Daily</span></div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative">
                            <Search className="z-10 absolute left-4 top-1/2 transform -translate-y-1/2  w-5 h-5" />
                            <input type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-200 w-full sm:w-64" />
                        </div>
                        {user?.role === 'admin' && (
                            <motion.button onClick={openModal} className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 whitespace-nowrap" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />Add Resource
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                    <div className="flex border-b border-white/10 bg-black/20 backdrop-blur-sm rounded-t-xl overflow-hidden">
                        {[
                            { key: 'Yt-Link', label: 'YouTube Links', icon: Youtube, count: ytLinks.length },
                            { key: 'Document', label: 'Documents', icon: FileText, count: documents.length }
                        ].map((tab) => (
                            <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 sm:px-6 py-4 font-semibold transition-colors duration-300 relative group flex-1 sm:flex-none ${activeTab === tab.key ? 'text-white' : 'text-gray-400 hover:text-white' } flex items-center justify-center gap-3`} whileTap={{ scale: 0.98 }}>
                                <tab.icon size={18} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.key ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-500/20 text-gray-400'}`}>{tab.count}</span>
                                {activeTab === tab.key && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400" layoutId="activeTab" />}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {error && <motion.div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-400 mb-8 backdrop-blur-sm" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}> <AlertCircle className="inline-block mr-2 w-5 h-5" /> {error} <button onClick={fetchResources} className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-200">Try Again</button></motion.div>}

                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                        {activeTab === 'Yt-Link' ? <ResourceGrid list={filterResources(ytLinks)} type="YouTube Link" openModal={openModal} isAdmin={user?.role === 'admin'} /> : <ResourceGrid list={filterResources(documents)} type="Document" openModal={openModal} isAdmin={user?.role === 'admin'} />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </main>

        {/* Modal */}
        <AnimatePresence>
            {isModalOpen && (
                <motion.div className="fixed inset-0  flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
                    <motion.div className="bg-black/90 backdrop-blur-sm rounded-3xl shadow-2xl max-w-lg w-full border border-white/10 overflow-hidden" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                        <div className="p-8 border-b border-white/10 relative">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Add New {activeTab === 'Yt-Link' ? 'YouTube Link' : 'Document'}</h2>
                            <motion.button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                                <X size={24} />
                            </motion.button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <InputField icon={BookOpen} label="Resource Title" name="title" value={newResource.title} onChange={handleChange} error={validationErrors.title} placeholder="e.g., Intro to React Hooks" required />
                            {activeTab === 'Yt-Link' ? (
                                <InputField icon={Youtube} label="YouTube Link" name="link" value={newResource.link} onChange={handleChange} error={validationErrors.link} placeholder="https://youtube.com/watch?v=..." required />
                            ) : (
                                <FileInput file={newResource.file} onChange={handleFileChange} error={validationErrors.file} />
                            )}
                            <div className="flex gap-4 pt-4">
                                <motion.button type="button" onClick={closeModal} className="flex-1 py-3 text-gray-300 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
                                <motion.button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2 group" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />Add Resource
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        <Footer />
    </div>
  );
};

const ResourceGrid = ({ list, type, openModal, isAdmin }) => {
    if (list.length === 0) {
        return (
            <motion.div className="text-center py-20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-12 max-w-lg mx-auto border border-white/10">
                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="mx-auto w-fit">
                        <BookOpen size={64} className="text-gray-500 mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold text-gray-300 mb-3">No {type}s Found</h3>
                    <p className="text-gray-400 mb-6">{!isAdmin ? "Check back later for new materials." : "Be the first to contribute to this subject!"}</p>
                    {isAdmin && (
                        <motion.button onClick={openModal} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Add First Resource
                        </motion.button>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((resource, index) => <ResourceCard key={resource._id} resource={resource} index={index} />)}
        </div>
    );
};

const ResourceCard = ({ resource, index }) => {
    const getIcon = (type) => type === 'Yt-Link' ? <Youtube size={24}/> : <FileText size={24}/>;
    const getColor = (type) => type === 'Yt-Link' ? 'from-red-500 to-pink-500' : 'from-blue-500 to-purple-500';

    return (
        <motion.a
            href={resource.link} target="_blank" rel="noopener noreferrer"
            className="group relative bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -8 }}
        >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${getColor(resource.type)} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${getColor(resource.type)}/20 text-white`}>{getIcon(resource.type)}</div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2 h-14">{resource.title}</h3>
                <p className="text-sm text-gray-400 truncate mb-4">{resource.link}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /><span>{new Date(resource.createdAt).toLocaleDateString()}</span></div>
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /><span>{resource.author?.firstName || 'Admin'}</span></div>
                </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </motion.a>
    );
};

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

const FileInput = ({ file, onChange, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Document File *</label>
        <label htmlFor="file" className={`w-full flex flex-col items-center justify-center p-6 bg-black/30 border-2 rounded-xl cursor-pointer transition-all ${error ? 'border-red-500/50' : 'border-dashed border-white/20 hover:border-purple-500/50'}`}>
            <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
            <span className="font-semibold text-white">{file ? file.name : 'Click to upload a file'}</span>
            <span className="text-xs text-gray-500">{file ? `(${(file.size / 1024 / 1024).toFixed(2)} MB)` : 'PDF, DOCX, etc. (Max 10MB)'}</span>
        </label>
        <input type="file" id="file" name="file" onChange={onChange} className="hidden" />
        <AnimatePresence>
            {error && <motion.p className="text-red-400 text-xs mt-1.5 flex items-center gap-1" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}> <AlertCircle size={14} />{error} </motion.p>}
        </AnimatePresence>
    </div>
);

export default ResourcePage;
