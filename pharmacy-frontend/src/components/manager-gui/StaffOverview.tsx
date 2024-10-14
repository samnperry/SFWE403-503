import React, { useEffect, useState } from 'react';
import "./StaffOverview.css"; // The CSS file with all the styles
import { AppBar, Toolbar, Typography, Button, Box, Container, List, ListItem, ListItemText, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

// Define the type for inventory items
interface StaffItem {
  id: string;
  type: string;
  name: string;
  username: string;
  password: string;
}

function StaffOverview() {
  const [inventory, setStaff] = useState<StaffItem[]>([]);
  const [newItem, setNewStaff] = useState<StaffItem>({ id: '', type: '', name: '', username: '', password: '' });
  const navigate = useNavigate();

  // Fetch inventory data from the backend server
  useEffect(() => {
    fetch('http://localhost:5001/api/inventory') 
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: StaffItem[]) => {
        console.log('Inventory data:', data);
        setStaff(data);
      })
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  // Handle input changes for new item
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle adding new item
  const handleAddItem = () => {
    fetch('http://localhost:5001/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Add item response:', data); // Log response for debugging
        setStaff(prevStaff => [...prevStaff, newItem]); // Add new item to state
        setNewStaff({ id: '', type: '', name: '', username: '', password: '' }); // Reset form
      })
      .catch(error => console.error('Error adding inventory item:', error));
  };

  // Handle removing item
  const handleRemoveItem = (id: string) => {
    fetch(`http://localhost:5001/api/inventory/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setStaff(prevInventory => prevInventory.filter(item => item.id !== id));
        } else {
          console.error('Error removing item:', response.status);
        }
      })
      .catch(error => console.error('Error removing inventory item:', error));
  };

  // Sample list of users
  const [users, setUsers] = useState([
    { id: 1, type: 'Admin', name: 'John Doe', username: 'johndoe', password: 'password123' },
    { id: 2, type: 'Pharmacist', name: 'Jane Smith', username: 'janesmith', password: 'password456' },
  ]);

  return (
    <div style={{ width: '150vh', height: '100vh', backgroundColor: 'white' }}>
      {/* Navigation Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1400 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontSize: '1.25rem' }}>
            Pharmacy Manager
          <Typography variant="h6" sx={{ fontSize: '1.25rem' }}>
            {/* Replace <UserName> with dynamic username */}
            UserName
          </Typography>
          </Typography>
          <Button color="inherit" onClick={() => navigate("/ManagerMain")}>Home</Button>
          <Button color="inherit">Staff</Button>
          <Button color="inherit" onClick={() => navigate("/Inventory")}>Inventory</Button>
          <Button color="inherit" onClick={() => navigate("/LoginPage")}>Log Out</Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container
        maxWidth="xl"
        sx={{
          marginTop: '100px', // Pushes the container below the navbar
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: 5,
          height: '80vh', // Set height for scrollable list
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
      {users.map((user, index) => (
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
          {/* Editable fields */}
          <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
              label="Type"
              value={user.type}
              //onChange={(e) => handleInputChange(e, index, 'type')}
              variant="outlined"
              size="small"
              sx={{ width: '100px' }}
            />
            <TextField
              label="ID"
              value={user.id}
              //onChange={(e) => handleInputChange(e, index, 'id')}
              variant="outlined"
              size="small"
              sx={{ width: '70px' }}
            />
            <TextField
              label="Name"
              value={user.name}
              //onChange={(e) => handleInputChange(e, index, 'name')}
              variant="outlined"
              size="small"
              sx={{ width: '150px' }}
            />
            <TextField
              label="Username"
              value={user.username}
              //onChange={(e) => handleInputChange(e, index, 'username')}
              variant="outlined"
              size="small"
              sx={{ width: '150px' }}
            />
            <TextField
              label="Password"
              value={user.password}
              //onChange={(e) => handleInputChange(e, index, 'password')}
              variant="outlined"
              size="small"
              sx={{ width: '150px' }}
            />
          </Box>

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
