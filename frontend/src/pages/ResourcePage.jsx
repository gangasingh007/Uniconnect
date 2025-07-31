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

  // ✅ Function to fix Cloudinary URLs to open inline instead of download
  const formatResourceLink = (link) => {
    if (link.includes('/image/upload/')) {
      return link.replace('/image/upload/', '/raw/upload/fl_inline/');
    }
    return link;
  };

  const validateForm = () => {
    const errors = {};
    if (!newResource.title.trim() || newResource.title.length < 3) {
      errors.title = 'Title must be at least 3 characters.';
    }

    if (activeTab === 'Yt-Link') {
      if (!newResource.link.trim()) {
        errors.link = 'Link is required.';
      } else if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(newResource.link)) {
        errors.link = 'Please enter a valid YouTube URL.';
      }
    } else { // Document tab
      if (!newResource.file) {
        errors.file = 'A file is required.';
      } else if (newResource.file.size > 10 * 1024 * 1024) { // 10MB limit
        errors.file = 'File size cannot exceed 10MB.';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchResources = async () => {
    if (!user?.classId || !subjectId) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/resource/${user.classId}/${subjectId}`);
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
          { 
            title: newResource.title, 
            link: newResource.link,
            type: 'Yt-Link'
          },
          { headers: { authorization: `Bearer ${token}` } }
        );
      } else {
        const formData = new FormData();
        formData.append('title', newResource.title);
        formData.append('file', newResource.file);
        formData.append('type', 'Document'); // ✅ Fixed type capitalization

        await axios.post(
          `http://localhost:3000/api/v1/resource/upload/${user.classId}/${subjectId}`,
          formData,
          { 
            headers: { 
              'Content-Type': 'multipart/form-data',
              authorization: `Bearer ${token}`
            }
          }
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
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewResource(prev => ({ ...prev, file: file }));
      if (validationErrors.file) {
        setValidationErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  const ytLinks = resources.filter((r) => r.type === 'Yt-Link');
  const documents = resources.filter((r) => r.type === 'Document'); // ✅ Consistent capitalization

  const filterResources = (list) => {
    if (!searchTerm) return list;
    return list.filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.link.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const getResourceIcon = (type) => {
    switch (type) {
      case 'Yt-Link': return <Youtube className="w-6 h-6" />;
      case 'Document': return <FileText className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  const getResourceColor = (type) => {
    switch (type) {
      case 'Yt-Link': return 'from-red-500 to-pink-500';
      case 'Document': return 'from-blue-500 to-purple-500';
      default: return 'from-purple-500 to-blue-500';
    }
  };

  const renderResources = (list, type) => {
    const filteredList = filterResources(list);
    
    if (filteredList.length === 0) {
      return (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className=" backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen size={64} className="mx-auto mb-6 text-gray-500" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-3">
              No {type}s yet
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'No resources match your search.' : 'Be the first to add a resource!'}
            </p>
            {user?.role === 'admin' && !searchTerm && (
              <motion.button
                onClick={openModal}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add First Resource
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((resource, index) => (
          <motion.div
            key={resource._id}
            className="group relative bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] rounded-2xl border border-[#3a3a50] hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${getResourceColor(resource.type)}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative z-10 p-6">
              <div className="flex items-start justify-between mb-4">
                <motion.div className={`p-3 rounded-xl bg-gradient-to-r ${getResourceColor(resource.type)}/20 text-white group-hover:scale-110 transition-transform duration-300`} whileHover={{ rotate: 5 }}>
                  {getResourceIcon(resource.type)}
                </motion.div>
                <motion.div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" whileHover={{ scale: 1.1 }}>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </motion.div>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">{resource.title}</h3>
                <p className="text-sm text-gray-400 truncate">{resource.link}</p>

                {/* ✅ If it's a document, show preview button */}
                {resource.type === 'Document' && (
                  <a
                    href={formatResourceLink(resource.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mt-2 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" /> Preview Document
                  </a>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-[#3a3a50]">
                  <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>Recently added</span></div>
                  <div className="flex items-center gap-1"><User className="w-3 h-3" /><span>Admin</span></div>
                </div>
              </div>

              {/* ✅ Cloudinary link fixed here */}
              <motion.a href={formatResourceLink(resource.link)} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20" whileTap={{ scale: 0.98 }} />
              
              <motion.div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300" initial={{ y: 10 }} whileInView={{ y:0 }} viewport={{once: true}}>
                <span className="text-sm font-medium text-purple-400">View Resource</span>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen  p-4 sm:p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-7xl mx-auto">
          {/* Header section remains the same */}
          <motion.div
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent leading-tight">Resources</h1>
              <p className="text-lg text-gray-400 max-w-md">Access study materials, videos, and documents for your subjects</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /><span>{resources.length} Resources</span></div>
                <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /><span>Updated Daily</span></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="text" placeholder="Search resources..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-3 bg-[#1f1f35] border border-[#3a3a50] rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-full sm:w-64" />
              </div>
              {user?.role === 'admin' && (
                <motion.button onClick={openModal} className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300 whitespace-nowrap" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />Add Resource
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300"></div>
                </motion.button>
              )}
            </div>
          </motion.div>
          {/* Tabs section remains the same */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="flex border-b border-[#3a3a50] bg-[#1f1f35]/50 rounded-t-2xl backdrop-blur-sm">
              {[
                { key: 'Yt-Link', label: 'YouTube Links', icon: Youtube, count: ytLinks.length },
                { key: 'Document', label: 'Documents', icon: FileText, count: documents.length }
              ].map((tab) => (
                <motion.button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-6 py-4 font-semibold transition-all duration-300 relative group ${activeTab === tab.key ? 'text-purple-400' : 'text-gray-400 hover:text-white'} flex items-center gap-3`} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <tab.icon size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeTab === tab.key ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-500/20 text-gray-400'}`}>{tab.count}</span>
                  {activeTab === tab.key && (<motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400" layoutId="activeTab" transition={{ duration: 0.3 }} />)}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {error && <motion.div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-400 mb-8 backdrop-blur-sm" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}> <AlertCircle className="inline-block mr-2 w-5 h-5" /> {error} <button onClick={fetchResources} className="ml-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors duration-200">Try Again</button></motion.div>}

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              {activeTab === 'Yt-Link' && renderResources(ytLinks, 'YouTube Link')}
              {activeTab === 'Document' && renderResources(documents, 'Document')}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
            <motion.div className="bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-[#3a3a50] overflow-hidden" initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
              <div className="flex justify-between items-center p-8 border-b border-[#3a3a50] relative">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Add New {activeTab === 'Yt-Link' ? 'YouTube Link' : 'Document'}</h2>
                <motion.button onClick={closeModal} className="text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-600/30 transition-all duration-200" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                  <X size={24} />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Resource Title *</label>
                  <input type="text" id="title" name="title" value={newResource.title} onChange={handleChange} className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.title ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`} placeholder="e.g., Intro to React Hooks" required />
                  {validationErrors.title && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.title}</p>}
                </div>
                
                {activeTab === 'Yt-Link' ? (
                  <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-2">YouTube Link *</label>
                    <input type="url" id="link" name="link" value={newResource.link} onChange={handleChange} className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.link ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`} placeholder="https://youtube.com/watch?v=..." required />
                    {validationErrors.link && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.link}</p>}
                  </div>
                ) : (
                  <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">Document File *</label>
                    <label htmlFor="file" className={`w-full flex flex-col items-center justify-center px-4 py-6 bg-[#252540] border-2 ${validationErrors.file ? 'border-red-500' : 'border-dashed border-[#3a3a50]'} rounded-xl text-gray-400 hover:border-purple-500 cursor-pointer transition-all`}>
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <span className="font-semibold">{newResource.file ? newResource.file.name : 'Click to upload a file'}</span>
                      <span className="text-xs">{newResource.file ? `(${(newResource.file.size / 1024 / 1024).toFixed(2)} MB)` : 'PDF, DOCX, etc. (Max 10MB)'}</span>
                    </label>
                    <input type="file" id="file" name="file" onChange={handleFileChange} className="hidden" />
                    {validationErrors.file && <p className="text-red-400 text-xs mt-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1" />{validationErrors.file}</p>}
                  </div>
                )}
                
                <div className="flex gap-4 pt-4">
                  <motion.button type="button" onClick={closeModal} className="flex-1 px-6 py-3 text-gray-300 bg-gray-600/30 hover:bg-gray-600/50 rounded-xl font-semibold transition-all duration-200" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Cancel</motion.button>
                  <motion.button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-2 group" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />Add Resource
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default ResourcePage;
