import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../firebase';
import toast from 'react-hot-toast';

const DocumentUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file');
    setUploading(true);
    const storage = getStorage(app);
    const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(percent);
      },
      (error) => {
        setUploading(false);
        toast.error('Upload failed');
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        setProgress(0);
        toast.success('File uploaded!');
        if (onUpload) onUpload(url);
      }
    );
  };

  return (
    <div className="bg-slate-900 p-4 rounded-xl shadow-md flex flex-col gap-4 items-center">
      <input type="file" onChange={handleFileChange} className="text-white" />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        {uploading ? `Uploading... ${Math.round(progress)}%` : 'Upload Document'}
      </button>
    </div>
  );
};

export default DocumentUploader;
