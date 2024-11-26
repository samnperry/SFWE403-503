import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, AppBar, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { InventoryItem, PharmacyDetails } from '../../interfaces'; // Assuming the interfaces file is in a parent folder
import { useUserContext } from '../UserContext'

function PharmacistInventory() {
  const user = useUserContext().user;
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [PharmacyDetail, setPharmacyDetails] = useState<PharmacyDetails>();
  const [newItem, setNewItem] = useState<InventoryItem>({ id: '', name: '', amount: 0, supplier: '', price_per_quantity: 0.0, expiration_date: '' });
  const navigate = useNavigate();

  // Fetch inventory data from the backend server
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5001/api/inventory').then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      }),
      fetch('http://localhost:5001/api/pharmacy').then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
    ])
      .then(([inventoryData, pharmacyData]: [InventoryItem[], PharmacyDetails]) => {
        // Set both inventory and pharmacy data in state
        console.log('Inventory data:', inventoryData);
        console.log('Pharmacy data:', pharmacyData);
        setInventory(inventoryData);
        setPharmacyDetails(pharmacyData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleLogout = async () => {
    try {
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

  const handleNavigateHome = () => navigate("/Pharm");
  const handleNavigatePatients = () => navigate("/PatientManager");
  const handleNavigateCashier = () => navigate("/Cashier");

  return (
    <div className="inventory-background" style={{ alignItems: "start" }}>
      {/* Fixed AppBar at the top */}
      <AppBar position="fixed" sx={{ backgroundColor: "#00796b" }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Side (Buttons) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
            <Button color="inherit" onClick={handleNavigateHome}>
              Home
            </Button>
            <Button color="inherit" onClick={handleNavigatePatients}>
              Patients
            </Button>
            <Button color="inherit" onClick={handleNavigateCashier}>
              Checkout
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>

          {/* Centered Typography */}
          <Typography variant="h6" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            Inventory Management
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Add padding to account for the fixed AppBar */}
      <Box component="section" className="box-background" sx={{ p: 2, mt: 8, alignItems: 'start', height: '80vh', width: '70vw' }}>
        <Container component="main" style={{ padding: '2rem', maxWidth: '1500px' }}> {/* Increased maxWidth */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <Typography variant="h5" gutterBottom>
              Pharmacy Inventory
            </Typography>
          </div>
          {/* Inventory Table */}
          <TableContainer component={Paper} style={{ maxHeight: '60vh', overflowY: 'auto' }} >
            <Table>
              <TableHead sx={{ backgroundColor: "#00796b" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Price Per Quantity</TableCell>
                  <TableCell>Expiration Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>${item.price_per_quantity}</TableCell>
                    <TableCell>{item.expiration_date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Container>
      </Box>
    </div>
  );

}

export default PharmacistInventory;
