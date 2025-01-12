import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useUser } from "../context/UserContext"; // Import UserContext
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Container, Box, Typography, TextField, Button, FormControl} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState(null);
  const [nationality, setNationality] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [language, setLanguage] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const { setUser } = useUser(); // Get setUser from context
  const navigate = useNavigate();

  const handleSubmitStep1 = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user); // Update context with the newly created user
      console.log("User created:", user);

      await sendEmailVerification(user);
      alert("Verification email sent! Check your inbox.");
      setStep(2);
    } catch (error) {
      console.error("Error creating user:", error);
      alert(error.message);
    }
  };

  const handleSubmitStep2 = async (event) => {
    event.preventDefault();
  
    if (!auth.currentUser) {
      alert("User is not authenticated. Please log in.");
      return;
    }
  
    try {
      const userDoc = doc(db, "users", auth.currentUser.uid); // Use UID as document ID
      await setDoc(userDoc, {
        uid: auth.currentUser.uid,
        name,
        dob,
        nationality,
        bloodType,
        language,
        insuranceProvider,
        policyNumber,
        email: auth.currentUser.email,
        createdAt: new Date(),
      });
  
      alert("Sign-up process complete!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error saving user data:", error.message);
      alert(`Failed to save user data. Reason: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Container maxWidth="sm">
        {step === 1 ? (
          <Box
            component="form"
            onSubmit={handleSubmitStep1}
            sx={{
              mt: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
              Sign Up - Step 1
            </Typography>

            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              label="Confirm Password"
              type="password"
              required
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Next
            </Button>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmitStep2}
            sx={{
              mt: 8,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
              Sign Up - Step 2
            </Typography>

            <TextField
              label="Name"
              type="text"
              required
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label htmlFor="dob-picker">Date of Birth*</label>
            <DatePicker
              id="dob-picker"
              selected={dob}
              onChange={(date) => setDob(date)}
              dateFormat="d MMM, yyyy"
              placeholderText="Select your Date of Birth (e.g., 15 Jan, 1995)"
              className="react-datepicker-input"
            />

            <TextField
              select
              label="Nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              fullWidth
              required
              SelectProps={{
                native: true,
              }}
            >
              <option value="" disabled>
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
              value={bloodType}
              onChange={(e) => setBloodType(e.target.value)}
              fullWidth
              required
              SelectProps={{
                native: true,
              }}
            >
              <option value="" disabled>
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
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
            >
              <option value="" disabled>
              </option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Hindi">Hindi</option>
              <option value="Mandarin">Mandarin</option>
            </TextField>

            <TextField
              label="Insurance Provider"
              type="text"
              fullWidth
              value={insuranceProvider}
              onChange={(e) => setInsuranceProvider(e.target.value)}
            />

            <TextField
              label="Insurance Policy Number"
              type="text"
              fullWidth
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            />    

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Complete Sign Up
            </Button>
          </Box>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default SignupPage;
