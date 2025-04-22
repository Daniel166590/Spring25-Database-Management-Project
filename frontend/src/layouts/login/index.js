// src/layouts/login/index.js
import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:3005/api/auth/login", {
        username,
        password,
      }, { withCredentials: true });
      // Store something like res.data.userId or just reload
      window.location.href = "/playlist";
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
        <Typography variant="h4" gutterBottom>Log In</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Log In
        </Button>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}