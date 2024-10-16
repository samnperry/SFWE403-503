import React, { useEffect, useState } from 'react';
import './Inventory.css';
import { Box, Typography, Container, AppBar, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define the type for inventory items
interface InventoryItem {
  id: string;
  name: string;
  amount: number;
  supplier: string;
  price_per_quantity: number;
  expiration_date: string;
}

function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<InventoryItem>({ id: '', name: '', amount: 0, supplier: '', price_per_quantity: 0.0, expiration_date: '' });
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState('');


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
        setNewItem({ id: '', name: '', amount: 0, supplier: '', price_per_quantity: 0.0, expiration_date: '' }); // Reset form
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
  
  // Function to open dialog with the selected item
  const handleOpenDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  // Function to close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPurchaseQuantity('');
  };

  // Function to handle the purchase
  const handlePurchase = () => {
    if (selectedItem) {
      console.log(`Purchasing ${purchaseQuantity} of ${selectedItem.name}`);
      // Here you would typically handle the backend update
      handleCloseDialog();
    }
  };


  const handleGenerate = () => {
    const doc = new jsPDF();

    // Set the title of the PDF
    doc.text("Inventory List", 14, 10);

    // Define table columns and rows
    const columns = ["ID", "Name", "Amount", "Supplier", "Price", "Expiration Date"];
    const rows = inventory.map(item => [
      item.id,
      item.name,
      item.amount,
      item.supplier,
      `$${item.price_per_quantity}`, // Add $ sign
      item.expiration_date
    ]);

    // Ensure the autoTable method works properly
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 20,
    });

    // Save the generated PDF
    doc.save("inventory_list.pdf");
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
        <Container component="main" style={{ padding: '2rem', maxWidth: '1500px' }}> {/* Increased maxWidth */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Pharmacy Inventory
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGenerate}>
              Generate Report
            </Button>
          </div>
          {/* Inventory Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Price Per Quantity</TableCell>
                  <TableCell>Expiration Date</TableCell>
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
                    <TableCell>${item.price_per_quantity}</TableCell> {/* Add $ sign */}
                    <TableCell>{item.expiration_date}</TableCell>
                    <TableCell>
                      <Button sx={{marginRight: '1rem'}} variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                        Remove
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleOpenDialog(item)}>
                        Purchase 
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
            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}> {/* Use flex for row */}
              <TextField label="ID" name="id" value={newItem.id} onChange={handleInputChange} style={{ flex: '1' }} />
              <TextField label="Name" name="name" value={newItem.name} onChange={handleInputChange} style={{ flex: '1' }} />
              <TextField label="Amount" name="amount" type="number" value={newItem.amount} onChange={handleInputChange} style={{ flex: '1' }} />
              <TextField label="Supplier" name="supplier" value={newItem.supplier} onChange={handleInputChange} style={{ flex: '1' }} />
              <TextField label="Price Per Quantity" name="price_per_quantity" type="number" value={newItem.price_per_quantity} onChange={handleInputChange} style={{ flex: '1' }} />
              <TextField label="Expiration Date" name="expiration_date" type="date" value={newItem.expiration_date} onChange={handleInputChange} style={{ flex: '1' }} InputLabelProps={{ shrink: true }} /> {/* Date Input */}
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleAddItem}>Add Item</Button>
            </Box>
          </Box>
        </Container>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Purchase Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            value={purchaseQuantity}
            onChange={(e) => setPurchaseQuantity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handlePurchase}>Confirm Purchase</Button>
        </DialogActions>
      </Dialog>
  

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
