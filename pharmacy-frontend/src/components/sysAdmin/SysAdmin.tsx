import React, { useState, useEffect } from "react";
import "./SysAdmin.css"; // The CSS file with all the styles
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Container,
  Switch,
  ButtonGroup,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";


function SysAdminPage() {
  const user = useUserContext().user;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log(user);
      const response = await fetch('http://localhost:5001/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }), // Pass the user object in the request body
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // "Logout successful. Redirecting to login page..."
  
        // Redirect to the login page
        window.location.href = data.redirect;
      } else {
        const errorData = await response.json();
        console.error('Logout failed:', errorData.error);
        alert(errorData.error); // Show error message to the user
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // State to track pharmacy form inputs
  const [pharmacyData, setPharmacyData] = useState({
    name: "",
    website: "",
    address: "",
    owner: "",
    phoneNumber: "",
    openingTime: "",
    closingTime: "",
  });
  const [managerData, setManagerData] = useState({
    id: '1', type: 'Manager', name: '', username: '', password: '', disabled: true, locked: false, attempted: 0
  });

  const handlePharmacyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPharmacyData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleManagerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setManagerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fetchPharmacyData = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/pharmacy", {
        method: "GET", // Request type is GET
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pharmacy data");
      }

      const data = await response.json();
      setPharmacyData(data); // Populate form fields with data
    } catch (error) {
      console.error("Error fetching pharmacy data:", error);
    }
  };
  const fetchManagerData = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/staff", {
        method: "GET", // Request type is GET
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pharmacy data");
      }

      const data = await response.json();
      setManagerData(data.find((value: { id: string; }) => value.id == '1')); // Populate form fields with data
    } catch (error) {
      console.error("Error fetching pharmacy data:", error);
    }
  };


  // Fetch pharmacy data when the component mounts
  useEffect(() => {
    fetchPharmacyData();
    fetchManagerData();
  }, []);

  // Function to handle form submission
  const handlePharmacySubmit = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/pharmacy", {
        method: "PUT", // Using PUT since you're updating an existing record
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pharmacyData), // Send the pharmacy data as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to update pharmacy data");
      }

      const result = await response.json();
      console.log(result); // Handle the result or show a success message
    } catch (error) {
      console.error("Error updating pharmacy data:", error);
    }
  };
  // Function to handle form submission
  const handleManagerSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/staff/1", {
        method: "PUT", // Using PUT since you're updating an existing record
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(managerData), // Send the pharmacy data as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to update manager data");
      }

      const result = await response.json();
      console.log(result); // Handle the result or show a success message
    } catch (error) {
      console.error("Error updating manager data:", error);
    }
  };

  return <div className="sysadmin-background">
    {/* Header */}
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          System Administrator
        </Typography>
        <Typography variant="h6">
          Pharmacy System
        </Typography>
        <Button color="inherit" onClick={handleLogout}>Log Out</Button>
      </Toolbar>
    </AppBar>

    {/* Body */}
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '2rem',
        flexWrap: 'wrap',
      }}
    >
      {/* First Container */}
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background for readability
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: 3,
          marginBottom: '2rem',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
          Pharmacy
        </Typography>

        <TextField fullWidth label="Name" name="name" value={pharmacyData.name} onChange={handlePharmacyInputChange} variant="outlined" sx={{ marginBottom: '1rem' }} />
        <TextField fullWidth label="Website" name="website" value={pharmacyData.website} onChange={handlePharmacyInputChange} variant="outlined" sx={{ marginBottom: '1rem' }} />
        <TextField fullWidth label="Address" name="address" value={pharmacyData.address} onChange={handlePharmacyInputChange} variant="outlined" sx={{ marginBottom: '1rem' }} />
        <TextField fullWidth label="Owner" name="owner" value={pharmacyData.owner} onChange={handlePharmacyInputChange} variant="outlined" sx={{ marginBottom: '1rem' }} />
        <TextField fullWidth label="Phone Number" name="phoneNumber" value={pharmacyData.phoneNumber} onChange={handlePharmacyInputChange} variant="outlined" sx={{ marginBottom: '1rem' }} />
        <TextField fullWidth label="Opening Time" name="openingTime" value={pharmacyData.openingTime} onChange={handlePharmacyInputChange} variant="outlined" sx={{ marginBottom: '1rem' }} />
        <TextField fullWidth label="Closing Time" name="closingTime" value={pharmacyData.closingTime} onChange={handlePharmacyInputChange} variant="outlined" sx={{ marginBottom: '1rem' }} />

        <Button variant="contained" color="primary" onClick={handlePharmacySubmit}>
          Submit
        </Button>
      </Container>

      {/* Second Container */}
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: 3,
          marginBottom: '2rem',
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
          Pharmacy Manager
        </Typography>

        <TextField fullWidth label="Name" name='name' variant="outlined" value={managerData.name} onChange={handleManagerInputChange} sx={{ marginBottom: '1rem' }} />
        <TextField fullWidth label="Username" name='username' variant="outlined" value={managerData.username} onChange={handleManagerInputChange} sx={{ marginBottom: '1rem' }} />
        <TextField fullWidth label="Password" name='password' variant="outlined" value={managerData.password} onChange={handleManagerInputChange} sx={{ marginBottom: '1rem' }} />

        <Button variant="contained" color="primary" onClick={handleManagerSubmit}>
          Submit
        </Button>
      </Container>
    </Box>
  </div>;
}

export default SysAdminPage;
