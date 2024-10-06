import React, { useState } from 'react';
import './ManagerMain.css'; 
import { Box, Typography, TextField, Button, Container, Grid, AppBar, Toolbar, Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

function ManagerMain() {
  const navigate = useNavigate();
  
  // State for personnel management -- TODO
  // const [personnel, setPersonnel] = useState([]);
  // const [name, setName] = useState('');
  // const [editingIndex, setEditingIndex] = useState(null);

  // const handleAddPersonnel = () => {
  //   if (editingIndex !== null) {
  //     const updatedPersonnel = [...personnel];
  //     updatedPersonnel[editingIndex] = name;
  //     setPersonnel(updatedPersonnel);
  //     setEditingIndex(null);
  //   } else {
  //     setPersonnel([...personnel, name]);
  //   }
  //   setName('');
  // };

  // const handleEditPersonnel = (index) => {
  //   setName(personnel[index]);
  //   setEditingIndex(index);
  // };

  // const handleRemovePersonnel = (index) => {
  //   const updatedPersonnel = personnel.filter((_, i) => i !== index);
  //   setPersonnel(updatedPersonnel);
  // };

  return (
    <div className='manager-background'>
      <Box component="section" className='box-background' sx={{ p: 2, border: '1px dashed grey' }}>
        {/* Navigation Bar */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Manager View
            </Typography>
            <Button color="inherit" href='/HomePage'>Home</Button>
            <Button color="inherit">Prescriptions</Button>
            <Button color="inherit">Orders</Button>
            <Button color="inherit">Profile</Button>
          </Toolbar>
        </AppBar>

        {/* Main Content Section */}
        <Container component="main" style={{ padding: '2rem' }}>
          <Typography variant="h5" gutterBottom>
            Manage Pharmacy Personnel
          </Typography>

          {/* Personnel Management Form */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Personnel Name"
                variant="outlined"
                fullWidth
                // value={name}
                // onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                color="primary"
                // onClick={handleAddPersonnel}
              >
                {/* {editingIndex !== null ? 'Update' : 'Add'} Personnel */}
              </Button>
            </Grid>
          </Grid>

          {/* Personnel List */}
          {/* <List>
            {personnel.map((person, index) => (
              <ListItem key={index}>
                <ListItemText primary={person} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditPersonnel(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleRemovePersonnel(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List> */}

          {/* Features Section */}
          <Grid container spacing={4} style={{ marginTop: '2rem' }}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} style={{ padding: '1rem' }}>
                <Typography variant="h6">Manage Prescriptions</Typography>
                <Typography variant="body2">
                  Easily view, update, or renew your prescriptions.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} style={{ padding: '1rem' }}>
                <Typography variant="h6">Track Orders</Typography>
                <Typography variant="body2">
                  Stay updated on your medication orders with real-time tracking.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={3} style={{ padding: '1rem' }}>
                <Typography variant="h6">Consultation Services</Typography>
                <Typography variant="body2">
                  Get advice from licensed pharmacists regarding your medications.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f1f1f1' }}>
          <Typography variant="body2" color="textSecondary">
            &copy; 2024 Pharmacy System. All rights reserved.
          </Typography>
        </footer>
      </Box>
    </div>
  );
}

export default ManagerMain;
