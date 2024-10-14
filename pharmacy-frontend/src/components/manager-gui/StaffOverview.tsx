import React from 'react';
import "./StaffOverview.css"; // The CSS file with all the styles
import { AppBar, Toolbar, Typography, Button, Box, Container, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";


function StaffOverview() {
  // Sample list of users
  const users = [
    { id: 1, type: 'Admin', name: 'John Doe', username: 'johndoe', password: 'password123' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
    // More user data here...
  ];

  return (
    <div style={{ height: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Navigation Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1400 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontSize: '1.25rem' }}>
            Pharmacy Manager
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Staff</Button>
          <Button color="inherit">Inventory</Button>
          <Typography variant="h6" sx={{ fontSize: '1.25rem' }}>
            {/* Replace <UserName> with dynamic username */}
            UserName
          </Typography>
          <Button color="inherit">Log Out</Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container
        maxWidth="lg"
        sx={{
          marginTop: '100px', // Pushes the container below the navbar
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: 5,
          height: '70vh', // Set height for scrollable list
          overflowY: 'auto', // Enable scrolling for the user list
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Typography variant="h4">Staff Overview</Typography>
          <Button variant="contained" startIcon={<AddIcon />} color="primary" size="large">
            Add New User
          </Button>
        </Box>

        {/* User List */}
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                padding: '1rem 0',
              }}
            >
              {/* User details */}
              <ListItemText
                primary={`${user.type}: ${user.name}`}
                secondary={`ID: ${user.id}, Username: ${user.username}`}
                sx={{ flex: 1 }}
              />

              {/* Action buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton aria-label="edit" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color="secondary">
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label="unlock" color="default">
                  <LockOpenIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Container>
    </div>
  );
}

export default StaffOverview;
