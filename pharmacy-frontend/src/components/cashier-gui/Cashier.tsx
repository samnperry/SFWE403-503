import React, { useState, useEffect } from "react";
import "./Cashier.css";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import { Patient, Prescription } from "../../interfaces";

interface Item {
  id: string;
  name: string;
  amount: string; // Stock amount as a string in inventory.json
  supplier: string;
  price_per_quantity: string; // Price per item as a string
  expiration_date: string;
}

interface CartItem {
  item: Item;
  quantity: number;
}

function Cashier() {
  const user = useUserContext().user;
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<Item[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedPrescriptionName, setSelectedPrescriptionName] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<number>(-1);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([]);

  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [pricePerItem, setPricePerItem] = useState('');

  // Fetch inventory from the server
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/inventory");
        if (!response.ok) throw new Error("Error fetching inventory.");
        const data: Item[] = await response.json();
        setInventory(data);
      } catch (error) {
        console.error(error);
        alert("Could not fetch inventory.");
      }
    };

    fetchInventory();
  }, []);

  // Fetch patients from the server
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/patients");
        if (!response.ok) throw new Error("Error fetching patients.");
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (error) {
        console.error(error);
        alert("Could not fetch patients.");
      }
    };

    fetchPatients();
  }, []);

  // Update total cost whenever cart changes
  useEffect(() => {
    const calculateTotal = cart.reduce(
      (sum, cartItem) => sum + parseFloat(cartItem.item.price_per_quantity) * cartItem.quantity,
      0
    );
    setTotalCost(calculateTotal);
  }, [cart]);

  useEffect(() => {
    if (selectedPatientId) {
      const selectedPatient = patients.find(
        (patient) => patient.id === selectedPatientId
      );
      const prescriptions = selectedPatient ? selectedPatient.prescriptions : [];
      setPatientPrescriptions(prescriptions);
    } else {
      setPatientPrescriptions([]); // Clear prescriptions when no patient is selected
    }
  }, [selectedPatientId]);

  useEffect(() => {
    if (selectedPrescriptionName) {
      const selectedPrescription = patientPrescriptions.find(
        (prescription) => prescription.name === selectedPrescriptionName
      );
      setQuantity(selectedPrescription?.amount || 0); // Set quantity to amount or 0 if not found
    } else {
      setQuantity(0); // Reset quantity if no prescription is selected
    }
  }, [selectedPrescriptionName]); // Trigger effect whenever selectedPrescriptionName changes

  const handleAddToCart = () => {
    const item = inventory.find((invItem) => invItem.name === selectedPrescriptionName);
    if (!item) {
      alert(`${selectedPrescriptionName} not found in inventory`)
      return
    };

    const availableAmount = parseInt(item.amount);
    if (quantity > availableAmount) {
      alert(`Only ${availableAmount} units of ${item.name} are available.`);
      return;
    }

    const existingCartItem = cart.find((cartItem) => cartItem.item.id === selectedItemId);
    if (existingCartItem) {
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.item.id === selectedItemId
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { item, quantity }]);
    }
    
    setSelectedItemId("");
    setQuantity(1);
  };

  const handleNonDrug = () => {
  // Validate inputs
  if (!itemName || !amount || !pricePerItem) {
    alert("Please fill out all fields for the non-prescription item.");
    return;
  }

  const parsedAmount = parseInt(amount, 10);
  const parsedPrice = parseFloat(pricePerItem);

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    alert("Please enter a valid amount (a positive number).");
    return;
  }

  if (isNaN(parsedPrice) || parsedPrice <= 0) {
    alert("Please enter a valid price per item (a positive number).");
    return;
  }

  // Create a new item
  const newItem: Item = {
    id: Date.now().toString(), // Generate a unique ID
    name: itemName,
    amount: parsedAmount.toString(),
    supplier: "Unknown", // Default value for supplier
    price_per_quantity: parsedPrice.toString(),
    expiration_date: "N/A", // Default value for expiration date
  };

  // Check if the item is already in the cart
  const existingCartItem = cart.find((cartItem) => cartItem.item.name === newItem.name);

  if (existingCartItem) {
    // Update quantity if item exists
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.item.name === newItem.name
          ? { ...cartItem, quantity: cartItem.quantity + parsedAmount }
          : cartItem
      )
    );
  } else {
    setCart((prevCart) => [...prevCart, { item: newItem, quantity: parsedAmount }]);
  }

  // Reset the input fields
  setItemName("");
  setAmount("");
  setPricePerItem("");
};

  

  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.item.id !== id));
  };

  const handleCompletePurchase = () => {
    updateFilledPrescriptions();
    setCart([]);
    setSelectedPatientId(-1);
    setSelectedPrescriptionName("");
    setTotalCost(0);
    alert("Purchase completed successfully!");
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/patients");
        if (!response.ok) throw new Error("Error fetching patients.");
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (error) {
        console.error(error);
        alert("Could not fetch patients.");
      }
    };
    fetchPatients();


  };

  const updateFilledPrescriptions = async () => {
    if (!selectedPatientId) {
      console.error("No patient selected.");
      return;
    }

    try {
      // Create a copy of patientPrescriptions to modify
      const updatedPrescriptions = patientPrescriptions.map((prescription) => {
        const cartItemMatch = cart.find((item) => item.item.name === prescription.name);
        if (cartItemMatch) {
          return { ...prescription, filled: false }; // Update `filled` to `false`
        }
        return prescription; // Leave unchanged if no match
      });

      const updatedInventory = inventory.map(async (inventoryItem) => {
        // Iterate over each cart item and check if there's a match with the inventory item
        const cartItemMatch = cart.find((cartItem) => cartItem.item.name === inventoryItem.name);

        if (cartItemMatch) {
          // If a match is found, decrease the inventory amount by the quantity in the cart
          const updatedAmount = Number(inventoryItem.amount) - cartItemMatch.quantity;

          // Ensure the inventory doesn't go below zero
          const newAmount = Math.max(updatedAmount, 0);

          // Send a PUT request to update the inventory on the server
          await fetch(`http://localhost:5001/api/inventory/${cartItemMatch.item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: newAmount }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to update inventory');
              }
              console.log(`Updated inventory for ${inventoryItem.name}: ${newAmount}`);
            })
            .catch((error) => {
              console.error('Error updating inventory:', error);
            });

          // Return the updated inventory item with the new amount
          return { ...inventoryItem, amount: newAmount };
        }

        // If no match, return the inventory item unchanged
        return inventoryItem;
      });

      // Wait for all async fetch operations to complete
      Promise.all(updatedInventory)
        .then((updatedInventoryItems) => {
          console.log('All inventory items updated:', updatedInventoryItems);
        })
        .catch((error) => {
          console.error('Error updating inventory:', error);
        });

      // Prepare the updated data object to send to the server
      const updatedPatientData = {
        prescriptions: updatedPrescriptions
      };

      // Make a PUT request to update the prescriptions on the server
      const response = await fetch(`http://localhost:5001/api/patients/${selectedPatientId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPatientData),
      });

      if (!response.ok) {
        throw new Error("Failed to update prescriptions");
      }

      const data = await response.json();
      console.log("Prescriptions updated successfully:", data);
    } catch (error) {
      console.error("Error updating prescriptions:", error);
    }
  };

  const handleNavigateHome = () => navigate("/Cashier");
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

  return (
    <div style={{ alignItems: "start" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cashier Page
          </Typography>
          <Button color="inherit" onClick={handleNavigateHome}>
            Home
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />

      <Container maxWidth="lg" style={{height: "80vh", alignItems: "start", display: 'block', marginTop: '20px' }}>

        <Typography variant="h3" gutterBottom>
          Patient Cart
        </Typography>

        <Typography variant="h5" gutterBottom>
          Filled Prescriptions
        </Typography>

        {/* Select Patients from Patients */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="patient-label">Patient</InputLabel>
          <Select
            fullWidth
            labelId="patient-label"
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value as number)}
          >
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select Items from Inventory */}
        <FormControl fullWidth margin="normal" disabled={selectedPatientId === -1}>
          <InputLabel id="item-label">Item</InputLabel>
          <Select
            fullWidth
            labelId="item-label"
            value={selectedPrescriptionName}
            onChange={(e) => setSelectedPrescriptionName(e.target.value as string)}
          >
            {patientPrescriptions
              .filter((prescription) => prescription.filled === true) // Filter prescriptions with `filled` true
              .map((prescription) => (
                <MenuItem key={prescription.name} value={prescription.name}>
                  {prescription.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          disabled
          type="number"
          label="Quantity"
          variant="outlined"
          margin="normal"
          value={quantity}
          inputProps={{ min: 1 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={!selectedPrescriptionName || quantity < 1}
        >
          Add prescription item to cart
        </Button>

        <Typography variant="h5" gutterBottom mt={"40px"}>
          Non-prescription items
        </Typography>

        {/* Item Name Text Area */}
        <TextField
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          multiline
          fullWidth
          margin="normal"
          variant="outlined"
        />

        {/* Amount Text Area */}
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          multiline
          fullWidth
          margin="normal"
          variant="outlined"
        />

        {/* Price per Item Text Area */}
        <TextField
          label="Price per Item"
          value={pricePerItem}
          onChange={(e) => setPricePerItem(e.target.value)}
          multiline
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <Button variant="contained" color="primary" onClick={handleNonDrug}>
          Add Non-Prescription Item
        </Button>


        {/* Cart Section */}
        <Box mt={5} maxWidth={"lg"} width={"80vw"}>
          <Typography variant="h5" gutterBottom>
            Cart
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="cart table">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((cartItem, index) => (
                  <TableRow key={index}>
                    <TableCell>{cartItem.item.name}</TableCell>
                    <TableCell>{cartItem.quantity}</TableCell>
                    <TableCell>${parseFloat(cartItem.item.price_per_quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      ${(parseFloat(cartItem.item.price_per_quantity) * cartItem.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="secondary"
                        onClick={() => handleRemoveFromCart(cartItem.item.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography variant="h6" mt={2}>
            Total: ${totalCost.toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            color="success"
            onClick={handleCompletePurchase}
            disabled={cart.length === 0}
            style={{ marginTop: "1rem" }}
          >
            Complete Purchase
          </Button>
        </Box>
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

export default Cashier;
