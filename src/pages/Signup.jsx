// src/pages/Signup.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { Link } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/login"); // Redirect after successful signup
        } catch (err) {
            setError("Error creating account. Please try again.");
            console.error("Signup error:", err.message);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
        >
            <Box
                width={400}
                p={4}
                bgcolor="white"
                boxShadow={3}
                borderRadius={2}
                textAlign="center"
            >
                <Typography variant="h4" gutterBottom>
                    Sign Up
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSignup}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Sign Up
                    </Button>
                </form>
                {/* Inside your form */}
                <Typography variant="body2">
                     have an account? <Link to="/login">Login</Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Signup;
