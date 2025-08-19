import React, { useState } from "react";
import {
  FileIcon,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FileVideo,
  X,
  UploadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Allowed mime types
const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/gif",
];

const FileUpload = ({
  onFileSelect = () => {},
  label = "Upload File",
  maxSize = 25, // MB
  error,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Pick file icon based on type
  const getFileIcon = (file) => {
    if (!file) return <UploadCloud className="w-12 h-12 text-gray-400" />;
    if (file.type.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-blue-400" />;
    if (file.type.includes("pdf")) return <FileText className="w-8 h-8 text-red-400" />;
    if (file.type.includes("sheet") || file.type.includes("excel")) return <FileSpreadsheet className="w-8 h-8 text-green-400" />;
    if (file.type.includes("video")) return <FileVideo className="w-8 h-8 text-purple-400" />;
    if (file.type.includes("presentation") || file.type.includes("powerpoint")) return <FileSpreadsheet className="w-8 h-8 text-orange-400" />;
    return <FileIcon className="w-8 h-8 text-gray-400" />;
  };

  // Handle validation + state update
  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;

    // Size validation
    if (file.size / 1024 / 1024 > maxSize) {
      onFileSelect(null, `File is too large. Maximum allowed size is ${maxSize} MB.`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Type validation
    if (!allowedTypes.includes(file.type)) {
      onFileSelect(null, "Unsupported file type. Please upload PDF, DOCX, DOC, PPTX, PPT, TXT, JPEG, PNG, or GIF files only.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Valid file
    setSelectedFile(file);
    onFileSelect(file, null);

    // Image preview
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // File input change
  const handleChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onFileSelect(null, null);
    // Reset file input
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="w-full space-y-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
        <span className="text-red-400 ml-1">*</span>
      </label>

      {/* Drop Zone */}
      <motion.div
        className={`relative w-full border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-300 ${
          dragActive 
            ? 'border-purple-400 bg-purple-500/10' 
            : error 
            ? 'border-red-500/50 bg-red-500/5' 
            : selectedFile
            ? 'border-green-500/50 bg-green-500/5'
            : 'border-white/20 bg-black/20 hover:border-purple-500/50 hover:bg-purple-500/5'
        }`}
        onClick={() => document.getElementById("fileInput").click()}
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          id="fileInput"
          className="hidden"
          onChange={handleChange}
          accept={allowedTypes.join(",")}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <AnimatePresence mode="wait">
            {selectedFile ? (
              <motion.div
                key="file-selected"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center space-x-3">
                  {getFileIcon(selectedFile)}
                </div>
                <div>
                  <p className="font-semibold text-white text-lg truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} />
                  Remove File
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="no-file"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {getFileIcon(null)}
                <div>
                  <p className="text-xl font-semibold text-white mb-2">
                    Upload Document
                  </p>
                  <p className="text-gray-400">
                    Drag & drop your file here, or click to browse
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Supports: PDF, DOCX, DOC, PPTX, PPT, TXT, JPEG, PNG, GIF • Max: {maxSize}MB
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Image Preview */}
      {previewUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
        >
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-40 rounded-lg border border-white/10 mx-auto"
          />
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
