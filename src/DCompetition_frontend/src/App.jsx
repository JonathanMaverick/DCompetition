import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Template from "./templates/Template";
import Home from "./pages/Home";
import Face from "./pages/Face";
import Contests from "./pages/Contests";
import ContestDetail from "./pages/ContestDetail";
import Register, { RegisterContext } from "./pages/Register";
import History from "./pages/History";
import AuthenticationRoute from "./middlewares/AuthenticationRoute";
import { RouteList } from "./settings/RouteMenu";

function App() {
  const [register, setRegister] = useState({
    principal: "",
    username: "",
    email: "",
    profile_pic: "",
  });
  return (
    <RegisterContext.Provider value={{ register,setRegister }}>
    <Router>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AuthenticationRoute/>}/>
        </Routes>
      </Template>
    </Router>
    </RegisterContext.Provider>
  );
}

export default App;
