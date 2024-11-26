import React, { useEffect, useState } from 'react';
import './Inventory.css';
import { Box, Typography, Container, AppBar, Toolbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InventoryItem, FiscalItem, PharmacyDetails } from '../../interfaces';
import { useUserContext } from '../UserContext'
import { isTemplateHead } from 'typescript';

function Inventory() {
  const user = useUserContext().user;
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [FiscalData, setFiscalData] = useState<FiscalItem[]>([]);
  const [PharmacyDetail, setPharmacyDetails] = useState<PharmacyDetails>();
  const [newItem, setNewItem] = useState<InventoryItem>({ id: '', name: '', amount: 0, supplier: '', price_per_quantity: 0.0, expiration_date: '' });
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState('');
  const [editAmount, setEditAmount] = useState(0);
  const [editPrice, setEditPrice] = useState(0);
  const [editExpiration, setEditExpiration] = useState('');

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

  // Function to open dialog with the selected item
  const handleOpenEditDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditAmount(item.amount);
    setEditPrice(item.price_per_quantity);
    setEditExpiration(item.expiration_date);
    setOpenEditDialog(true);
  };

  // Function to close dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditAmount(0);
    setEditPrice(0);
    setEditExpiration('');
    //TODO: fetch the server when you close this dialogue
  };

  // Function to handle the purchase
  const handlePurchase = () => {
    if (selectedItem && purchaseQuantity) {
      const purchaseDetails = {
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        quantityPurchased: purchaseQuantity,
        supplier: selectedItem.supplier,
        pricePerUnit: selectedItem.price_per_quantity
      };

      fetch('http://localhost:5001/api/fiscal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseDetails),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Purchase recorded:', data);
          handleCloseDialog();
        })
        .catch(error => {
          console.error('Error recording purchase:', error);
        });
    }
  };

  const handleEdit = () => {
    if (selectedItem) {
      const editedItemDetails = {
        id: selectedItem.id,
        name: selectedItem.name,
        amount: editAmount,
        supplier: selectedItem.supplier,
        price_per_quantity: editPrice,
        expiration_date: editExpiration,
      };

      fetch(`http://localhost:5001/api/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedItemDetails),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Inventory item updated:', data);
          handleCloseEditDialog(); // Close the dialog after saving
        })
        .catch(error => {
          console.error('Error updating inventory item:', error);
        });
    }
  };

  const addReportHeader = (doc: jsPDF, reportTitle: string) => {
    // Set pharmacy data and current date
    const pharmacyName = PharmacyDetail?.name || "Pharmacy Name";
    const pharmacyWebsite = PharmacyDetail?.website || "www.examplepharmacy.com";
    const pharmacyAddress = PharmacyDetail?.address || "123 Main St, City, State";
    const pharmacyPhone = PharmacyDetail?.phoneNumber || "(123) 456-7890";
    const pharmacyOwner = PharmacyDetail?.owner || "John Doe";
    const openingTime = PharmacyDetail?.openingTime || "9:00 AM";
    const closingTime = PharmacyDetail?.closingTime || "6:00 PM";
    const currentDate = new Date().toLocaleDateString();

    // Center the pharmacy name and report title
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(reportTitle);
    const pharmacyWidth = doc.getTextWidth(pharmacyName);

    // Add the pharmacy name, title, and date at the top of the page
    doc.setFontSize(16);
    doc.text(pharmacyName, (pageWidth - pharmacyWidth) / 2, 20);  // Pharmacy Name centered

    doc.setFontSize(14);
    doc.text(reportTitle, (pageWidth - titleWidth) / 2, 30);  // Report title centered

    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 14, 50);  // Date on the left

    // Add additional pharmacy details under the header
    doc.setFontSize(12);
    doc.text(`Website: ${pharmacyWebsite}`, 14, 60);
    doc.text(`Address: ${pharmacyAddress}`, 14, 65);
    doc.text(`Phone: ${pharmacyPhone}`, 14, 70);
    doc.text(`Owner: ${pharmacyOwner}`, 14, 75);
    doc.text(`Hours: ${openingTime} - ${closingTime}`, 14, 80);
  };

  const handleInventoryReport = () => {
    const doc = new jsPDF();

    // Add the shared header
    addReportHeader(doc, "Inventory List");

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

    // Generate the table below the header
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 90,  // Adjust Y position to start after the header
    });

    // Save the generated PDF
    doc.save("inventory_list.pdf");
  };

  const handleFiscalReport = () => {
    const doc = new jsPDF();

    // Add the shared header
    addReportHeader(doc, "Fiscal Report");

    // Fetch and generate the table with fiscal data
    fetch('http://localhost:5001/api/fiscal')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: FiscalItem[]) => {
        console.log('Fiscal data:', data);

        // Define table columns and rows
        const columns = ["ID", "Name", "Price Per Unit", "Quantity Purchased", "Supplier"];
        const rows = data.map(item => [
          item.itemId,
          item.itemName,
          `$${item.pricePerUnit}`,
          item.quantityPurchased,
          item.supplier,
        ]);

        // Generate the table below the header
        autoTable(doc, {
          head: [columns],
          body: rows,
          startY: 90,  // Adjust Y position to start after the header
        });

        // Save the generated PDF
        doc.save("fiscal_report.pdf");
      })
      .catch(error => console.error('Error fetching fiscal data:', error));
  };

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

  const handleNavigateManager = () => {
    navigate("/ManagerMain");
  };

  const handleNavigateStaffOverview = () => {
    navigate("/StaffOverview");
  };

  return (
    <div className="inventory-background" style={{ alignItems: "start" }}>
      {/* Fixed AppBar at the top */}
      <AppBar position="fixed" sx={{ backgroundColor: "#00796b" }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Buttons Container */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
            <Button color="inherit" onClick={handleNavigateManager}>
              Home
            </Button>
            <Button color="inherit" onClick={handleNavigateStaffOverview}>
              Staff Overview
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>

          {/* Centered Typography */}
          <Typography variant="h6" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', }}>
            Inventory Management
          </Typography>
        </Toolbar>
      </AppBar>



      {/* Add padding to account for the fixed AppBar */}
      <Box component="section" className="box-background" sx={{ p: 2, mt: 8, alignItems: 'start', height: '80vh', }}>
        <Container component="main" style={{ padding: '2rem', maxWidth: '1500px' }}> {/* Increased maxWidth */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <Typography variant="h5" gutterBottom>
              Pharmacy Inventory
            </Typography>
            <div>
              <Button variant="contained" color="primary" onClick={handleFiscalReport} style={{ marginRight: '10px' }}>
                Generate Fiscal Report
              </Button>
              <Button variant="contained" color="primary" onClick={handleInventoryReport}>
                Generate Inventory Report
              </Button>
            </div>
          </div>
          {/* Inventory Table */}
          <TableContainer component={Paper} style={{ alignItems: "start" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#00796b" }}>
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
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenDialog(item)}
                        >
                          Purchase
                        </Button>
                        <Button
                          variant="contained"
                          color="info"
                          onClick={() => handleOpenEditDialog(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ marginRight: '1rem' }}
                          variant="contained"
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
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

        {/* purchase item dialogue */}
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

        {/* edit item dialogue */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="amount"
              label="Amount"
              name="amount"
              type="number"
              fullWidth
              variant="standard"
              value={editAmount}
              onChange={(e) => setEditAmount(Number(e.target.value))}
            />
            <TextField
              margin="dense"
              id="price_per_quantity"
              label="Price Per Quantity"
              name="price_per_quantity"
              type="number"
              fullWidth
              variant="standard"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
            />
            <TextField
              margin="dense"
              id="expiration_date"
              label="Expiration Date"
              name="expiration_date"
              type="date"
              fullWidth
              variant="standard"
              value={editExpiration}
              onChange={(e) => setEditExpiration(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f1f1f1' }}>
          <Typography variant="body2" color="textSecondary">
            &copy; 2024 Pharmacy System. All rights reserved.
          </Typography>
        </footer>
      </Box>
    </div >
  );

}

export default Inventory;
