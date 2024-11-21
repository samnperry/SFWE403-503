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
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);

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

  // Update total cost whenever cart changes
  useEffect(() => {
    const calculateTotal = cart.reduce(
      (sum, cartItem) => sum + parseFloat(cartItem.item.price_per_quantity) * cartItem.quantity,
      0
    );
    setTotalCost(calculateTotal);
  }, [cart]);

  const handleAddToCart = () => {
    const item = inventory.find((invItem) => invItem.id === selectedItemId);
    if (!item) return;

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

  const handleRemoveFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.item.id !== id));
  };

  const handleCompletePurchase = () => {
    setCart([]);
    setTotalCost(0);
    alert("Purchase completed successfully!");
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
    <div>
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

      <Container maxWidth="md">
        <Box mt={5} textAlign="center">
          <Typography variant="h4" gutterBottom>
            Cashier - Process Non-Prescription Sales
          </Typography>

          {/* Select Items from Inventory */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="item-label">Item</InputLabel>
            <Select
              labelId="item-label"
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value as string)}
            >
              {inventory.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name} - ${parseFloat(item.price_per_quantity).toFixed(2)} (Stock: {item.amount}, Exp: {item.expiration_date})
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
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            disabled={!selectedItemId || quantity < 1}
          >
            Add to Cart
          </Button>

          {/* Cart Section */}
          <Box mt={5}>
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

            <Box mt={2}>
              <Typography variant="body1" color="textSecondary">
                Prescription functionality coming soon...
              </Typography>
            </Box>

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
