/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// layouts/dashboard/index.js
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import AlbumsTable from "./components/AlbumsTable";

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <AlbumsTable />
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;