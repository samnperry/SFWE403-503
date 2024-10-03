import React from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';

function LoginPage() {
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Box >      
          <Typography component="h1" variant="h5" align="center" paddingTop={10}>
            Sign In
          </Typography>
          
          <form noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"

            >
              Sign In
            </Button>

            <Link href="#" variant="body2" >
              Forgot password?
            </Link>
            <Link href="#" variant="body2" >
              Don't have an account? Sign Up
            </Link>
          </form>
        </Box>
      </Container>
    </div>
  );
}

export default LoginPage;
