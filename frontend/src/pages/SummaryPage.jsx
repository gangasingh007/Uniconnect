import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, X, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import InteractiveBackground from "../components/InteractiveBackground";

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const SummaryPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // --- FIX: Read all three IDs from the URL ---
  const resourceId = searchParams.get("resourceId");
  const classId = searchParams.get("classId");
  const subjectId = searchParams.get("subjectId");
  
  const [summary, setSummary] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // --- FIX: Validate all three IDs before fetching ---
    if (!isValidMongoId(resourceId) || !isValidMongoId(classId) || !isValidMongoId(subjectId)) {
      setError("Invalid or missing information. Please go back and try again.");
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        // --- FIX: Construct the correct API URL with all IDs ---
        // Assuming your backend route is structured like this
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/resource/gemini-summarize/${classId}/${subjectId}/${resourceId}`,
          { headers: { authorization: `Bearer ${token}` } }
        );
        
        setSummary(response.data.summary);
        if (response.data.resource) {
            setResourceTitle(response.data.resource.title);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.message || "Could not generate summary.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [resourceId, classId, subjectId]); // Add classId and subjectId to dependency array

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-[#0a0a0f] via-[#141423] to-[#1a1a2e] text-gray-200">
      <div className="absolute inset-0 -z-10"><InteractiveBackground /></div>
      <Navbar />
      <main className="relative z-10 flex justify-center items-start pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-black/40 border border-white/10 rounded-3xl shadow-2xl shadow-purple-900/20 max-w-3xl w-full p-8 backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    AI-Generated Summary
                </h2>
                {resourceTitle && <p className="text-gray-400 mt-1">For: {resourceTitle}</p>}
            </div>
            <button 
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white p-2 rounded-full transition-colors hover:bg-white/10">
              <X size={24} />
            </button>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center my-12 text-center">
              <Loader2 className="animate-spin text-purple-400 mb-4" size={40} />
              <p className="text-purple-300 text-lg font-semibold">Generating summary...</p>
              <p className="text-gray-500 mt-2">This may take a moment for large documents.</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center my-12 text-center text-red-400 bg-red-500/10 p-6 rounded-xl border border-red-500/20">
                <AlertCircle size={40} className="mb-4" />
                <p className="font-semibold text-lg">Failed to Generate Summary</p>
                <p className="text-red-300/80 mt-1">{error}</p>
            </div>
          )}

          {summary && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap"
            >
              {summary}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SummaryPage;
