import React, { useState } from "react";
import { uploadFile } from "../firebaseStorage";
import { Container, Box, Typography, Avatar, Grid, Button, TextField, CircularProgress } from '@mui/material';
import { getAuth } from "firebase/auth";
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import DragNdrop from "../components/DragNdrop/DragNdrop";

const MedicalRecords = () => {
  const [files, setFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser; // Get the currently authenticated user

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length > 0 && user) {
      const urls = [];
      for (const file of files) {
        try {
          const downloadUrl = await uploadFile(file, user.uid);
          urls.push({ name: file.name, url: downloadUrl });
        } catch (error) {
          console.error("File upload failed:", error.message);
        }
      }
      setUploadedUrls(urls);
      setFiles([]); // Clear files after upload
    } else {
      alert("No files selected or user not authenticated.");
    }
  };

  return (
    <div>
      <Navbar />
        <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
          <h2 className="upload-heading">Upload Medical Records</h2>
          <DragNdrop onFilesSelected={handleFilesSelected} width="100%" height="200px" />
          </Container>
          <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
          <button onClick={handleUpload} style={{ marginTop: "20px" }}>
            Upload {files.length} File(s)
          </button>

          {uploadedUrls.length > 0 && (
            <div>
              <h3>Uploaded Files:</h3>
              <ul>
                {uploadedUrls.map((file, index) => (
                  <li key={index}>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </Container>
      <Footer />
    </div>
  );
};

export default MedicalRecords;
