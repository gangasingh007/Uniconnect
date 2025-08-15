import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Folder, BookOpen, Eye, DownloadCloud, ExternalLink, Search, FileText, Youtube, Wind } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import InteractiveBackground from '../components/InteractiveBackground';

// Main Page Component
const ExplorePage = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllResources = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/resource/all`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setAllData(res.data.data || []);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to fetch resources.';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchAllResources();
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  
  const filteredData = useMemo(() => {
    // Ensure allData is an array before filtering
    const validData = Array.isArray(allData) ? allData : [];

    if (!searchTerm) {
        if (validData.length > 0 && validData[0]?.subject?.length > 0) {
            setExpandedItems(prev => {
                const firstClassId = validData[0]._id;
                const subjectIds = validData[0].subject.map(sub => sub._id);
                const newState = { ...prev, [firstClassId]: prev[firstClassId] ?? true };
                subjectIds.forEach(id => {
                    newState[id] = prev[id] ?? true;
                });
                return newState;
            });
        }
        return validData;
    }
    
    

    const lowerCaseSearch = searchTerm.toLowerCase();
    
    // Defensive filtering to prevent crashes
    return validData
      .map(classData => {
        if (!classData || !Array.isArray(classData.subject)) return null; // Guard against invalid class data

        const filteredSubjects = classData.subject
          .map(subject => {
            if (!subject || !Array.isArray(subject.resources)) return null; // Guard against invalid subject data

            const filteredResources = subject.resources.filter(resource =>
              resource?.title?.toLowerCase().includes(lowerCaseSearch)
            );
            return filteredResources.length > 0 ? { ...subject, resources: filteredResources } : null;
          })
          .filter(Boolean); // Remove null subjects

        return filteredSubjects.length > 0 ? { ...classData, subject: filteredSubjects } : null;
      })
      .filter(Boolean);
  }, [allData, searchTerm]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen w-full relative ">
      <div className="absolute inset-0 -z-10"><InteractiveBackground /></div>
      <Navbar />
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl pb-2 sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">Explore Resources</h1>
            <p className="text-lg text-gray-400 mt-2">Discover and access study materials from all classes and subjects.</p>
          </motion.div>          
          <AnimatePresence>
            {filteredData.length > 0 ? (
                <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {filteredData.map((classData) => (
                        // This key access is now safe because we filtered out nulls
                        <ClassAccordion key={classData._id} classData={classData} expandedItems={expandedItems} onToggle={toggleExpand} />
                    ))}
                </motion.div>
            ) : (
                <EmptyState />
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// --- Child Components ---

const ClassAccordion = ({ classData, expandedItems, onToggle }) => {
  const isExpanded = !!expandedItems[classData._id];
  const className = `${classData.courseName} ${classData.section} - Sem ${classData.semester}`;
  const totalResources = classData.subject.reduce((acc, sub) => acc + (sub?.resources?.length || 0), 0);

  return (
    <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50">
      <button onClick={() => onToggle(classData._id)} className="w-full flex justify-between items-center p-5 text-left text-lg font-semibold text-white hover:bg-white/5 transition-colors">
        <span className="flex items-center gap-3"><Folder className="text-cyan-400" /> {className}</span>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-md">{totalResources} items</span>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}><ChevronDown /></motion.div>
        </div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-8 pr-5 pb-3">
            <div className="border-l-2 border-cyan-500/20 pl-6 space-y-2 py-4">
              {classData.subject.map((subjectData) => (
                subjectData && <SubjectAccordion key={subjectData._id} subjectData={subjectData} expandedItems={expandedItems} onToggle={onToggle} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubjectAccordion = ({ subjectData, expandedItems, onToggle }) => {
    const isExpanded = !!expandedItems[subjectData._id];
    // Add optional chaining for safety
    const docCount = subjectData?.resources?.filter(r => r?.type === 'Document').length || 0;
    const ytCount = subjectData?.resources?.filter(r => r?.type === 'Yt-Link').length || 0;
  
    if (!subjectData?.resources?.length) return null;
  
    return (
      <div className="border-l border-purple-500/20 pl-4">
        <button onClick={() => onToggle(subjectData._id)} className="w-full flex justify-between items-center py-2 text-left text-base font-medium text-gray-300 hover:text-white transition-colors rounded-r-lg hover:bg-white/5 pl-2">
          <span className="flex items-center gap-3"><BookOpen className="text-purple-400" /> {subjectData.title}</span>
          <div className="flex items-center gap-4">
            <span className="text-xs font-normal text-gray-500">
                {ytCount > 0 && `${ytCount} videos`}
                {ytCount > 0 && docCount > 0 && ', '}
                {docCount > 0 && `${docCount} docs`}
            </span>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}><ChevronDown size={18} /></motion.div>
          </div>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pl-8 pt-2 pb-2">
              <div className="space-y-3">
                {subjectData.resources.map(resource => (
                  resource && <ResourceItem key={resource._id} resource={resource} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
};
  
const ResourceItem = ({ resource }) => {
    const isDoc = resource.type === 'Document';
    const viewUrl = isDoc && resource.link ? resource.link.replace('/upload/', '/upload/fl_inline/') : resource.link;
    const downloadUrl = isDoc && resource.link ? resource.link.replace('/upload/', '/upload/fl_attachment/') : null;
  
    return (
      <div className="flex justify-between items-center text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200 group p-2 rounded-md">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
            {isDoc ? (
                <FileText className="w-5 h-5 text-cyan-500 flex-shrink-0" />
            ) : (
                <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <span className="truncate" title={resource.title}>{resource.title}</span>
        </div>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          {isDoc ? (
            <>
              <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-white/10 rounded-full" title="View"><Eye size={16} /></a>
              {downloadUrl && <a href={downloadUrl} download className="p-1.5 hover:bg-white/10 rounded-full" title="Download"><DownloadCloud size={16} /></a>}
            </>
          ) : (
            <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-white/10 rounded-full" title="Open Link"><ExternalLink size={16} /></a>
          )}
        </div>
      </div>
    );
};

const EmptyState = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-black/20 rounded-2xl border border-dashed border-white/10">
        <Wind className="mx-auto h-16 w-16 text-gray-500 mb-4" />
        <h3 className="text-2xl font-semibold text-gray-300">No Resources Found</h3>
        <p className="text-gray-400 mt-2">Try adjusting your search or check back later.</p>
    </motion.div>
);

export default ExplorePage;
