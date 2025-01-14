import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Ensure your Firebase setup is correct
import Logo from "../../assets/logo.png";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="bg-blue-600 p-4 shadow-md"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src={Logo} alt="Logo" className="h-8" />
        </div>

        <div className="flex space-x-6">
          <Link to="/" className="text-white text-lg hover:underline">
            Home
          </Link>
          <Link to="/hospital-search" className="text-white text-lg hover:underline">
            Hospital Locator
          </Link>

          {user ? (
            <>
              <Link to="/medical" className="text-white text-lg hover:underline">
                My Records
              </Link>
              <Link to="/profile" className="text-white text-lg hover:underline">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/sign-up" className="text-white text-lg hover:underline">
                Sign Up
              </Link>
              <Link to="/login" className="text-white text-lg hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
