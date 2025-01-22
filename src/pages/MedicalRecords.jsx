import React, { useState, useEffect } from "react";
import { uploadFile } from "../firebaseStorage";
import { Container, Box, Typography, Grid, Button, Card, CardContent, CardMedia, TextField } from '@mui/material';
import { getAuth } from "firebase/auth";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import DragNdrop from "../components/DragNdrop/DragNdrop";
import { PictureAsPdf, Description, Image, InsertDriveFile } from "@mui/icons-material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ClipLoader } from "react-spinners";

const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "pdf": return <PictureAsPdf sx={{ fontSize: 60, color: "red" }} />;
    case "jpg": case "jpeg": case "png": return <Image sx={{ fontSize: 60, color: "green" }} />;
    default: return <InsertDriveFile sx={{ fontSize: 60, color: "gray" }} />;
  }
};

const MedicalRecords = () => {
  const [editFile, setEditFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileDetails, setFileDetails] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchFiles = async () => {
      if (user) {
        setIsLoading(true);
        const folderRef = ref(storage, `${user.uid}/health-records`);
        const fileList = await listAll(folderRef);
        const urls = await Promise.all(
          fileList.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return { name: item.name, url, date: new Date().toLocaleDateString() };
          })
        );
        setUploadedUrls(urls);
        setIsLoading(false);
      }
    };
    fetchFiles();
  }, [user]);

  const handleFilesSelected = (selectedFiles) => {
    const newDetails = {};
    selectedFiles.forEach(file => {
      newDetails[file.name] = { label: '', hospital: '', comments: '' };
    });
    setFileDetails(prevDetails => ({ ...prevDetails, ...newDetails }));
    setFiles(selectedFiles);
  };

  const handleEdit = (file) => {
    setEditFile(file);
  };

  const handleSaveEdit = async () => {
    if (editFile && user) {
      try {
        const fileRef = ref(storage, `${user.uid}/health-records/${editFile.name}`);
        await uploadFile(editFile, user.uid);
        setUploadedUrls((prev) => prev.map(file => file.name === editFile.name ? editFile : file));
        setEditFile(null);
      } catch (error) {
        console.error("Failed to save file details:", error.message);
      }
    }
  };

  const handleCloseEdit = () => {
    setEditFile(null);
  };

  const handleUpload = async () => {
    if (files.length > 0 && user) {
      setIsUploading(true);
      const urls = [];
      for (const file of files) {
        try {
          const downloadUrl = await uploadFile(file, user.uid);
          urls.push({
            name: file.name,
            url: downloadUrl,
            date: new Date().toLocaleDateString(),
            label: fileDetails[file.name]?.label || '',
            hospital: fileDetails[file.name]?.hospital || '',
            comments: fileDetails[file.name]?.comments || ''
          });
        } catch (error) {
          console.error("File upload failed:", error.message);
        }
      }
      setUploadedUrls(prev => [...prev, ...urls]);
      setFiles([]);
      setFileDetails({});
      setIsUploading(false);
      window.location.reload();
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
      <Container maxWidth="md" sx={{ mt: 2, mb: 5, display: "flex", justifyContent: "center" }}>
        <Button 
          onClick={handleUpload} 
          disabled={isUploading || files.length === 0}
          variant="contained"
          startIcon={<CloudUploadIcon />}
        >
          {isUploading ? "Uploading..." : files.length > 0 ? `Upload ${files.length} File(s)` : "No Files Selected"}
        </Button>
      </Container>
      <Container maxWidth="md" sx={{ mt: 2, mb: 5 }}>
        <h2 className="upload-heading">Your Medical Records</h2>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <ClipLoader />
          </Box>
        )}
        {!isLoading && uploadedUrls.length === 0 && (
          <Typography variant="body2" sx={{ textAlign: "center", color: "gray", mt: 2 }}>
            No files to display.
          </Typography>
        )}
        <Grid container spacing={3}>
          {uploadedUrls.map((file, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3, height: "100%" }}>
                {!getFileIcon(file.name)}
                <CardMedia
                  component={["jpg", "png"].includes(file.name.split(".").pop().toLowerCase()) ? 'img' : 'iframe'}
                  src={file.url}
                  sx={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', pr: 2, mt: -2 }}>
                  <Box sx={{ backgroundColor: file.label ? '#4caf50' : '#ddd', color: file.label ? '#fff' : '#555', borderRadius: '12px', padding: '4px 10px', fontSize: '12px' }}>
                    {file.label || 'Not Classified Yet'}
                  </Box>
                </Box>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>{file.name}</Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>Hospital: {file.hospital || 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>Comments: {file.comments || 'N/A'}</Typography>
                  <Typography variant="body2" sx={{ color: "gray" }}>Uploaded on: {file.date}</Typography>
                  <Button onClick={() => window.open(file.url, "_blank")} variant="contained" color="primary" size="small">
                    View
                  </Button>
                  <Button onClick={() => handleEdit(file)} variant="contained" color="secondary" size="small" sx={{ ml: 1 }}>
                    Edit
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {editFile && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ display: 'flex', width: 800, height: 600, padding: 2, backgroundColor: '#fff' }}>
            <CardMedia
              component={["jpg", "png"].includes(editFile.name.split(".").pop().toLowerCase()) ? 'img' : 'iframe'}
              src={editFile.url}
              sx={{ width: '50%', height: '100%', objectFit: 'cover' }}
            />
            <CardContent sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6">Edit File Details</Typography>
              <TextField label="Label" fullWidth value={editFile.label || ''} onChange={(e) => setEditFile({...editFile, label: e.target.value})} />
              <TextField label="Hospital" fullWidth value={editFile.hospital || ''} onChange={(e) => setEditFile({...editFile, hospital: e.target.value})} />
              <TextField label="Comments" multiline rows={3} fullWidth value={editFile.comments || ''} onChange={(e) => setEditFile({...editFile, comments: e.target.value})} />
              <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save</Button>
            </CardContent>
          </Card>
        </Box>
      )}
      <Footer />
    </div>
  );
};

export default MedicalRecords;
