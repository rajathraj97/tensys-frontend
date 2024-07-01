import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import NavBar from "./NavBar";
import Snackbar from "@mui/material/Snackbar";
import Home from "./Home";

function App() {
  

  return (
    <div className="App">
      <NavBar/>
      <Home/>
    </div>
  );
}

export default App;
