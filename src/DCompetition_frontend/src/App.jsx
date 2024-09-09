import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Template from "./templates/Template";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Template>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Template>
    </Router>
  );
}

export default App;
