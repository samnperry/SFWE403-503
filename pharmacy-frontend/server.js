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

/* Paths ***************************************/
// Path to the inventory.json file
const inventoryFilePath = path.join(__dirname, 'inventory.json');
console.log('Inventory file path:', inventoryFilePath);

// Path to the inventory.json file
const staffFilePath = path.join(__dirname, 'staff.json');
console.log('Staff file path:', staffFilePath);

// Path to the pharmacy.json file
const pharmacyFilePath = path.join(__dirname, 'pharmacy.json');
console.log('Purchase file path:', pharmacyFilePath);

/* Gets ****************************************/
// Get the current inventory
app.get('/api/inventory', (req, res) => {
  fs.readFile(inventoryFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading inventory file' });
    }
    res.json(JSON.parse(data));
  });
});

app.get('/api/staff', (req, res) => {
  fs.readFile(staffFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading staff file' });
    }
    res.json(JSON.parse(data));
  });
});

// Get the current pharmacy data
app.get('/api/pharmacy', (req, res) => {
  fs.readFile(pharmacyFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading pharmacy file' });
    }
    res.json(JSON.parse(data));
  });
});

/* Put/Patch (Edit) *********************************/
// Update the single pharmacy details
app.put('/api/pharmacy', (req, res) => {
  const updatedPharmacy = req.body;

  // Read the existing pharmacy data
  fs.readFile(pharmacyFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading pharmacy file' });
    }

    // Since there's only one object, we directly update it
    fs.writeFile(pharmacyFilePath, JSON.stringify(updatedPharmacy, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to pharmacy file' });
      }
      res.json({ message: 'Pharmacy details updated successfully', pharmacy: updatedPharmacy });
    });
  });
});


/* Post ****************************************/
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

app.post('/api/staff', (req, res) => {
  const newItem = req.body;

  fs.readFile(staffFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading staff file' });
    }

    const staff = JSON.parse(data);
    staff.push(newStaff);

    fs.writeFile(staffFilePath, JSON.stringify(staff, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to staff file' });
      }
      res.json({ message: 'Staff added successfully', staff });
    });
  });
});

/* Put *****************************************/
//Update inventory by ID

// Update a staff member by ID
app.put('/api/staff/:id', (req, res) => {
  const staffId = req.params.id; // Get the ID from the URL
  const updatedStaffData = req.body; // Get the new data from the request body

  // Read the current staff data from the JSON file
  fs.readFile(staffFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading staff file' });
    }

    let staff = JSON.parse(data); // Parse the current staff data

    // Find the index of the staff member to update
    const staffIndex = staff.findIndex(item => item.id === staffId);
    if (staffIndex === -1) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Update the staff member's data with the new values from the request body
    staff[staffIndex] = { ...staff[staffIndex], ...updatedStaffData };

    // Write the updated staff data back to the JSON file
    fs.writeFile(staffFilePath, JSON.stringify(staff, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to staff file' });
      }
      res.json({ message: 'Staff member updated successfully', staff });
    });
  });
});


/* Delete **************************************/
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

app.delete('/api/staff/:id', (req, res) => {
  const staffId = req.params.id;

  fs.readFile(staffFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading staff file' });
    }

    let staff = JSON.parse(data);
    staff = staff.filter(item => item.id !== staffId);

    fs.writeFile(staffFilePath, JSON.stringify(staff, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to staff file' });
      }
      res.json({ message: 'Staff removed successfully', staff });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
