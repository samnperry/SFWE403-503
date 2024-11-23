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

  const handleNavigateHome = () => {
    navigate("/Pharm");
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
        console.log(data.message);

        window.location.href = data.redirect;
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.error);
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleProfile = () => navigate("/ProfilePage");

  const handleOpenSignaturePad = () => {
    setOpenSignaturePad(true);
  };

  const handleCloseSignaturePad = () => {
    setOpenSignaturePad(false);
  };

  const handleSaveSignature = () => {
    if (sigPad.current && sigPad.current.isEmpty()) {
      alert("Please provide a signature before saving.");
    } else if (sigPad.current) {
      setSignatureData(sigPad.current.getTrimmedCanvas().toDataURL("image/png"));
      setOpenSignaturePad(false);
      // You can handle the saved signature data here
    }
  };

  const handleClearSignature = () => {
    if (sigPad.current) {
      sigPad.current.clear();
    }
  };

  return (
    <div className="pharm-background">
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pharmacy Page
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
      {/* Spacer to prevent content from being hidden behind the AppBar */}
      <Toolbar />

      <Container maxWidth="md">
        <Box mt={5} textAlign="center">
          {/* Cool Homepage Content */}
          <Box mt={5}>
            <Grid container spacing={4} mt={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Manage Inventory
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Keep track of medications and supplies with our efficient
                      inventory system.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Patient Records
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access and manage patient information securely and
                      conveniently.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gain insights with our comprehensive analytics tools.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* New Add Signature Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardActionArea onClick={handleOpenSignaturePad}>
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        Add Signature
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Draw and save your signature for prescriptions and
                        documents.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      {/* Signature Pad Dialog */}
      <Dialog
        open={openSignaturePad}
        onClose={handleCloseSignaturePad}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Draw Your Signature</DialogTitle>
        <DialogContent>
          <SignatureCanvas
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
            ref={sigPad}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearSignature}>Clear</Button>
          <Button onClick={handleCloseSignaturePad}>Cancel</Button>
          <Button
            onClick={handleSaveSignature}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
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
    </div>
  );
}

export default Pharm;
