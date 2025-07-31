import { useState } from 'react';
import axios from "axios";
import { useRecoilValue } from 'recoil';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { classAtom } from '../atoms/classAtom';
import { subjectAtom } from '../atoms/subjectAtom'; // Assuming this atom holds the current subject ID

// A simple loading spinner component
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function UploadResource() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const classId = useRecoilValue(classAtom);
  const subjectId = useRecoilValue(subjectAtom);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", "document"); // or "Yt-Link"
    const token = localStorage.getItem("token");

    await axios.post(
    `http://localhost:3000/api/v1/resource/upload/${classId}/${subjectId}`,
    formData,
    {
        headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
        },
    }
    );  console.log(res.data);
    };

  return (
    <form onSubmit={handleUpload}>
      <input type="text" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
}
