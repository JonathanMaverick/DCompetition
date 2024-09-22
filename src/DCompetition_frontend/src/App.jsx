import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Template from "./templates/Template";
import Home from "./pages/Home";
import Face from "./pages/Face";
import Contests from "./pages/Contests";
import ContestDetail from "./pages/ContestDetail";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/face" element={<Face />} />
          <Route path="/contests" element={<Contests />} />
          <Route
            path="/contestDetail/:competitionID"
            element={<ContestDetail />}
          />
        </Routes>
      </Template>
    </Router>
  );
}

export default App;
