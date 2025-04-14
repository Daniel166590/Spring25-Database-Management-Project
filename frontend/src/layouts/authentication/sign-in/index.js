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

function Basic() {
  // Redirect the browser to your backend's Microsoft authentication endpoint
  const handleMicrosoftLogin = () => {
    window.location.href = "http://localhost:3005/auth/azuread";
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in with Microsoft
          </MDTypography>
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