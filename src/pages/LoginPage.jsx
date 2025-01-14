import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useUser } from "../context/UserContext"; 
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Container, Box, Typography, TextField, Button, Link } from "@mui/material";
import { and } from "firebase/firestore";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); 
  const { setUser } = useUser(); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user); 
      navigate("/");
    } catch (error) {
      console.error("Error signing in:", error);
      setMessage("Username/Password is incorrect"); 
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setMessage("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox or spam folder.");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setMessage("Error in Login In info"); 
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Container maxWidth="sm">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            Login
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
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button variant="contained" color="primary" type="submit" fullWidth disabled={(!password || !email)}>
            Login
          </Button>

          {message && (
            <Typography variant="body2" color="error" textAlign="center" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}

          <Box textAlign="center">
            <Typography variant="body2">
              Forgot your password?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={handlePasswordReset}
                underline="hover"
              >
                Reset Password
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}

export default LoginPage;
