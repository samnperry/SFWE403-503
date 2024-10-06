import React from "react";
import "./SysAdmin.css"; // The CSS file with all the styles
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

function SysAdminPage() {
  return <div>
    <Typography component={"h1"} fontSize={100} color="blue">
      SysAdmin Page!!!
    </Typography>
  </div>;
}

export default SysAdminPage;
