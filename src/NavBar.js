import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import App from "./App";
import Home from "./Home";

export default function NavBar() {
  const navigate = useNavigate()
  const handleLogout = () =>{
    localStorage.removeItem("token")
    navigate("/")
  }
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Tasks
            </Typography>
            {!!localStorage.getItem("token")?<Button onClick={handleLogout} color="inherit">Logout</Button>: null}
          </Toolbar>
        </AppBar>
      </Box>
      <div>
      <Routes>
        <Route
          path="/register"
          element={!localStorage.getItem("token") && <Register />}
        />
        <Route path="/" element={!localStorage.getItem("token") && <Login />} />
      </Routes>
      </div>
    </div>
  );
}
