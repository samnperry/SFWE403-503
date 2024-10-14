import React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ManagerMain() {
  const navigate = useNavigate();

  return (
    <div className="manager-background">
      {/* Fixed AppBar at the top */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Manager View
          </Typography>
          <Button color="inherit" href="/HomePage">
            Home
          </Button>
          <Button color="inherit">Prescriptions</Button>
          <Button color="inherit">Orders</Button>
          <Button color="inherit">Profile</Button>
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
    </div>
  );
}

export default ManagerMain;
