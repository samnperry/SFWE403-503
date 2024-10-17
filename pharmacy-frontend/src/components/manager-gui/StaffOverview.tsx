import React, { useEffect, useState } from 'react';
import "./StaffOverview.css"; // The CSS file with all the styles
import { AppBar, Toolbar, Typography, Button, Box, Container, List, ListItem, ListItemText, IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

// Define the type for staff items
interface StaffItem {
  id: string;
  type: string;
  name: string;
  username: string;
  password: string;
  disabled: boolean
}

function StaffOverview() {
  const [staffList, setStaff] = useState<StaffItem[]>([]);
  const [newItem, setNewStaff] = useState<StaffItem>({ id: '', type: '', name: '', username: '', password: '', disabled: true });
  const navigate = useNavigate();

  // Fetch staff data from the backend server
  useEffect(() => {
    fetch('http://localhost:5001/api/staff')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: StaffItem[]) => {
        data.forEach((value) => { value.disabled = true; })
        console.log('Staff data:', data);
        setStaff(data);
      })
      .catch(error => console.error('Error fetching staff:', error));
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, // event from input
    index: number, // index of the staff in the staffList
    field: string // the field to be updated (e.g., 'password', 'username')
  ) => {
    const { value } = e.target; // Get the new value from the input
  
    // Create a copy of the staffList
    const updatedStaffList = [...staffList];
  
    // Update the specific field for the staff at the given index
    updatedStaffList[index] = {
      ...updatedStaffList[index],
      [field]: value, // Dynamically update the field (e.g., 'password': newValue)
    };
  
    // Set the updated list back to state (if using React state)
    setStaff(updatedStaffList);
  };

  const handleEditStaff = (id: string) => {
    const staff = staffList.find(value => value.id === id);

  if (staff) { // Ensure the staff member exists
    staff.disabled = !staff.disabled; // Toggle the disabled property
    setStaff([...staffList]);

    fetch(`http://localhost:5001/api/staff/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(staff),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  }
  }

  // Handle adding new item
  const handleAddStaff = () => {
    fetch('http://localhost:5001/api/staff', {
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
        setNewStaff({ id: '', type: '', name: '', username: '', password: '', disabled: true }); // Reset form
      })
      .catch(error => console.error('Error adding staff item:', error));
  };

  // Handle removing item
  const handleRemoveStaff = (id: string) => {
    fetch(`http://localhost:5001/api/staff/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setStaff(prevStaff => prevStaff.filter(item => item.id !== id));
        } else {
          console.error('Error removing item:', response.status);
        }
      })
      .catch(error => console.error('Error removing staff item:', error));
  };

  return (
    <div style={{ width: '150vh', height: '100%', backgroundColor: 'white' }}>
      {/* Navigation Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1400 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontSize: '1.25rem' }}>
            Pharmacy Manager<br></br>
            UserName {/* FIXME make dynamic */}
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
          {staffList.map((staff, index) => (
            <ListItem
              key={staff.id}
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
                  disabled={staff.disabled}
                  label="Type"
                  value={staff.type}
                  onChange={(e) => handleInputChange(e, index, 'type')}
                  variant="outlined"
                  size="small"
                  sx={{ width: '15%' }}
                />
                <TextField
                  disabled={staff.disabled}
                  label="ID"
                  value={staff.id}
                  onChange={(e) => handleInputChange(e, index, 'id')}
                  variant="outlined"
                  size="small"
                  sx={{ width: '8%' }}
                />
                <TextField
                  disabled={staff.disabled}
                  label="Name"
                  value={staff.name}
                  onChange={(e) => handleInputChange(e, index, 'name')}
                  variant="outlined"
                  size="small"
                  sx={{ width: '20%' }}
                />
                <TextField
                  disabled={staff.disabled}
                  label="Username"
                  value={staff.username}
                  onChange={(e) => handleInputChange(e, index, 'username')}
                  variant="outlined"
                  size="small"
                  sx={{ width: '20%' }}
                />
                <TextField
                  disabled={staff.disabled}
                  label="Password"
                  value={staff.password}
                  onChange={(e) => handleInputChange(e, index, 'password')}
                  variant="outlined"
                  size="small"
                  sx={{ width: '20%' }}
                />
              </Box>

              {/* Action buttons */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton aria-label="edit" color="primary" onClick={(e) => handleEditStaff(staff.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="delete" color="secondary" onClick={() => handleRemoveStaff(staff.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label="unlock" color="default" >
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
