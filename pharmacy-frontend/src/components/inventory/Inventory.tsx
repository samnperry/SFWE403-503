import React, { useEffect, useState } from 'react';
import './Inventory.css';
import { Box, Typography, Container, AppBar, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Define the type for inventory items
interface InventoryItem {
  id: string;
  name: string;
  amount: number;
  supplier: string;
}

function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const navigate = useNavigate();

  // Fetch inventory data from the JSON file
  useEffect(() => {
    fetch('/inventory.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: InventoryItem[]) => {
        console.log('Inventory data:', data); // This logs the fetched data
        setInventory(data);
      })
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  return (
    <div className="inventory-background">
      {/* Fixed AppBar at the top */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Button color="inherit" href='/HomePage'>Home</Button>
          <Button color="inherit" onClick={() => navigate('/ManagerMain')}>Manager</Button>
          <Button color="inherit" onClick={() => navigate('/LoginPage')}>Log Out</Button>
        </Toolbar>
      </AppBar>

      {/* Add padding to account for the fixed AppBar */}
      <Box component="section" className="box-background" sx={{ p: 2, mt: 8 }}>
        <Container component="main" style={{ padding: '2rem' }}>
          <Typography variant="h5" gutterBottom>
            Pharmacy Inventory
          </Typography>

          {/* Inventory Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Supplier</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

export default Inventory;
