import React, { useState } from "react";
import "./LoginContent.css"; // The CSS file with all the styles
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";


//TODO: add error catching for manager and admin accounts on first time login.

function LoginPage() {
  const [devEnabled, setDevEnabled] = useState(false);
  const navigate = useNavigate();

  // State for username, password, and error message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [firstTimeLogin, setFirstTimeLogin] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState(''); // Store user ID for backend update

  // Navigation handlers
  const handleNavigateHome = () => {
    navigate("/HomePage");
  };

  const handleNavigateSysAdmin = () => {
    navigate("/SysAdminPage");
  };

  const handleNavigateManager = () => {
    navigate("/ManagerMain");
  };

  const handleNavigateInventory = () => {
    navigate("/Inventory");
  };

  const handleNavigateStaffOverview = () => {
    navigate("/StaffOverview");
  };

  const handleNavigatepharm = () => {
    navigate("/Pharm");
  };

  const handleNavigatePatientManager = () => {
    navigate("/PatientManager");
  };

  const handleNavigateCashier = () => {
    navigate("/Cashier");
  };

  // Event handler for dev controls switch
  const handleDevChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDevEnabled(event.target.checked);
  };

  // Handle login using fetch
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;

        if (user.firstTimeLogin) {
          setUserId(user.id); // Save user ID for update
          setFirstTimeLogin(true);
          setOpenDialog(true); // Open the password change dialog
        } else {
          // Navigate based on user type
          if (user.type === 'Admin') {
            navigate('/SysAdminPage');
          } else if (user.type === 'Manager') {
            navigate('/ManagerMain');
          } else if (user.type === 'Cashier') {
            navigate('/Cashier');
          }
        }
      } else {
        // Handle HTTP errors
        const errorData = await response.json();
        if (response.status === 401) {
          setError('Invalid username or password');
        } else if (response.status === 403) {
          setError(errorData.error); // 'User is disabled' or 'User account is locked'
        } else {
          setError('An error occurred during login');
        }
      }
    } catch (error) {
      setError('Unable to connect to server');
      console.error('Login error:', error);
    }
  };

  // Handle password update
  const handlePasswordChange = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/staff/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword, firstTimeLogin: false }) // Update password and set firstTimeLogin to false
      });

      if (response.ok) {
        setOpenDialog(false);  // Close the dialog after successful update
        const data = await response.json();
        navigate(data.type === 'Admin' ? '/SysAdminPage' : data.type === 'Manager' ? '/ManagerMain' : '/Cashier'); // Navigate after updating password
      } else {
        setError('Failed to update password. Please try again.');
      }
    } catch (error) {
      setError('Unable to connect to server');
      console.error('Password change error:', error);
    }
  };

  // Defines the devSection
  let devSection;
  if (!devEnabled) {
    devSection = (
      <>
        <br />
        <FormControlLabel
          value="devcontrols"
          control={<Switch checked={devEnabled} onChange={handleDevChange} />}
          label="Dev Controls"
          labelPlacement="top"
          sx={{ color: "white" }}
        />
      </>
    );
  } else {
    devSection = (
      <Container maxWidth="md" className="dev-container">
        <Box className="wrapper">
          <FormControlLabel
            value="devcontrols"
            control={<Switch checked={devEnabled} onChange={handleDevChange} />}
            label="Dev Controls"
            labelPlacement="top"
          />
          <br />
          <Typography component="p" align="center">
            Navigate to:
          </Typography>
          <ButtonGroup variant="contained">
            <Button onClick={handleNavigateSysAdmin}>SysAdmin Page</Button>
            <Button onClick={handleNavigateManager}>Manager Page</Button>
            <Button onClick={handleNavigateInventory}>Inventory</Button>
          </ButtonGroup>
          <ButtonGroup variant="contained">
            <Button onClick={handleNavigateStaffOverview}>Staff Overview Page</Button>
            <Button onClick={handleNavigatepharm}>Pharm</Button>
            <Button onClick={handleNavigatePatientManager}>Patient Manager</Button>
            <Button onClick={handleNavigateCashier}>Cashier</Button>
          </ButtonGroup>
        </Box>
      </Container>
    );
  }

  return (
    <div className="login-background">
      <Container maxWidth="xs" className="login-container">
        <Box className="wrapper" justifySelf={"center"} marginTop={"35%"}>
          <Typography variant="h4" component="h1" align="center" className="login-title">
            Login
          </Typography>
          <form onSubmit={handleLogin} noValidate>
            <Box className="input-box">
              <TextField
                fullWidth
                label="Username"
                variant="filled"
                InputProps={{ disableUnderline: true }}
                className="input-field"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Box>
            <Box className="input-box">
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="filled"
                InputProps={{ disableUnderline: true }}
                className="input-field"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            {error && (
              <Typography color="error" variant="body2" align="center">
                {error}
              </Typography>
            )}
            <Box className="remember-forgot">
              <FormControlLabel
                control={<Checkbox className="checkbox" />}
                label="Remember me"
                className="remember-me"
              />
              <Typography variant="body2" component="a" href="#" className="forgot-password">
                Forgot Password?
              </Typography>
            </Box>
            <Button type="submit" fullWidth variant="contained" className="login-button">
              Login
            </Button>
          </form>
        </Box>

        {/* Dev Command box */}
        {devSection}

        {/* Password Change Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This is your first time logging in. Please set a new password.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
            <Button onClick={handlePasswordChange} color="primary">Update Password</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default LoginPage;
