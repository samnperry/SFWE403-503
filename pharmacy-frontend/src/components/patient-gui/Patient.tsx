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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Patient {
  name: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  insurance: string;
}

//PUT does not work rn

function PatientManager() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    name: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
    insurance: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

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

  const handleAddPatient = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPatient),
      });
      if (!response.ok) throw new Error("Error adding patient.");
      await fetchPatients();
      setNewPatient({
        name: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        email: "",
        insurance: "",
      });
      alert("Patient added successfully.");
    } catch (error) {
      console.error(error);
      alert("Could not add patient.");
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

  const handleNavigateHome = () => navigate("/PatientManager");//Not real
  //Maybe naviage to Pharmacist Page instead?
  const handleProfile = () => navigate("/ProfilePage");
  const handleLogout = () => navigate("/LoginPage");


  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Management
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
      <Toolbar />

      <Container maxWidth="md">
        <Box mt={5} textAlign="center">
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
            <TableContainer component={Paper}>
              <Table aria-label="patient table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
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
                      <TableCell>{patient.dateOfBirth}</TableCell>
                      <TableCell>{patient.address}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.insurance}</TableCell>
                      <TableCell>
                        <Button
                          color="secondary"
                          onClick={() => handleRemovePatient(patient.name)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default PatientManager;
