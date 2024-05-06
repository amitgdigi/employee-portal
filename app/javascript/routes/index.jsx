import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import SignUp from "../components/users/SignUp";
import LogIn from "../components/users/LogIn";

export default (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="log-in" element={<LogIn />} />
    </Routes>
  </Router>
);
