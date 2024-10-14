import React from "react";
import "./LoginContent.css"; // The CSS file with all the styles
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Container,
  Switch,
  ButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  //devEnabled represents the state of the dev controls switch
  //setDevEnabled is the function to set devEnabled. found in handleDevChange
  const [devEnabled, setDevEnabled] = React.useState(false);

  const navigate = useNavigate();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/HomePage");
  //if (manager) // something like this might be good for GUIS
  //navigate('/ManagerMain');
  };
  
  const handleNavigateHome = () => {
    navigate("/HomePage");
  };
  const handleNavigateSysAdmin = () => {
    navigate("/SysAdminPage");
  };
  const handleNavigateManager = () => {
    navigate("/ManagerMain");
  };
  const handleNavigateStaffOverview = () => {
    navigate("/StaffOverview");
  };


  //event handler included in the dev switch
  const handleDevChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDevEnabled(event.target.checked);
  };

  //Defines the devSection. While switch is disabled, only a switch is displayed
  //While the switch is enabled, displays a box with dev controls in it
  let devSection;
  if (!devEnabled) {
    devSection = (
      <>
        <br />
        <FormControlLabel
          value="devcontrols"
          control={<Switch checked={devEnabled} onChange={handleDevChange} />}
          label="Dev Controls"
          labelPlacement="top"
          sx={{ color: "white" }}
        />
      </>
    );
  } else {
    devSection = (
      <Container maxWidth="md" className="dev-container">
        <Box className="wrapper">
          <FormControlLabel
            value="devcontrols"
            control={<Switch checked={devEnabled} onChange={handleDevChange} />}
            label="Dev Controls"
            labelPlacement="top"
          />
          <br />
          <Typography component="p" align="center">
            Navigate to:
          </Typography>
          <ButtonGroup variant="contained">
            <Button onClick={handleNavigateHome}>Home Page</Button>
            <Button onClick={handleNavigateSysAdmin}>SysAdmin Page</Button>
            <Button onClick={handleNavigateManager}>Manager Page</Button>
            <Button onClick={handleNavigateStaffOverview}>Staff Overview Page</Button>
          </ButtonGroup>
        </Box>
      </Container>
    );
  } //end of devSection

  return (
    <div className="login-background">
      <Container maxWidth="xs" className="login-container">
        <Box className="wrapper" justifySelf={"center"} marginTop={"35%"}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            className="login-title"
          >
            Login
          </Typography>
          <form onSubmit={handleLogin} noValidate>
            <Box className="input-box">
              <TextField
                fullWidth
                label="Username"
                variant="filled"
                InputProps={{ disableUnderline: true }}
                className="input-field"
                required
              />
            </Box>
            <Box className="input-box">
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="filled"
                InputProps={{ disableUnderline: true }}
                className="input-field"
                required
              />
            </Box>
            <Box className="remember-forgot">
              <FormControlLabel
                control={<Checkbox className="checkbox" />}
                label="Remember me"
                className="remember-me"
              />
              <Typography
                variant="body2"
                component="a"
                href="#"
                className="forgot-password"
              >
                Forgot Password?
              </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
            >
              Login
            </Button>
          </form>
        </Box>

      {/* Dev Command box */}
      {devSection}
      </Container>
    </div>
  );
}

export default LoginPage;
