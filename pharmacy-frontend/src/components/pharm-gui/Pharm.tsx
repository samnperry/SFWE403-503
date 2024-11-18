import React, { useState, useEffect } from "react";
import "./Pharm.css";
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

interface Medication {
  id: string;
  name: string;
  amount: string; // Amount is stored as a string in inventory.json
  supplier: string;
  price_per_quantity: number;
  expiration_date: string;
}

function Pharm() {
  const user = useUserContext().user;
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<{ medication: Medication; quantity: number }[]>(
    []
  );

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/inventory");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const medicationsData: Medication[] = await response.json();
        setMedications(medicationsData);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  const handleAddToCart = () => {
    if (!selectedMedicationId || quantity < 1) return;

    const medication = medications.find(
      (med) => med.id === selectedMedicationId
    );

    if (!medication) return;

    const availableAmount = parseInt(medication.amount);

    // Check if the quantity requested is available
    if (quantity > availableAmount) {
      alert(
        `Only ${availableAmount} units of ${medication.name} are available.`
      );
      return;
    }

    // Add to cart
    setCart((prevCart) => [...prevCart, { medication, quantity }]);

    // Reset selection
    setSelectedMedicationId("");
    setQuantity(1);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleProcessPurchase = async () => {
    try {
      // Prepare data to send to the backend
      const purchaseData = cart.map((item) => ({
        medication_id: item.medication.id,
        quantity: item.quantity,
      }));

      const response = await fetch("http://localhost:5001/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ purchaseItems: purchaseData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // Optionally, you can get the response data
      const result = await response.json();

      // Update the inventory state to reflect the new quantities
      setMedications((prevMedications) =>
        prevMedications.map((med) => {
          const purchasedItem = cart.find(
            (item) => item.medication.id === med.id
          );
          if (purchasedItem) {
            const newAmount = parseInt(med.amount) - purchasedItem.quantity;
            return { ...med, amount: newAmount.toString() };
          }
          return med;
        })
      );

      // Clear the cart
      setCart([]);

      alert("Purchase processed successfully!");
    } catch (error: any) {
      console.error("Error processing purchase:", error);
      alert(`An error occurred while processing the purchase: ${error.message}`);
    }
  };

  const handleNavigateHome = () => {
    navigate("/Pharm");
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

  const handleProfile = () => navigate("/ProfilePage");

  return (
    <div className="pharm-background">
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pharmacy Page
          </Typography>
          <Button color="inherit" onClick={handleNavigateHome}>
            Home
          </Button>
          <Button color="inherit" onClick={handleProfile}>
            Profile
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      {/* Spacer to prevent content from being hidden behind the AppBar */}
      <Toolbar />

      <Container maxWidth="md">
        <Box mt={5} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Process Prescription Items
          </Typography>
          <Typography variant="body1" gutterBottom>
            Select medications and add them to the purchase list.
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
          >
            <FormControl fullWidth margin="normal">
              <InputLabel id="medication-label">Medication</InputLabel>
              <Select
                labelId="medication-label"
                value={selectedMedicationId}
                label="Medication"
                onChange={(e) =>
                  setSelectedMedicationId(e.target.value as string)
                }
              >
                {medications.map((med) => (
                  <MenuItem key={med.id} value={med.id}>
                    {med.name} (Available: {med.amount})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Quantity"
              variant="outlined"
              margin="normal"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              inputProps={{ min: 1 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!selectedMedicationId || quantity < 1}
            >
              Add to Cart
            </Button>
          </form>

          {/* Display Cart */}
          {cart.length > 0 && (
            <Box mt={5}>
              <Typography variant="h5" gutterBottom>
                Purchase List
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="cart table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {item.medication.name}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">
                          <Button
                            color="secondary"
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Button
                variant="contained"
                color="success"
                onClick={handleProcessPurchase}
                style={{ marginTop: "1rem" }}
              >
                Process Purchase
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
}

export default Pharm;
