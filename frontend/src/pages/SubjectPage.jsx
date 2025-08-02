import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, BookOpen, AlertCircle, CheckCircle2, Users, GraduationCap, CloudHail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useRecoilState, useRecoilValue , useSetRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { subjectAtom } from '../atoms/subjectAtom';
import { useNavigate } from 'react-router-dom';
;

const SubjectPage = () => {
  const user = useRecoilValue(userAtom);
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form, setForm] = useState({ title: '', subjectTeacher: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const setsubjectId = useSetRecoilState(subjectAtom)
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!user?.classId) return;
    fetchSubjects();
  }, [user?.classId]);

  const handleClick = (subjectId) => {
    setsubjectId(subjectId);
    navigate('/subjects/resource');
  };

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Subject title is required';
    if (!form.subjectTeacher.trim()) errors.subjectTeacher = 'Teacher name is required';
    if (form.title.length < 2) errors.title = 'Title must be at least 2 characters';
    if (form.subjectTeacher.length < 2) errors.subjectTeacher = 'Teacher name must be at least 2 characters';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:3000/api/v1/subject/all-subjects/${user.classId}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      setSubjects(res.data.subjects || []);
    } catch (err) {
      setError('Failed to fetch subjects');
      toast.error('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, subject = null) => {
    setModalMode(mode);
    setSelectedSubject(subject);
    setValidationErrors({});
    if (mode === 'edit' && subject) {
      setForm({ title: subject.title, subjectTeacher: subject.subjectTeacher });
    } else {
      setForm({ title: '', subjectTeacher: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm({ title: '', subjectTeacher: '' });
    setSelectedSubject(null);
    setValidationErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      if (modalMode === 'add') {
        await axios.post(
          `http://localhost:3000/api/v1/subject/create-subject/${user.classId}`,
          form,
          { headers: { authorization: `Bearer ${token}` } }
        );
        toast.success('Subject added successfully!');
      } else if (modalMode === 'edit' && selectedSubject) {
        await axios.put(
          `http://localhost:3000/api/v1/subject/update-subject/${user.classId}/${selectedSubject._id}`,
          form,
          { headers: { authorization: `Bearer ${token}` } }
        );
        toast.success('Subject updated successfully!');
      }
      fetchSubjects();
      closeModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Operation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/subject/delete-subject/${user.classId}/${selectedSubject._id}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      toast.success('Subject deleted successfully!');
      fetchSubjects();
      closeModal();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Delete failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const subjectColors = [
    'from-purple-500 to-blue-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-purple-500',
    'from-indigo-500 to-blue-500'
  ];

  return (
    <>
    < Navbar />
      <div className="min-h-screen b p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        {/* Enhanced Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent leading-tight">
                Subjects
              </h1>
              <p className="text-lg text-gray-400 max-w-md">
                Manage your academic subjects and courses with ease
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{subjects.length} Subjects</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{user?.courseName || 'N/A'} {user?.section} {user?.semester}</span>
                </div>
              </div>
            </div>
            {user?.role === 'admin' && (
              <motion.button
                onClick={() => openModal('add')}
                className="group relative bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                Add Subject
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300"></div>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Enhanced Loading State */}
        {loading && !subjects.length && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-flex flex-col items-center gap-4 text-gray-300">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500/20 border-t-purple-500"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
              </div>
              <p className="text-lg font-medium">Loading subjects...</p>
            </div>
          </motion.div>
        )}

        {/* Enhanced Error State */}
        {error && !loading && (
          <motion.div
            className="max-w-md mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center backdrop-blur-sm">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={fetchSubjects}
                className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Subject Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AnimatePresence>
            {subjects.map((subject, index) => (
              <motion.div
                key={subject._id}
                onClick={() => handleClick(subject._id)}
                className="group relative bg-gradient-to-br from-[#08080d] to-[#05050e] backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 p-6 sm:p-8 border border-[#3a3a50] hover:border-purple-500/30 overflow-hidden"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Enhanced gradient overlay */}
                <div className={`absolute inset-0  rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  {/* Enhanced Header */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <div className={`bg-gradient-to-br ${subjectColors[index % subjectColors.length]} p-4 rounded-2xl shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300`}>
                        <BookOpen className="text-white" size={28} />
                      </div>
                      <motion.div
                        className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>

                    {user?.role === 'admin' && (
                      <motion.div
                        className="flex gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('edit', subject);
                          }}
                          className="p-3 text-gray-400 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('delete', subject);
                          }}
                          className="p-3 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300 line-clamp-2">
                      {subject.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 bg-gradient-to-r ${subjectColors[index % subjectColors.length]} rounded-full shadow-lg`}></div>
                      <p className="text-gray-300 font-medium truncate flex-1">
                        {subject.subjectTeacher}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover effect particles */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
                  <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Empty State */}
        {!loading && subjects.length === 0 && !error && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-[#1f1f35] to-[#1a1a2e] rounded-3xl p-12 max-w-md mx-auto border border-[#3a3a50] backdrop-blur-sm">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BookOpen size={64} className="text-gray-500 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-300 mb-3">No Subjects Yet</h3>
              <p className="text-gray-400 mb-6">Start by adding your first subject to get organized</p>
              {user?.role === 'admin' && (
                <motion.button
                  onClick={() => openModal('add')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Your First Subject
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <motion.div
              className="bg-black backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-[#3a3a50] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

              {/* Modal Header */}
              <div className="flex justify-between items-center p-8 border-b border-[#3a3a50] relative">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {modalMode === 'add' && 'Add New Subject'}
                  {modalMode === 'edit' && 'Edit Subject'}
                  {modalMode === 'delete' && 'Delete Subject'}
                </h2>
                <motion.button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-600/30 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-8 relative">
                {modalMode === 'delete' ? (
                  <motion.div
                    className="text-center space-y-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.div
                      className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trash2 className="text-red-400" size={32} />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white">Are you sure?</h3>
                      <p className="text-gray-400">
                        This will permanently delete "<span className="text-white font-medium">{selectedSubject?.title}</span>". This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <motion.button
                        onClick={closeModal}
                        className="flex-1 px-6 py-3 text-gray-300 bg-gray-600/30 hover:bg-gray-600/50 rounded-xl font-semibold transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                          'Delete Subject'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Subject Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter subject title"
                        className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.title ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                        required
                      />
                      {validationErrors.title && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {validationErrors.title}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-300">
                        Subject Teacher *
                      </label>
                      <input
                        type="text"
                        name="subjectTeacher"
                        value={form.subjectTeacher}
                        onChange={handleChange}
                        placeholder="Enter teacher name"
                        className={`w-full px-4 py-3 bg-[#252540] border ${validationErrors.subjectTeacher ? 'border-red-500' : 'border-[#3a3a50]'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
                        required
                      />
                      {validationErrors.subjectTeacher && (
                        <p className="text-red-400 text-xs mt-1 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {validationErrors.subjectTeacher}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 pt-4">
                      <motion.button
                        type="button"
                        onClick={closeModal}
                        className="flex-1 px-6 py-3 text-gray-300 bg-gray-600/30 hover:bg-gray-600/50 rounded-xl font-semibold transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            {modalMode === 'add' ? 'Add Subject' : 'Save Changes'}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    <Footer />
    </>
  );
};

export default SubjectPage;
