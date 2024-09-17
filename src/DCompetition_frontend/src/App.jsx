import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Template from "./templates/Template";
import Home from "./pages/Home";
import Face from "./pages/Face";
import Contests from "./pages/Contests";
import AddContest from "./pages/AddContest";

function App() {
  return (
    <Router>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/face" element={<Face />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contests" element={<Contests />} />
          <Route path="/add" element={<AddContest/>} />
        </Routes>
      </Template>
    </Router>
  );
}

export default App;
