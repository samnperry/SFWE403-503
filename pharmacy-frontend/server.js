const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors package
const app = express();
const PORT = 5001;

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Specify the frontend origin
}));

// Path to the inventory.json file
const inventoryFilePath = path.join(__dirname, 'inventory.json');
console.log('Inventory file path:', inventoryFilePath);

// Get the current inventory
app.get('/api/inventory', (req, res) => {
  fs.readFile(inventoryFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading inventory file' });
    }
    res.json(JSON.parse(data));
  });
});

// Add a new inventory item
app.post('/api/inventory', (req, res) => {
  const newItem = req.body;

  fs.readFile(inventoryFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading inventory file' });
    }

    const inventory = JSON.parse(data);
    inventory.push(newItem);

    fs.writeFile(inventoryFilePath, JSON.stringify(inventory, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to inventory file' });
      }
      res.json({ message: 'Item added successfully', inventory });
    });
  });
});

// Remove an inventory item by ID
app.delete('/api/inventory/:id', (req, res) => {
  const itemId = req.params.id;

  fs.readFile(inventoryFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading inventory file' });
    }

    let inventory = JSON.parse(data);
    inventory = inventory.filter(item => item.id !== itemId);

    fs.writeFile(inventoryFilePath, JSON.stringify(inventory, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to inventory file' });
      }
      res.json({ message: 'Item removed successfully', inventory });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
