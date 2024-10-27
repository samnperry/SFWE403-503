import React from "react";
import "./pharm.css"; // The CSS file with all the styles
//import MikuImage from "../Assets/PharmBackground.jpg"; for later

import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Pharm() {
  const navigate = useNavigate();

  // Navigate to Home Page
  const handleNavigateHome = () => {
    navigate("/HomePage"); 
  };

  // logout is like this unitl it actually gets figured out 
  const handleLogout = () => {
    navigate("/LoginPage"); 
  };

  return (
    <div
      className="pharm-background"
      //style={{ backgroundImage: `url(${MikuImage})` }}
    >
      {/* Fixed AppBar at the top */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Pharmacy Page
          </Typography>
          <Button color="inherit" onClick={handleNavigateHome}>
            Home
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      {/* Spacer to prevent content from being hidden behind the AppBar */}
      <Toolbar />

      <Container maxWidth="sm">
        <Box mt={5} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Welcome to the Pharmacy
          </Typography>
          <Typography variant="body1" gutterBottom>
            meds details below
          </Typography>
          <TextField
            fullWidth
            label="Medication Name"
            variant="outlined"
            margin="normal"
          />
          <Button variant="contained" color="primary">
            Search
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Pharm;
