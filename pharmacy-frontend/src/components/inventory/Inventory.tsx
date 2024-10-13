import React, { useEffect, useState } from 'react';
import './Inventory.css';
import { Box, Typography, Container, AppBar, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
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
  const [newItem, setNewItem] = useState<InventoryItem>({ id: '', name: '', amount: 0, supplier: '' });
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
      .then((data: InventoryItem[]) => {
        console.log('Inventory data:', data);
        setInventory(data);
      })
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  // Handle input changes for new item
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem(prevState => ({ ...prevState, [name]: value }));
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
        setInventory(prevInventory => [...prevInventory, newItem]); // Add new item to state
        setNewItem({ id: '', name: '', amount: 0, supplier: '' }); // Reset form
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
          setInventory(prevInventory => prevInventory.filter(item => item.id !== id));
        } else {
          console.error('Error removing item:', response.status);
        }
      })
      .catch(error => console.error('Error removing inventory item:', error));
  };

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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add New Item Form */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Add New Inventory Item</Typography>
            <TextField label="ID" name="id" value={newItem.id} onChange={handleInputChange} style={{ marginRight: '1rem' }} />
            <TextField label="Name" name="name" value={newItem.name} onChange={handleInputChange} style={{ marginRight: '1rem' }} />
            <TextField label="Amount" name="amount" type="number" value={newItem.amount} onChange={handleInputChange} style={{ marginRight: '1rem' }} />
            <TextField label="Supplier" name="supplier" value={newItem.supplier} onChange={handleInputChange} style={{ marginRight: '1rem' }} />
            <Button variant="contained" color="primary" onClick={handleAddItem}>Add Item</Button>
          </Box>
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
