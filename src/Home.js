import NavBar from "./NavBar";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import Snackbar from "@mui/material/Snackbar";
import { jwtDecode } from "jwt-decode";
import Admin from "./Admin";
import User from "./User";

export default function Home() {
  const [response, setResponse] = useState("");
  const [state, setState] = React.useState({
    vertical: "top",
    horizontal: "right",
  });
  const [data, setData] = useState(null);
  const [display, setDisplay] = useState(false);
  const { vertical, horizontal, open } = state;
  const ENDPOINT = "https://tensys-task-backend.onrender.com";
  useEffect(() => {
    setData(!!localStorage.getItem("token") ? jwtDecode(localStorage.getItem("token")):{});
  }, [localStorage.getItem("token")]);
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (data) => {
      setResponse(data);
      setDisplay(true);
      setTimeout(() => {
        setDisplay(false);
      }, 2000);
    });

    return () => socket.disconnect();
  }, []);

  console.log(data)
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={display}
        message={response}
        key={vertical + horizontal}
      />
      {data?.role === "admin" && <Admin data={data}/>}
      {data?.role === "user" &&  <User data={data}/>}
    </div>
  );
}
