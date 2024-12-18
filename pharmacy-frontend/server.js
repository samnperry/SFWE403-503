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

// Path to the staff.json file
const staffFilePath = path.join(__dirname, 'staff.json');
console.log('Staff file path:', staffFilePath);

// Path to the pharmacy.json file
const pharmacyFilePath = path.join(__dirname, 'pharmacy.json');
console.log('Pharmacy file path:', pharmacyFilePath);

// Path to the fiscal.json file
const fiscalFilePath = path.join(__dirname, 'fiscal.json');
console.log('Fiscal file path:', fiscalFilePath);

// Path to the patients.json file
const patientFilePath = path.join(__dirname, 'patients.json');
console.log('Patient file path:', patientFilePath);

// Path to the system log file
const systemLogFilePath = path.join(__dirname, 'system-log.txt');
console.log('SystemLog file path:', systemLogFilePath);

// Path to the PurchaseHistory.txt file
const purchaseHistoryFilePath = path.join(__dirname, 'PurchaseHistory.txt');
console.log('PurchaseHistory file path:', purchaseHistoryFilePath);

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

// Get all staff members
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

// Get the current fiscal data
app.get('/api/fiscal', (req, res) => {
  fs.readFile(fiscalFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading fiscal file' });
    }
    res.json(JSON.parse(data));
  });
});

// GET: Retrieve all patients
app.get('/api/patients', (req, res) => {
  fs.readFile(patientFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading patient file' });
    }
    res.json(JSON.parse(data));
  });
});

// Get the purchase history
app.get('/api/purchases', (req, res) => {
  fs.readFile(purchaseHistoryFilePath, 'utf8', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // If the file does not exist, return an empty array
        return res.json([]);
      } else {
        return res.status(500).json({ error: 'Error reading PurchaseHistory.txt' });
      }
    }
    // Split the data by newlines and parse each JSON entry
    const purchases = data.trim().split('\n').map(line => {
      const match = line.match(/Purchase: (.+)$/);
      if (match && match[1]) {
        try {
          const purchase = JSON.parse(match[1]);
          // Ensure patientName is included
          if (!purchase.patientName) {
            purchase.patientName = 'Unknown'; // Default value if patientName is missing
          }
          return purchase;
        } catch (parseError) {
          console.error('Error parsing purchase entry:', parseError);
          return null;
        }
      }
      return null;
    }).filter(purchase => purchase !== null);
    res.json(purchases);
  });
});


/* Put/Patch (Edit) *********************************/
// Update the single pharmacy details
app.put('/api/pharmacy', (req, res) => {
  const updatedPharmacy = req.body;

  // Write the updated pharmacy data to the file
  fs.writeFile(pharmacyFilePath, JSON.stringify(updatedPharmacy, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Error writing to pharmacy file' });
    }
    res.json({ message: 'Pharmacy details updated successfully', pharmacy: updatedPharmacy });
  });
});

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

// PUT: Update an existing patient by ID
app.put('/api/patients/:id', (req, res) => {
  const patientId = Number(req.params.id); // Get the ID from the URL
  const updatedPatientData = req.body.patient.prescriptions; // Get the new data from the request body
  const patientData = req.body.patient; // Get the new data from the request body
  const pharmacist = req.body.pharmacistName; 

  fs.readFile(patientFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading patient file' });
    }

    let patients;
    try {
      patients = JSON.parse(data); // Try to parse the JSON
    } catch (parseError) {
      console.error("Error parsing patient data:", parseError);  // Log JSON parse error
      return res.status(500).json({ error: 'Error parsing patient data' });
    }

    // Find the index of the patient to update
    const patientIndex = patients.findIndex(patient => patient.id === patientId);

    if (patientIndex === -1) {
      console.error("Patient not found with ID:", patientId);  // Log if patient is not found
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update the patient's data with the new values from the request body
    patients[patientIndex] = { ...patients[patientIndex], ...updatedPatientData };
    // Generate the log entry by filtering and listing filled prescriptions
    const filledPrescriptions = patientData.prescriptions
      .filter(prescription => prescription.filled)
      .map(prescription => `${prescription.name} (amount: ${prescription.amount})`)
      .join(", ");

    const logEntry = `Date: ${new Date().toISOString()} - Prescriptions filled for patient ${patientData.name} by ${pharmacist.name}: ${filledPrescriptions || "None"}\n`;


    fs.appendFile(systemLogFilePath, logEntry, (err) => {
      if (err) {
        console.error('Error writing to system log file:', err);
      }
    });

    fs.writeFile(patientFilePath, JSON.stringify(patients, null, 2), err => {
      if (err) {
        console.error("Error writing to patient file:", err);  // Log error if file write fails
        return res.status(500).json({ error: 'Error writing to patient file' });
      }
      res.json({ message: 'Patient updated successfully', patients });
    });
  });
});

// PUT: Update an inventory item by ID
app.put('/api/inventory/:id', (req, res) => {
  const updatedItem = req.body;  // Get the updated item data from the request body
  const itemId = req.params.id;  // Get the ID of the item to update from the URL params

  fs.readFile(inventoryFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading inventory file' });
    }

    let inventory = JSON.parse(data);

    // Find the index of the item with the given ID
    const itemIndex = inventory.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Update the item at the found index
    inventory[itemIndex] = { ...inventory[itemIndex], ...updatedItem };

    // Save the updated inventory back to the file
    fs.writeFile(inventoryFilePath, JSON.stringify(inventory, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to inventory file' });
      }

      // Log the update to the system log
      const logEntry = `Date: ${new Date().toISOString()} - Inventory updated: ${JSON.stringify(inventory[itemIndex])}\n`;
      fs.appendFile(systemLogFilePath, logEntry, (err) => {
        if (err) {
          console.error('Error writing to system log file:', err);
        }
      });

      // Respond with a success message
      res.json({ message: 'Item updated successfully', updatedItem: inventory[itemIndex] });
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

      // Write to the system log file
      const logEntry = `Date: ${new Date().toISOString()} - New inventory added: ${JSON.stringify(newItem)}\n`;
      fs.appendFile(systemLogFilePath, logEntry, (err) => {
        if (err) {
          console.error('Error writing to system log file:', err);
        }
      });

      res.json({ message: 'Item added successfully', inventory });
    });
  });
});

// Add a new staff member
app.post('/api/staff', (req, res) => {
  const newStaff = req.body;

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

// Add a new fiscal record (Purchase)
app.post('/api/fiscal', (req, res) => {
  const newPurchase = req.body; // Get the purchase data from the request body

  // Read the current fiscal data from the JSON file
  fs.readFile(fiscalFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading fiscal file' });
    }

    let fiscalData = JSON.parse(data); // Parse the current fiscal data
    fiscalData.push(newPurchase); // Add the new purchase to the data array

    // Write the updated fiscal data back to the JSON file
    fs.writeFile(fiscalFilePath, JSON.stringify(fiscalData, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to fiscal file' });
      }

      // Write to the system log file
      const logEntry = `Date: ${new Date().toISOString()} - New purchase added: ${JSON.stringify(newPurchase)}\n`;
      fs.appendFile(systemLogFilePath, logEntry, (err) => {
        if (err) {
          console.error('Error writing to system log file:', err);
        }
      });

      res.json({ message: 'Purchase recorded successfully', newPurchase });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile(staffFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading staff file' });
    }

    let staff = JSON.parse(data);

    // Find the user with matching username
    const userIndex = staff.findIndex((user) => user.username === username);

    if (userIndex !== -1) {
      let user = staff[userIndex];

      // Check if user is locked
      if (user.locked) {
        // Write to the system log file
        const logEntry = `Date: ${new Date().toISOString()} - Locked Login Attempted by User: ${username}\n`;
        fs.appendFile(systemLogFilePath, logEntry, (err) => {
          if (err) {
            console.error('Error writing to system log file:', err);
          }
        });
        ////
        return res.status(403).json({ error: 'User account is locked' });
      }

      if (user.password === password) {
        // Write to the system log file
        const logEntry = `Date: ${new Date().toISOString()} - Successful Login for User: ${username}\n`;
        fs.appendFile(systemLogFilePath, logEntry, (err) => {
          if (err) {
            console.error('Error writing to system log file:', err);
          }
        });
        ////
        // Successful login, reset attempt count
        staff[userIndex].attempted = 0;
      } else {
        // Incorrect password, increment attempt count
        // Write to the system log file
        const logEntry = `Date: ${new Date().toISOString()} - Unsuccessful Login Attempt by User: ${username}\n`;
        fs.appendFile(systemLogFilePath, logEntry, (err) => {
          if (err) {
            console.error('Error writing to system log file:', err);
          }
        });
        ////
        staff[userIndex].attempted += 1;

        // Check if attempts exceed 5
        if (staff[userIndex].attempted >= 5) {
          staff[userIndex].locked = true; // Lock the user account
        }
      }

      // Save updated user info back to the staff file
      fs.writeFile(staffFilePath, JSON.stringify(staff, null, 2), (writeErr) => {
        if (writeErr) {
          return res.status(500).json({ error: 'Error writing to staff file' });
        }

        if (staff[userIndex].locked) {
          return res.status(403).json({ error: 'User account has been locked due to multiple failed attempts' });
        } else if (user.password === password) {
          const { password, ...userWithoutPassword } = staff[userIndex];
          res.json({ user: userWithoutPassword }); // Successful login
        } else {
          res.status(401).json({ error: 'Invalid username or password' });
        }
      });

    } else {
      // Username not found
      res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const { user } = req.body; // Expecting a user object in the request body
  console.log(JSON.stringify(user));
  if (!user || !user.name) {
    return res.status(400).json({ error: 'Invalid user object' });
  }

  // Write the logout event to the system log file
  const logEntry = `Date: ${new Date().toISOString()} - User "${user.name}" of type "${user.type}" has successfully logged out.\n`;

  fs.appendFile(systemLogFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error writing to system log file:', err);
      return res.status(500).json({ error: 'Unable to process logout request' });
    }

    // Redirect the user to the login page
    res.status(200).json({ message: 'Logout successful. Redirecting to login page...', redirect: '/LoginPage' });
  });
});

// POST: Add a new patient
app.post('/api/patients', (req, res) => {
  const newPatient = req.body;

  fs.readFile(patientFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading patient file' });
    }

    let patients = JSON.parse(data);
    patients.push(newPatient);

    fs.writeFile(patientFilePath, JSON.stringify(patients, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to patient file' });
      }
      res.json({ message: 'Patient added successfully', patients });
    });
  });
});

// POST: Add to purcahse history log
app.post('/api/purchases', (req, res) => {
  const newPurchase = req.body; // Get the purchase data from the request body
  
  // Write the purchase to PurchaseHistory.txt
  const purchaseEntry = `Date: ${new Date().toISOString()} - Purchase: ${JSON.stringify(newPurchase)}\n`;
  fs.appendFile(purchaseHistoryFilePath, purchaseEntry, (err) => {
    if (err) {
      console.error('Error writing to PurchaseHistory.txt:', err);
    }
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
    const deletedItem = inventory.find((item) => item.id === itemId);
    inventory = inventory.filter(item => item.id !== itemId);

    fs.writeFile(inventoryFilePath, JSON.stringify(inventory, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to inventory file' });
      }

      // Write to the system log file
      const logEntry = `Date: ${new Date().toISOString()} - Inventory removed: ${JSON.stringify(deletedItem)}\n`;
      fs.appendFile(systemLogFilePath, logEntry, (err) => {
        if (err) {
          console.error('Error writing to system log file:', err);
        }
      });

      res.json({ message: 'Item removed successfully', inventory });
    });
  });
});

// Remove a staff member by ID
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

// Remove a patient by name using a query parameter
app.delete('/api/patients', (req, res) => {
  const patientName = req.query.name?.toLowerCase();

  if (!patientName) {
    return res.status(400).json({ error: 'Patient name is required' });
  }

  fs.readFile(patientFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading patient file' });
    }

    let patients = JSON.parse(data);

    // Filter out the patient by name (case-insensitive comparison)
    const updatedPatients = patients.filter(patient => patient.name.toLowerCase() !== patientName);

    // Check if any patient was removed
    if (patients.length === updatedPatients.length) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Write the updated patient list to the file
    fs.writeFile(patientFilePath, JSON.stringify(updatedPatients, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to patient file' });
      }
      res.json({ message: 'Patient removed successfully', patients: updatedPatients });
    });
  });
});

/* Rewrite **************************************/
// API endpoint to delete all contents of the JSON file and rewrite with a new array
app.put('/api/rewrite/staff', (req, res) => {
  const newArray = req.body;

  if (!Array.isArray(newArray)) {
    return res.status(400).json({ error: 'Input must be an array' });
  }

  // Overwrite the file with the new array
  fs.writeFile(staffFilePath, JSON.stringify(newArray, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error writing to file' });
    }

    res.json({ message: 'File successfully rewritten', data: newArray });
  });
});

// For Changing Password
app.get('/api/user/:username', (req, res) => {
  fs.readFile(staffFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send("Error reading user data.");
    const users = JSON.parse(data);
    const user = users.find(u => u.username === req.params.username);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found.");
    }
  });
});

// Update password
app.put('/api/user/password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  fs.readFile(staffFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).send("Error reading user data.");
    const users = JSON.parse(data);
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex === -1) {
      return res.status(400).send("User not found.");
    }
    else if (users[userIndex].password !== currentPassword) {
      return res.status(400).send("Incorrect current password.");
    }

    users[userIndex].password = newPassword;

    fs.writeFile(staffFilePath, JSON.stringify(users, null, 2), err => {
      if (err) return res.status(500).send("Error updating password.");
      res.send("Password updated successfully.");
    });
  });
});

/* Delete Purchase Record by ID ****************************************/
app.delete('/api/fiscal/:id', (req, res) => {
  const purchaseId = req.params.id; // Get the ID from the URL

  fs.readFile(fiscalFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading fiscal file' });
    }

    let fiscalData = JSON.parse(data);
    const index = fiscalData.findIndex(purchase => purchase.id === purchaseId);

    if (index === -1) {
      return res.status(404).json({ message: 'Purchase record not found' });
    }

    // Remove the record from the array
    fiscalData.splice(index, 1);

    fs.writeFile(fiscalFilePath, JSON.stringify(fiscalData, null, 2), err => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to fiscal file' });
      }
      res.json({ message: 'Purchase record deleted successfully' });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
