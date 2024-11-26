import React, { useState, useEffect } from "react";
import "./Patient.css";
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
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  IconButton,
  DialogActions,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"
import { useNavigate } from "react-router-dom";
import { InventoryItem, Patient } from '../../interfaces'; // Assuming the interfaces file is in a parent folder
import { useUserContext } from "../UserContext";

function PatientManager() {
  const currUser = useUserContext().user;
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    id: -1,
    name: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
    insurance: "",
    prescriptions: [],
  });
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient>({
    id: -1,
    name: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
    insurance: "",
    prescriptions: [],
  });
  const [newPrescription, setNewPrescription] = useState({
    name: "",
    amount: 0,
    filled: false,
  });
  const [nextID, setNextID] = useState(-1);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchAndSetPatients = async () => {
      await fetchPatients();

      // Calculate the maximum ID after fetching patients
      const maxID = patients.reduce((max, patient) => Math.max(max, patient.id), 0);
      setNextID(maxID + 1);
      setNewPatient({
        id: nextID,
        name: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        email: "",
        insurance: "",
        prescriptions: [],
      }

      )
    };

    fetchAndSetPatients();
  }, []);

  // Fetch inventory data
  useEffect(() => {
    fetch("http://localhost:5001/api/inventory")
      .then((response) => response.json())
      .then((data) => setInventory(data))
      .catch((error) => console.error("Error fetching inventory:", error));
  }, []);


  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/patients");
      if (!response.ok) throw new Error("Error fetching patients.");
      const data: Patient[] = await response.json();
      setPatients(data);
      const maxID = patients.reduce((max, patient) => Math.max(max, patient.id), 1);
      setNextID(maxID + 1);
    } catch (error) {
      console.error(error);
      alert("Could not fetch patients.");
    }
  };

  const handleAddPatient = async () => {
    const maxID = patients.reduce((max, patient) => Math.max(max, patient.id), 1);
    const newID = maxID + 1;

    try {
      const response = await fetch("http://localhost:5001/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newPatient, id: newID }),
      });

      if (!response.ok) throw new Error("Error adding patient.");

      await fetchPatients();
      setNewPatient({
        id: newID,
        name: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        email: "",
        insurance: "",
        prescriptions: [],
      });
      setNextID(newID + 1); // Set the next ID for the future addition
      alert("Patient added successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not add patient.");
    }
  };

  const [editOpen, setEditOpen] = useState(false); // State for edit dialog
  const [editingPatient, setEditingPatient] = useState<Partial<Patient>>({}); // State for the patient being edited

  // Open the edit dialog
  const handleEditOpen = (patient: Patient) => {
    setEditingPatient(patient);
    setEditOpen(true);
  };

  // Close the edit dialog
  const handleEditClose = () => {
    setEditOpen(false);
    setEditingPatient({});
  };

  // Update the patient information
  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/patients/${editingPatient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPatient),
      });

      if (!response.ok) throw new Error("Error updating patient.");

      // Update the local state
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === editingPatient.id
            ? { ...patient, ...editingPatient } // Merge the existing patient with updates
            : patient
        )
      );


      alert("Patient updated successfully.");
      handleEditClose();
    } catch (error) {
      console.error(error);
      alert("Failed to update patient.");
    }
  };


  const handleRemovePatient = async (name: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/patients?name=${name}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error removing patient.");

      // Remove the patient locally without refetching from the server
      setPatients((prevPatients) => prevPatients.filter((patient) => patient.name !== name));
      alert("Patient removed successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not remove patient.");
    }
  };

  // Open dialog and set the selected patient's data
  const handleOpenDialog = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpen(false);

    setPatients((prevList) =>
      prevList.map((patient) =>
        patient.id === selectedPatient.id
          ? { ...patient, prescriptions: selectedPatient.prescriptions }
          : patient
      )
    );

    // Fetch call to update the prescriptions for the selected patient
    if (selectedPatient) {
      fetch(`http://localhost:5001/api/patients/${selectedPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prescriptions: selectedPatient.prescriptions }), // Send the updated prescriptions
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Prescriptions updated:', data);
        })
        .catch((error) => {
          console.error('Error updating prescriptions:', error);
        });
    }

    setSelectedPatient({
      id: nextID,
      name: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      email: "",
      insurance: "",
      prescriptions: [],
    });
    setNewPrescription({
      name: "",
      amount: 0,
      filled: false,
    });
  };

  // Add a new prescription
  const handleAddPrescription = async () => {
    // Update locally
    const updatedPrescriptions = [...selectedPatient.prescriptions, newPrescription];
    setSelectedPatient(prevPatient => ({
      ...prevPatient,
      prescriptions: updatedPrescriptions,
    }));

    // Clear input
    setNewPrescription({
      name: "",
      amount: 0,
      filled: false,
    });

    try {
      // Send updated prescriptions to server
      const response = await fetch(`http://localhost:5001/api/patients/${selectedPatient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptions: updatedPrescriptions }),
      });

      if (!response.ok) throw new Error("Error updating prescriptions.");

      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === selectedPatient.id
            ? { ...patient, prescriptions: updatedPrescriptions }
            : patient
        )
      );


      alert("Prescription added successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to add prescription.");
    }
  };

  // Delete a prescription
  const handleDeletePrescription = async (index: number) => {
    // Update locally
    const updatedPrescriptions = selectedPatient.prescriptions.filter((_, i) => i !== index);
    setSelectedPatient(prevPatient => ({
      ...prevPatient,
      prescriptions: updatedPrescriptions,
    }));

    try {
      // Send updated prescriptions to server
      const response = await fetch(`http://localhost:5001/api/patients/${selectedPatient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescriptions: updatedPrescriptions }),
      });

      if (!response.ok) throw new Error("Error updating prescriptions.");

      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === selectedPatient.id
            ? { ...patient, prescriptions: updatedPrescriptions }
            : patient
        )
      );

      alert("Prescription deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete prescription.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currUser }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.redirect;
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleNavigateHome = () => navigate("/Pharm");
  const handleNavigatePharmacistInventory = () => navigate("/PharmacistInventory");
  const handleNavigateCashier = () => navigate("/Cashier");

  return (
    <div style={{ alignItems: "start" }}>
      <AppBar position="fixed" sx={{ backgroundColor: "#00796b" }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left Side (Buttons) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
            <Button color="inherit" onClick={handleNavigateHome}>
              Home
            </Button>
            <Button color="inherit" onClick={handleNavigatePharmacistInventory}>
              Inventory
            </Button>
            <Button color="inherit" onClick={handleNavigateCashier}>
              Checkout
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>

          {/* Centered Typography */}
          <Typography variant="h6" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            Patient Management
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="">
        <Container maxWidth="lg" style={{ height: "80vh", alignItems: "start", display: 'block', marginTop: '0px' }}>

          <Typography variant="h4" gutterBottom>
            Manage Patients
          </Typography>

          <Box mb={3}>
            <Typography variant="h6">Add New Patient</Typography>
            <TextField
              fullWidth
              label="Name"
              value={newPatient.name}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date of Birth"
              value={newPatient.dateOfBirth}
              onChange={(e) =>
                setNewPatient({ ...newPatient, dateOfBirth: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              value={newPatient.address}
              onChange={(e) =>
                setNewPatient({ ...newPatient, address: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              value={newPatient.phone}
              onChange={(e) =>
                setNewPatient({ ...newPatient, phone: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={newPatient.email}
              onChange={(e) =>
                setNewPatient({ ...newPatient, email: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Insurance"
              value={newPatient.insurance}
              onChange={(e) =>
                setNewPatient({ ...newPatient, insurance: e.target.value })
              }
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddPatient}>
              Add Patient
            </Button>
          </Box>

          <Box mt={5}>
            <Typography variant="h5" gutterBottom>
              Existing Patients
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table size="small" sx={{ width: '100%' }} aria-label="patient table">
                <TableHead sx={{ backgroundColor: "#00796b" }}>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Date of Birth</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Insurance</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.map((patient, index) => (
                    <TableRow key={index}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.dateOfBirth}</TableCell>
                      <TableCell sx={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {patient.address}
                      </TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.insurance}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1} flexWrap="nowrap">
                          <Button
                            color="primary"
                            onClick={() => handleOpenDialog(patient)}
                            variant="contained"
                            size="small"
                          >
                            Prescriptions
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleRemovePatient(patient.name)}
                            variant="contained"
                            size="small"
                          >
                            Remove
                          </Button>
                          <Button
                            color="primary"
                            onClick={() => handleEditOpen(patient)}
                            variant="contained"
                            size="small"
                          >
                            Edit
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>


        </Container>
        <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={editingPatient.name || ""}
              onChange={(e) =>
                setEditingPatient((prev) => ({ ...prev, name: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date of Birth"
              value={editingPatient.dateOfBirth || ""}
              onChange={(e) =>
                setEditingPatient((prev) => ({ ...prev, dateOfBirth: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Address"
              value={editingPatient.address || ""}
              onChange={(e) =>
                setEditingPatient((prev) => ({ ...prev, address: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              value={editingPatient.phone || ""}
              onChange={(e) =>
                setEditingPatient((prev) => ({ ...prev, phone: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={editingPatient.email || ""}
              onChange={(e) =>
                setEditingPatient((prev) => ({ ...prev, email: e.target.value }))
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Insurance"
              value={editingPatient.insurance || ""}
              onChange={(e) =>
                setEditingPatient((prev) => ({ ...prev, insurance: e.target.value }))
              }
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditSubmit} variant="contained" color="primary">
              Save Changes
            </Button>
            <Button onClick={handleEditClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Prescriptions for {selectedPatient?.name}</DialogTitle>
          <DialogContent>
            <List>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h6" >
                      Drug Name
                    </Typography>
                  }
                />
                <Box display="flex" justifyContent="space-between" alignItems="center" width="auto">
                  <Typography variant="h6" sx={{ marginRight: 2 }}>
                    Filled
                  </Typography>
                  <Typography variant="h6" >
                    Delete
                  </Typography>
                </Box>
              </ListItem>
              {selectedPatient?.prescriptions?.map((prescription, index) => (
                <ListItem key={index} secondaryAction={<Box>
                  {/* Checkbox */}
                  <Checkbox
                    edge="end"
                    color="primary"
                    checked={prescription.filled}
                    onChange={() =>
                      setSelectedPatient(prev => ({
                        ...prev,
                        prescriptions: prev.prescriptions.map((item, i) =>
                          i === index ? { ...item, filled: !item.filled } : item
                        ),
                      }))
                    }
                  />

                  {/* Delete Button */}
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => handleDeletePrescription(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>}>
                  <ListItemText primary={prescription.name + ": " + prescription.amount} />
                </ListItem>
              ))}
            </List>

            <FormControl fullWidth margin="normal">
              <InputLabel id="prescription-name-label">Prescription Name</InputLabel>
              <Select
                labelId="prescription-name-label"
                value={newPrescription.name}
                onChange={(e) =>
                  setNewPrescription((prev) => ({ ...prev, name: e.target.value }))
                }
              >
                {inventory.map((item: InventoryItem) => (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Amount"
              type="number"
              value={newPrescription.amount}
              onChange={(e) => setNewPrescription(prev => ({ ...prev, amount: Number(e.target.value) }))}
              fullWidth
              margin="normal"
            />

          </DialogContent>

          <DialogActions>
            <Button onClick={handleAddPrescription} variant="contained">Add Prescription</Button>
            <Button onClick={handleCloseDialog} color="secondary">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default PatientManager;
