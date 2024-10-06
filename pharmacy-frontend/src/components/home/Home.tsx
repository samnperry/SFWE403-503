import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Grid2,
  Container,
  Paper,
} from '@mui/material';

function HomePage() {
  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Pharmacy System
          </Typography>
          <Button color="inherit"  href='/HomePage'>Home</Button>
          <Button color="inherit">Prescriptions</Button>
          <Button color="inherit">Orders</Button>
          <Button color="inherit">Profile</Button>
        </Toolbar>
      </AppBar>

      {/* Main Welcome Section */}
      <Container component="main" style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to the Pharmacy System
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your health is our priority. Search for medications, manage prescriptions, and track your orders easily.
        </Typography>

        {/* Search Bar for Medications */}
        <Grid2 container spacing={2} alignItems="center" style={{ marginBottom: '2rem' }}>
          <Grid2 size={{xs:12, sm:4}}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for medications..."
            />
          </Grid2>
          <Grid2 size={{xs:12, sm:4}}>
            <Button variant="contained" color="primary" fullWidth>
              Search
            </Button>
          </Grid2>
        </Grid2>

        {/* Features Section */}
        <Grid2 container spacing={4}>
          <Grid2 size={{xs:12, sm:4}}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6">Manage Prescriptions</Typography>
              <Typography variant="body2">
                Easily view, update, or renew your prescriptions.
              </Typography>
            </Paper>
          </Grid2>
          <Grid2 size={{xs:12, sm:4}}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6">Track Orders</Typography>
              <Typography variant="body2">
                Stay updated on your medication orders with real-time tracking.
              </Typography>
            </Paper>
          </Grid2>
          <Grid2 size={{xs:12, sm:4}}>
            <Paper elevation={3} style={{ padding: '1rem' }}>
              <Typography variant="h6">Consultation Services</Typography>
              <Typography variant="body2">
                Get advice from licensed pharmacists regarding your medications.
              </Typography>
            </Paper>
          </Grid2>
        </Grid2>
      </Container>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f1f1f1' }}>
        <Typography variant="body2" color="textSecondary">
          &copy; 2024 Pharmacy System. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
}

export default HomePage;
