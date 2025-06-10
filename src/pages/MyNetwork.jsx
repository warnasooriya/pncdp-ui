import React from "react";
import { Box, Grid } from "@mui/material";
import ManageNetworkSidebar from "../components/ManageNetwork/ManageNetworkSidebar";
import ManageNetworkItem from "../components/ManageNetwork/ManageNetworkItem"; // Connection Suggestions Grid
import TopNav from "../components/Layout/TopNav";

const MyNetworkPage = () => {
  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <TopNav />
     <Box sx={{ display: 'flex', mt: 3, px: 3, gap: 2 }}>
       
        <Box sx={{ width: "22%", display: { xs: "none", md: "block" } }}>
          <ManageNetworkSidebar />
        </Box>

        {/* Center Content */}
        <Box sx={{ width: { xs: "100%", md: "75%" } }}>
          <ManageNetworkItem />
        </Box>
      
    </Box>
    </Box>
    
  );
};

export default MyNetworkPage;
