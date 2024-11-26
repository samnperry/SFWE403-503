import React, { useState, useRef } from "react";
import "./Pharm.css";
import {
  Box,
  Typography,
  Button,
  Container,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import SignatureCanvas from "react-signature-canvas";

function Pharm() {
  const user = useUserContext().user;
  const navigate = useNavigate();
  const [openSignaturePad, setOpenSignaturePad] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const sigPad = useRef<SignatureCanvas>(null);

  const handleNavigateHome = () => navigate("/Pharm");
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

  const handleProfile = () => navigate("/ProfilePage");
  const handleOpenSignaturePad = () => setOpenSignaturePad(true);
  const handleCloseSignaturePad = () => setOpenSignaturePad(false);

  const handleSaveSignature = () => {
    if (sigPad.current && sigPad.current.isEmpty()) {
      alert("Please provide a signature before saving.");
    } else if (sigPad.current) {
      setSignatureData(sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
      setOpenSignaturePad(false);
    }
  };

  const handleClearSignature = () => sigPad.current?.clear();


  const handleNavigatePharmacistInventory = () => navigate("/PharmacistInventory");
  const handleNavigatePatientManager = () => navigate("/PatientManager");
  const handleNavigatePharmCashier = () => navigate("/PharmacistCashier");

  return (
    <Box
      className="pharm-background"
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
            Pharmacy Dashboard
          </Typography>

          {/* Buttons aligned to the right */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button color="inherit" onClick={handleNavigateHome}>
              Home
            </Button>
            <Button color="inherit" onClick={handleProfile}>
              Profile
            </Button>
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
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            background: "white",
            width: "100%",
            borderRadius: 2,
            padding: "2rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "2rem" }}>
            Welcome, {user?.name || "Pharmacist"}!
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ boxShadow: 3, "&:hover": { boxShadow: 6 }, ":hover": { backgroundColor: "#e0f2f1" } }}
                onClick={handleNavigatePharmacistInventory}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h6" gutterBottom >
                      Manage Inventory
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep track of medications and supplies with our efficient inventory system.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ boxShadow: 3, "&:hover": { boxShadow: 6 }, ":hover": { backgroundColor: "#e0f2f1" } }}
                onClick={handleNavigatePatientManager}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Patient Records
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access and manage patient information securely and conveniently.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ boxShadow: 3, "&:hover": { boxShadow: 6 }, ":hover": { backgroundColor: "#e0f2f1" } }}
                onClick={handleNavigatePharmCashier}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Cashier
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Checkout a customer for either OTC items or prescriptions.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card
                sx={{ boxShadow: 3, "&:hover": { boxShadow: 6 }, ":hover": { backgroundColor: "#e0f2f1" } }}
                onClick={handleOpenSignaturePad}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Add Signature
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Draw and save your signature for prescriptions and documents.
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>


      {/* Signature Pad Dialog */}
      <Dialog open={openSignaturePad} onClose={handleCloseSignaturePad} maxWidth="sm" fullWidth>
        <DialogTitle>Draw Your Signature</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <SignatureCanvas
            penColor="black"
            canvasProps={{
              width: 500,
              height: 200,
              className: "sigCanvas",
            }}
            ref={sigPad}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearSignature}>Clear</Button>
          <Button onClick={handleCloseSignaturePad}>Cancel</Button>
          <Button onClick={handleSaveSignature} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>

  );
}

export default Pharm;
