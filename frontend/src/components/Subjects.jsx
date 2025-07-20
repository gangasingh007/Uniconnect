import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';

const Subjects = () => {
  const user = useRecoilValue(userAtom);
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form, setForm] = useState({ title: '', subjectTeacher: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch subjects on mount
  useEffect(() => {
    if (!user?.classId) return;
    fetchSubjects();
    // eslint-disable-next-line
  }, [user?.classId]);

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
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, subject = null) => {
    setModalMode(mode);
    setSelectedSubject(subject);
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
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        toast.success('Subject added');
      } else if (modalMode === 'edit' && selectedSubject) {
        await axios.put(
          `http://localhost:3000/api/v1/subject/update-subject/${user.classId}/${selectedSubject._id}`,
          form,
          { headers: { authorization: `Bearer ${token}` } }
        );
        toast.success('Subject updated');
      }
      fetchSubjects();
      closeModal();
    } catch (err) {
      setError('Operation failed');
      toast.error('Operation failed');
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
      toast.success('Subject deleted');
      fetchSubjects();
      closeModal();
    } catch (err) {
      setError('Delete failed');
      toast.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
          <div className="space-y-3">
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight">
              Subjects
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              Manage your academic subjects and courses with ease
            </p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => openModal('add')}
              className="group relative bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
              Add Subject
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl blur-xl -z-10 group-hover:blur-2xl transition-all duration-300"></div>
            </button>
          )}
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 text-slate-300">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
            Loading subjects...
          </div>
        </div>
      )}
      
      {error && (
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Subject Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <div 
              key={subject._id} 
              className="group relative bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 p-8 border border-slate-600/30 hover:border-purple-500/30 transform hover:-translate-y-2 hover:scale-[1.02]"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 p-4 rounded-2xl shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                      <BookOpen className="text-white" size={28} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"></div>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => openModal('edit', subject)}
                        className="p-3 text-slate-400 hover:text-white hover:bg-purple-500/20 rounded-xl transition-all duration-200 hover:scale-110"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openModal('delete', subject)}
                        className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-100 transition-colors duration-300">
                    {subject.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <p className="text-slate-300 font-medium">
                      {subject.subjectTeacher}
                    </p>
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && subjects.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-3xl p-12 max-w-md mx-auto border border-slate-600/30">
              <BookOpen size={64} className="text-slate-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-300 mb-3">No Subjects Yet</h3>
              {user?.role === 'admin' && (
                <button
                  onClick={() => openModal('add')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Add Your First Subject
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-black-[100] backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full border border-slate-600/30 animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-slate-600/30">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {modalMode === 'add' && 'Add New Subject'}
                {modalMode === 'edit' && 'Edit Subject'}
                {modalMode === 'delete' && 'Delete Subject'}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-600/30 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {modalMode === 'delete' ? (
                <div className="text-center space-y-6">
                  <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center">
                    <Trash2 className="text-red-400" size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Are you sure?</h3>
                    <p className="text-slate-400">
                      This will permanently delete "<span className="text-white font-medium">{selectedSubject?.title}</span>". This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 px-6 py-3 text-slate-300 bg-slate-600/30 hover:bg-slate-600/50 rounded-xl font-semibold transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ) : (
                <div onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">
                      Subject Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter subject title"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">
                      Subject Teacher
                    </label>
                    <input
                      type="text"
                      name="subjectTeacher"
                      value={form.subjectTeacher}
                      onChange={handleChange}
                      placeholder="Enter teacher name"
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 px-6 py-3 text-slate-300 bg-slate-600/30 hover:bg-slate-600/50 rounded-xl font-semibold transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Subject' : 'Save Changes')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;