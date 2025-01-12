import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Avatar, Grid2, Button, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import PersonIcon from '@mui/icons-material/Person';
import { FormControl, FormHelperText } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/stylesheet.css";
import { Timestamp } from 'firebase/firestore';

const ProfilePage = () => {
  const [user, setUser] = useState(null); // User data from Firestore
  const [editMode, setEditMode] = useState(false); // Toggle between view and edit mode
  const [updatedUser, setUpdatedUser] = useState({}); // Store updated data during edit
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!auth.currentUser) {
          console.error("No authenticated user found.");
          return;
        }

        const userDoc = doc(db, "users", auth.currentUser.uid); // Fetch using UID
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          // Convert Firestore Timestamp to Date
          setUser({
            ...userData,
            dob: userData.dob ? userData.dob.toDate() : null,
          });

          setUpdatedUser({
            ...userData,
            dob: userData.dob ? userData.dob.toDate() : null,
          });
        } else {
          console.error("User data not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to home page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (auth.currentUser) {
        const userDoc = doc(db, "users", auth.currentUser.uid);

        // Convert updatedUser.dob to Firestore Timestamp if it exists
        const updatedData = {
          ...updatedUser,
          dob: updatedUser.dob ? Timestamp.fromDate(updatedUser.dob) : null, // Firestore-compatible format
        };

        await updateDoc(userDoc, updatedData);

        // Update the local state with the saved data
        setUser(updatedData);
        setEditMode(false); // Exit edit mode
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your profile...
        </Typography>
      </div>
    );
  }

  if (!user) {
    return (
      <Typography variant="h6" className="text-center">
        Unable to load profile data. Please try again later.
      </Typography>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: 'white',
          }}
        >
          {/* User Photo */}
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={user.photo}
            alt={user.name}
          >
            {!user.photo && <PersonIcon sx={{ fontSize: 50 }} />}
          </Avatar>

          {/* User Details */}
          {editMode ? (
            <Box sx={{ width: '100%', maxWidth: 500 }}>
              <TextField
                label="Name"
                fullWidth
                value={updatedUser.name}
                onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <DatePicker
                selected={updatedUser.dob || null} // Ensure a Date object or null
                onChange={(date) => setUpdatedUser({ ...updatedUser, dob: date })}
                dateFormat="d MMM, yyyy"
                placeholderText="Select Date of Birth"
                className="custom-datepicker"
                wrapperClassName="custom-datepicker-wrapper"
                />
                
              <TextField
                select
                label="Nationality"
                fullWidth
                value={updatedUser.nationality}
                onChange={(e) => setUpdatedUser({ ...updatedUser, nationality: e.target.value })}
                SelectProps={{
                    native: true,
                }}
                sx={{ mb: 2 }}
                >
                <option value="" disabled>
                    Select Nationality
                </option>
                <option value="American">American</option>
                <option value="Indian">Indian</option>
                <option value="Canadian">Canadian</option>
                <option value="British">British</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Other">Other</option>
                </TextField>
                <TextField
                select
                label="Blood Type"
                fullWidth
                value={updatedUser.bloodType}
                onChange={(e) => setUpdatedUser({ ...updatedUser, bloodType: e.target.value })}
                SelectProps={{
                    native: true,
                }}
                sx={{ mb: 2 }}
                >
                <option value="" disabled>
                    Select Blood Type
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                </TextField>
                <TextField
                select
                label="Preferred Language"
                fullWidth
                value={updatedUser.language}
                onChange={(e) => setUpdatedUser({ ...updatedUser, language: e.target.value })}
                SelectProps={{
                    native: true,
                }}
                sx={{ mb: 2 }}
                >
                <option value="" disabled>
                    Select Language
                </option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Hindi">Hindi</option>
                <option value="Mandarin">Mandarin</option>
                </TextField>
                <TextField
                label="Insurance Provider"
                fullWidth
                value={updatedUser.insuranceProvider}
                onChange={(e) => setUpdatedUser({ ...updatedUser, insuranceProvider: e.target.value })}
                sx={{ mb: 2 }}
                />
                <TextField
                label="Insurance Policy Number"
                fullWidth
                value={updatedUser.policyNumber}
                onChange={(e) => setUpdatedUser({ ...updatedUser, policyNumber: e.target.value })}
                sx={{ mb: 2 }}
                />
              <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
                Save
              </Button>
              <Button variant="text" color="secondary" fullWidth onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {user.name}
              </Typography>
              <Grid2 container spacing={2} sx={{ maxWidth: 500 }}>
                <Grid2 item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Email:</strong> {user.email}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Phone:</strong> {user.phone}
                  </Typography>
                </Grid2>
                <Typography variant="body1" color="textSecondary">
                <strong>Date of Birth:</strong> {user.dob ? user.dob.toLocaleDateString() : "N/A"}
                </Typography>
                <Grid2 item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Nationality:</strong> {user.nationality}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12}>
                  <Typography variant="body1" color="textSecondary">
                    <strong>Blood Type:</strong> {user.bloodType}
                  </Typography>
                </Grid2>
                <Grid2 item xs={12}>
                    <Typography variant="body1" color="textSecondary">
                    <strong>Preferred Language:</strong> {user.language}
                    </Typography>
                </Grid2>
                <Grid2 item xs={12}>
                    <Typography variant="body1" color="textSecondary">
                    <strong>Insurance Provider:</strong> {user.insuranceProvider}
                    </Typography>
                </Grid2>
                <Grid2 item xs={12}>
                    <Typography variant="body1" color="textSecondary">
                    <strong>Policy Number:</strong> {user.policyNumber}
                    </Typography>
                </Grid2>
              </Grid2>
              <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            </>
          )}

          <Button
            variant="outlined"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default ProfilePage;
