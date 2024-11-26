import React, { useState, useEffect, useRef } from "react";
import "./PharmacistCashier.css";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import { Patient, Prescription } from "../../interfaces";
import { jsPDF } from 'jspdf'; // Import jsPDF
import { Item, CartItem } from '../../interfaces';
import SignatureCanvas from "react-signature-canvas";

function PharmacistCashier() {
  const user = useUserContext().user;
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<Item[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPrescriptionName, setSelectedPrescriptionName] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<number>(-1);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([]);

  const [itemName, setItemName] = useState('');
  const [amount, setAmount] = useState('');
  const [pricePerItem, setPricePerItem] = useState('');

  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);
  const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);

  const [openSignaturePad, setOpenSignaturePad] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const sigPad = useRef<SignatureCanvas>(null);


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

  // Update patient prescriptions based on selected patient
  useEffect(() => {
    if (selectedPatientId !== -1) {
      const selectedPatient = patients.find(
        (patient) => patient.id === selectedPatientId
      );
      const prescriptions = selectedPatient ? selectedPatient.prescriptions : [];
      setPatientPrescriptions(prescriptions);
    } else {
      setPatientPrescriptions([]); // Clear prescriptions when no patient is selected
    }
  }, [selectedPatientId, patients]);

  // Update quantity based on selected prescription
  useEffect(() => {
    if (selectedPrescriptionName) {
      const selectedPrescription = patientPrescriptions.find(
        (prescription) => prescription.name === selectedPrescriptionName
      );
      setQuantity(selectedPrescription?.amount ? Number(selectedPrescription.amount) : 0); // Set quantity to amount or 0 if not found
    } else {
      setQuantity(0); // Reset quantity if no prescription is selected
    }
  }, [selectedPrescriptionName, patientPrescriptions]); // Trigger effect whenever selectedPrescriptionName changes

  // Handle adding prescription item to cart
  const handleAddToCart = () => {
    const item = inventory.find((invItem) => invItem.name === selectedPrescriptionName);
    if (!item) {
      alert(`${selectedPrescriptionName} not found in inventory`);
      return;
    }

    const availableAmount = parseInt(item.amount);
    if (quantity > availableAmount) {
      alert(`Only ${availableAmount} units of ${item.name} are available.`);
      return;
    }

    const existingCartItem = cart.find((cartItem) => cartItem.item.id === item.id);
    if (existingCartItem) {
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { item, quantity }]);
    }

    // Reset selections
    setSelectedPrescriptionName("");
    setQuantity(1);
  };

  const handleOpenSignaturePad = () => setOpenSignaturePad(true);
  const handleCloseSignaturePad = () => setOpenSignaturePad(false);

  // Handle adding non-prescription item to cart
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

  const handleSaveSignature = () => {
    if (sigPad.current && sigPad.current.isEmpty()) {
      alert("Please provide a signature before saving.");
    } else if (sigPad.current) {
      setSignatureData(sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
      setOpenSignaturePad(false);
    }
  };

  // Handle removing an item from the cart
  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.item.id !== id));
  };

  // Handle completing the purchase
  const handleCompletePurchase = async (checkoutType: String = "Cash") => {
    setOpenSignaturePad(true);

    // Check for expired items
    const currentDate = new Date();
    const expiredItems = cart.filter((cartItem) => {
      const expirationDateStr = cartItem.item.expiration_date;
      if (!expirationDateStr || expirationDateStr === "N/A") {
        // No expiration date, assume not expired
        return false;
      }

      const [yearStr, monthStr, dayStr] = expirationDateStr.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      // Ensure parsing was successful
      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        console.error(`Invalid expiration date format for item ${cartItem.item.name}: ${expirationDateStr}`);
        return false; // Treat invalid date formats as non-expired
      }

      const expirationDate = new Date(year, month - 1, day);

      // Compare dates
      return expirationDate < currentDate;
    });

    if (expiredItems.length > 0) {
      const expiredItemNames = expiredItems.map((item) => item.item.name).join(", ");
      alert(`Warning: The following items are expired: ${expiredItemNames}`);
      return; // Prevent purchase completion if expired items are in the cart
    }

    // Prompt the user if they want a receipt
    const wantsReceipt = window.confirm("Do you want a receipt?");

    if (wantsReceipt) {
      generateReceiptPDF(checkoutType);
    }

    // Prepare purchase data
    const purchaseData = {
      id: Date.now().toString(), // Unique ID for the purchase
      date: new Date().toISOString(),
      paymentMethod: checkoutType,
      items: cart.map(cartItem => ({
        id: cartItem.item.id,
        name: cartItem.item.name,
        quantity: cartItem.quantity,
        price: parseFloat(cartItem.item.price_per_quantity),
        total: parseFloat(cartItem.item.price_per_quantity) * cartItem.quantity,
      })),
      totalCost: totalCost,
    };

    // Send purchase data to the server
    try {
      const response = await fetch('http://localhost:5001/api/fiscal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        throw new Error('Failed to record purchase');
      }
    } catch (error) {
      console.error('Error recording purchase:', error);
      alert('An error occurred while recording the purchase.');
      return; // Exit the function if purchase recording failed
    }

    // Proceed with purchase
    await updateFilledPrescriptions();
    setCart([]);
    setSelectedPatientId(-1);
    setSelectedPrescriptionName("");
    setTotalCost(0);
    alert("Purchase completed successfully!");

    // Refresh patients data
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/patients");
        if (!response.ok) throw new Error("Error fetching patients.");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error(error);
        alert("Could not fetch patients.");
      }
    };
    fetchPatients();
  };

  // Generate PDF Receipt
  const generateReceiptPDF = (checkoutType: String) => {
    const doc = new jsPDF();

    // Set initial y position
    let yPosition = 20;

    // Add header
    doc.setFontSize(16);
    doc.text("Receipt", 10, yPosition);
    yPosition += 10;

    // Add date and payment method
    const date = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Payment Method: ${checkoutType}`, 10, yPosition);
    yPosition += 10;

    // Add items header
    doc.text("Items Purchased:", 10, yPosition);
    yPosition += 10;

    // Add table headers
    doc.setFont("helvetica", "bold");
    doc.text("Item", 10, yPosition);
    doc.text("Qty", 80, yPosition);
    doc.text("Price", 100, yPosition);
    doc.text("Total", 130, yPosition);
    doc.setFont("helvetica", "normal");
    yPosition += 10;

    // Add cart items
    cart.forEach((cartItem, index) => {
      const itemName = cartItem.item.name;
      const quantity = cartItem.quantity;
      const price = parseFloat(cartItem.item.price_per_quantity).toFixed(2);
      const total = (parseFloat(cartItem.item.price_per_quantity) * cartItem.quantity).toFixed(2);

      doc.text(itemName, 10, yPosition);
      doc.text(quantity.toString(), 80, yPosition);
      doc.text(`$${price}`, 100, yPosition);
      doc.text(`$${total}`, 130, yPosition);
      yPosition += 10;

      // Add new page if necessary
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    // Add total cost
    yPosition += 10;
    doc.setFontSize(14);
    doc.text(`Grand Total: $${totalCost.toFixed(2)}`, 10, yPosition);

    // Save the PDF
    doc.save("receipt.pdf");
  };

  // Update filled prescriptions
  const updateFilledPrescriptions = async () => {
    if (selectedPatientId === -1) {
      console.error("No patient selected.");
      return;
    }

    try {
      // Create a copy of patientPrescriptions to modify
      const updatedPrescriptions = patientPrescriptions.map((prescription) => {
        const cartItemMatch = cart.find((item) => item.item.name === prescription.name);
        if (cartItemMatch) {
          return { ...prescription, filled: true }; // Set filled to true after filling
        }
        return prescription; // Leave unchanged if no match
      });

      // Update inventory amounts
      const updatedInventoryPromises = inventory.map(async (inventoryItem) => {
        const cartItemMatch = cart.find((cartItem) => cartItem.item.id === inventoryItem.id);

        if (cartItemMatch) {
          const updatedAmount = Number(inventoryItem.amount) - cartItemMatch.quantity;
          const newAmount = Math.max(updatedAmount, 0);

          // Send a PUT request to update the inventory on the server
          await fetch(`http://localhost:5001/api/inventory/${cartItemMatch.item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: newAmount.toString() }),
          });

          // Return the updated inventory item with the new amount
          return { ...inventoryItem, amount: newAmount.toString() };
        }

        // If no match, return the inventory item unchanged
        return inventoryItem;
      });

      // Wait for all inventory updates to complete
      const updatedInventoryItems = await Promise.all(updatedInventoryPromises);
      setInventory(updatedInventoryItems); // Update the inventory state

      // Prepare the updated data object to send to the server
      const updatedPatientData = {
        prescriptions: updatedPrescriptions,
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

      // Update the local patients state
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === selectedPatientId
            ? { ...patient, prescriptions: updatedPrescriptions }
            : patient
        )
      );
    } catch (error) {
      console.error("Error updating prescriptions:", error);
    }
  };

  // Navigate to Home
  const handleNavigateHome = () => navigate("/Pharm");

  // Handle Logout
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

  // Handle viewing purchase history
  const handleViewPurchaseHistory = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/purchases');
      if (!response.ok) {
        throw new Error('Failed to fetch purchase history');
      }
      const data = await response.json();
      setPurchaseHistory(data);
      setShowPurchaseHistory(true);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
      alert('An error occurred while fetching the purchase history.');
    }
  };

  const handleClearSignature = () => sigPad.current?.clear();
  const handleNavigatePharmacistInventory = () => navigate("/PharmacistInventory");
  const handleNavigatePatients = () => navigate("/PatientManager");


  return (
    <div style={{ alignItems: "start" }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#00796b" }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={handleNavigateHome}>
            Home
          </Button>
          <Button color="inherit" onClick={handleNavigatePharmacistInventory}>
              Inventory
            </Button>
            <Button color="inherit" onClick={handleNavigatePatients}>
              Patients
            </Button>
          <Button color="inherit" onClick={handleViewPurchaseHistory}>
            Generate Report
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />

      {/* Main Container */}
      <Container maxWidth="lg" style={{ height: "80vh", alignItems: 'center', display: 'block', marginTop: '20px' }}>

        <Typography variant="h3" gutterBottom>
          Patient Cart
        </Typography>

        <Typography variant="h5" gutterBottom>
          Unfilled Prescriptions
        </Typography>

        {/* Select Patient */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="patient-label">Patient</InputLabel>
          <Select
            fullWidth
            labelId="patient-label"
            label="Patient"
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


        {/* Select Prescription Item */}
        <FormControl fullWidth margin="normal" disabled={selectedPatientId === -1}>
          <InputLabel id="item-label">Item</InputLabel>
          <Select
            fullWidth
            labelId="item-label"
            value={selectedPrescriptionName}
            onChange={(e) => setSelectedPrescriptionName(e.target.value as string)}
          >
            {patientPrescriptions
              .filter((prescription) => prescription.filled === false)
              .map((prescription) => (
                <MenuItem key={prescription.name} value={prescription.name}>
                  {prescription.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Quantity Field */}
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

        {/* Add Prescription Item to Cart Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={!selectedPrescriptionName || quantity < 1}
        >
          Add Prescription Item to Cart
        </Button>

        {/* Non-Prescription Items Section */}
        <Typography variant="h5" gutterBottom mt={"40px"}>
          Non-Prescription Items
        </Typography>

        {/* Item Name Field */}
        <TextField
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          multiline
          fullWidth
          margin="normal"
          variant="outlined"
        />

        {/* Amount Field */}
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          multiline
          fullWidth
          margin="normal"
          variant="outlined"
        />

        {/* Price per Item Field */}
        <TextField
          label="Price per Item"
          value={pricePerItem}
          onChange={(e) => setPricePerItem(e.target.value)}
          multiline
          fullWidth
          margin="normal"
          variant="outlined"
        />

        {/* Add Non-Prescription Item to Cart Button */}
        <Button variant="contained" color="primary" onClick={handleNonDrug}>
          Add Non-Prescription Item
        </Button>

        {/* Cart Section */}
        <Typography variant="h5" gutterBottom mt={"40px"}>
          Cart
        </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="cart table">
              <TableHead sx={{ backgroundColor: "#00796b" }}>
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

          {/* Checkout Buttons */}
          <Box mt={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleCompletePurchase("Cash")}
              disabled={cart.length === 0}
              style={{ marginRight: "1rem" }}
            >
              Checkout: Cash
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleCompletePurchase("Credit")}
              disabled={cart.length === 0}
              style={{ marginRight: "1rem" }}
            >
              Checkout: Credit
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleCompletePurchase("Debit")}
              disabled={cart.length === 0}
              style={{ marginRight: "1rem" }}
            >
              Checkout: Debit
            </Button>
          </Box>
      </Container>

      {/* Purchase History Dialog */}
      <Dialog
        open={showPurchaseHistory}
        onClose={() => setShowPurchaseHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Purchase History</DialogTitle>
        <DialogContent>
          {purchaseHistory.length === 0 ? (
            <Typography>No purchases found.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseHistory.map((purchase, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(purchase.date).toLocaleString()}</TableCell>
                    <TableCell>{purchase.paymentMethod}</TableCell>
                    <TableCell>
                      {purchase.items.map((item: any, idx: number) => (
                        <div key={idx}>
                          {item.name} x {item.quantity} @ ${item.price.toFixed(2)} = ${item.total.toFixed(2)}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>${purchase.totalCost.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPurchaseHistory(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Signature Pad Dialog */}
      <Dialog open={openSignaturePad} onClose={handleCloseSignaturePad} maxWidth="sm" fullWidth>
        <DialogTitle>Draw Your Signature</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <SignatureCanvas
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "sigCanvas",
            }}
            ref={sigPad}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearSignature}>Clear</Button>
          <Button onClick={handleCloseSignaturePad}>Cancel</Button>
          <Button onClick={handleSaveSignature} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PharmacistCashier;
