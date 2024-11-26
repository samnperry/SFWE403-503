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
  CardActionArea,
  CardContent,
  Card,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";

interface Medication {
  id: string;
  name: string;
  amount: number;
  supplier: string;
  price_per_quantity: number;
  expiration_date: string;
}

function ManagerMain() {
  const user = useUserContext().user;
  const navigate = useNavigate();
  const [expiredMedications, setExpiredMedications] = useState<Medication[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  function parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/inventory");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const medications: Medication[] = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiredMeds = medications.filter((med) => {
          const expDate = parseDate(med.expiration_date);
          return expDate < today;
        });

        const lowStockMeds = medications.filter((med) => med.amount < 30);

        const alertMeds = [...expiredMeds, ...lowStockMeds];

        if (alertMeds.length > 0) {
          setExpiredMedications(alertMeds);
        }
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchInventory();
  }, []);

  const handleNotificationClick = () => {
    setOpenDialog(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user }),
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

  return (
    <Box
      className="manager-background"
      sx={{
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* AppBar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#00796b" }}>
        <Toolbar>
          {/* Spacer to push the content to the center */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Centered Title */}
          <Typography variant="h6" sx={{ textAlign: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            Manager Dashboard
          </Typography>

          {/* Buttons aligned to the right */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ flexGrow: 1 }} />  {/* This will push items on the right */}
            <IconButton
              color={expiredMedications.length > 0 ? "error" : "inherit"}
              onClick={handleNotificationClick}
            >
              <Badge
                badgeContent={expiredMedications.length > 0 ? expiredMedications.length : null}
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container
        maxWidth="lg"
        sx={{
          marginTop: "6rem",
          padding: "2rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "2rem" }}>
          Welcome, {user?.name || "Manager"}!
        </Typography>

        <Grid container spacing={4}>
          {/* Staff Overview Card */}
          <Grid item xs={12} sm={6} md={6}>
            <Card
              sx={{
                boxShadow: 3,
                "&:hover": { boxShadow: 6 },
                ":hover": { backgroundColor: "#e0f2f1" },
                display: 'flex', // Ensures the card uses flexbox
                flexDirection: 'column', // Align content vertically
                height: '100%', // Ensures the card takes up full height available in the grid
              }}
              onClick={() => navigate("/StaffOverview")}
            >
              <CardActionArea sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Staff Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View and manage pharmacy staff details.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* Inventory Management Card */}
          <Grid item xs={12} sm={6} md={6}>
            <Card
              sx={{
                boxShadow: 3,
                "&:hover": { boxShadow: 6 },
                ":hover": { backgroundColor: "#e0f2f1" },
                display: 'flex', // Ensures the card uses flexbox
                flexDirection: 'column', // Align content vertically
                height: '100%', // Ensures the card takes up full height available in the grid
              }}
              onClick={() => navigate("/Inventory")}
            >
              <CardActionArea sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Manage Inventory
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track and update medication in stock.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>



      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#004d40",
          padding: "1rem",
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography variant="body2">
          &copy; 2024 Pharmacy System. All rights reserved.
        </Typography>
      </Box>

      {/* Inventory Alerts Dialog */}
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
                    {med.name}{" "}
                    ({med.amount < 30
                      ? "Low stock"
                      : `Expired on ${med.expiration_date}`})
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
    </Box>
  );
}

export default ManagerMain;
