import React from 'react';
import './LoginContent.css'; // The CSS file with all the styles
import { Box, Typography, TextField, Button, FormControlLabel, Checkbox, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (manager) // something like this might be good for GUIS
    navigate('/ManagerMain');
  };

  return (
    <div className="login-background">
      <Container maxWidth="xs" className="login-container">
        <Box className="wrapper">
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
              />
            </Box>
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
      </Container>
    </div>
  );
}

export default LoginPage;
