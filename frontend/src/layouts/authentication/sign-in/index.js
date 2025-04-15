// src/layouts/authentication/sign-in/index.js
import React from "react";
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import logo from "assets/images/mooflixz-logo.png";

function Basic() {
  // Redirect the browser to your backend's Microsoft authentication endpoint
  const handleMicrosoftLogin = () => {
    window.location.href = "http://localhost:3005/auth/azuread";
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
      <MDBox textAlign="center" mt={2}>
        <img src={logo} alt="Mooflixz Logo" style={{ height: "400px", marginBottom: "1rem" }} />
      </MDBox>
        <MDBox pt={4} pb={3} px={3} textAlign="center">
          <MDButton variant="gradient" color="info" fullWidth onClick={handleMicrosoftLogin}>
            Sign in with Microsoft
          </MDButton>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;