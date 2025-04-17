// src/layouts/playlist/index.js
import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Box, Typography } from "@mui/material";

export default function Playlist() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Your Playlist</Typography>
      </Box>
      <Footer />
    </DashboardLayout>
  );
}