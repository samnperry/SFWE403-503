import React from "react";
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

function SysAdminPage() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    navigate("/LoginPage");
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
      <Button color="inherit" onClick={handleLogOut}>Log Out</Button>
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

      <TextField fullWidth label="Name" variant="outlined" sx={{ marginBottom: '1rem' }} />
      <TextField fullWidth label="Website" variant="outlined" sx={{ marginBottom: '1rem' }} />
      <TextField fullWidth label="Address" variant="outlined" sx={{ marginBottom: '1rem' }} />
      <TextField fullWidth label="Owner" variant="outlined" sx={{ marginBottom: '1rem' }} />
      <TextField fullWidth label="Phone Number" variant="outlined" sx={{ marginBottom: '1rem' }} />
      <TextField fullWidth label="Opening Time" variant="outlined" sx={{ marginBottom: '1rem' }} />
      <TextField fullWidth label="Closing Time" variant="outlined" sx={{ marginBottom: '1rem' }} />

      <Button variant="contained" color="primary">
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

      <TextField fullWidth label="Name" variant="outlined" sx={{ marginBottom: '1rem' }} />
      <TextField fullWidth label="Username" variant="outlined" sx={{ marginBottom: '1rem' }} />
      <TextField fullWidth label="Password" type="password" variant="outlined" sx={{ marginBottom: '1rem' }} />

      <Button variant="contained" color="primary">
        Submit
      </Button>
    </Container>
  </Box>
</div>;
}

export default SysAdminPage;
