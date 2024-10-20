import React, { useState, useEffect } from "react";
import "./ManagerMain.css";
import {
  Box,
  Typography,
  Container,
  Button,
  ButtonBase,
  Grid,
  AppBar,
  Toolbar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Badge,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationsIcon from '@mui/icons-material/Notifications';

// Define the Medication interface
interface Medication {
  id: string;
  name: string;
  amount: number;
  supplier: string;
  price_per_quantity: number;
  expiration_date: string;
}

function ManagerMain() {
  const navigate = useNavigate();
  const [expiredMedications, setExpiredMedications] = useState<Medication[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed
  }

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/inventory');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const medications: Medication[] = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter expired medications
        const expiredMeds = medications.filter((med) => {
          const expDate = parseDate(med.expiration_date);
          return expDate < today;
        });

        // Filter low-stock medications (less than 5 units)
        const lowStockMeds = medications.filter((med) => med.amount < 5);

        // Combine both expired and low stock medications for the alert
        const alertMeds = [...expiredMeds, ...lowStockMeds];

        if (alertMeds.length > 0) {
          setExpiredMedications(alertMeds); // Reuse the existing state for simplicity
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleNotificationClick = () => {
    setOpenDialog(true);
  };

  return (
    <div className="manager-background">
      {/* Fixed AppBar at the top */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Manager View
          </Typography>
          {/* Notification Button */}
          <IconButton
            color={expiredMedications.length > 0 ? "error" : "inherit"}
            onClick={handleNotificationClick}
          >
            <Badge
              badgeContent={expiredMedications.length > 0 ? expiredMedications.length : null}
              color="error"
            >
              <NotificationsIcon color="inherit" />
            </Badge>
          </IconButton>
          <Button color="inherit" onClick={() => navigate('/LoginPage')}>Log Out</Button>

        </Toolbar>
      </AppBar>

      {/* Add padding to account for the fixed AppBar */}
      <Box component="section" className="box-background" sx={{ p: 2, mt: 8 }}>
        {/* Main Content Section */}
        <Container component="main" style={{ padding: "2rem" }}>
          <Typography variant="h5" gutterBottom>
            Manage Pharmacy Personnel
          </Typography>

          {/* Features Section */}
          <Grid container spacing={4} style={{ marginTop: "2rem" }}>
            <Grid item xs={12} sm={6}>
              <ButtonBase
                onClick={() => navigate("/StaffOverview")}
                style={{ width: "100%" }}
              >
                <Paper elevation={3} style={{ padding: "1rem" }}>
                  <Typography variant="h6">Staff Overview</Typography>
                  <Typography variant="body2">
                    View and manage the staff involved in the pharmacy
                    operations.
                  </Typography>
                </Paper>
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm={6}>
              <ButtonBase
                onClick={() => navigate("/Inventory")}
                style={{ width: "100%" }}
              >
                <Paper elevation={3} style={{ padding: "1rem", width: "100%" }}>
                  <Typography variant="h6">Manage Inventory</Typography>
                  <Typography variant="body2">
                    Keep track of your medication stock and update inventory as
                    needed.
                  </Typography>
                </Paper>
              </ButtonBase>
            </Grid>
          </Grid>
        </Container>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "1rem",
            backgroundColor: "#f1f1f1",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            &copy; 2024 Pharmacy System. All rights reserved.
          </Typography>
        </footer>
      </Box>

      {/* Dialog for Expired and Low-Stock Medications */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Inventory Alerts</DialogTitle>
        <DialogContent>
          {expiredMedications.length > 0 ? (
            <>
              <DialogContentText>
                The following medications need your attention:
              </DialogContentText>
              <ul>
                {expiredMedications.map((med) => (
                  <li key={med.id}>
                    {med.name} ({med.amount < 5 ? "Low stock" : `Expired on ${med.expiration_date}`})
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <DialogContentText>
              There are no alerts at this time.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Close
          </Button>
          <Button onClick={() => navigate("/Inventory")} color="primary">
            Go to Inventory
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ManagerMain;
