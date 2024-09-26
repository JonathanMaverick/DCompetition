import React, { useEffect } from "react";
import { useUserAuth } from "../context/UserContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { protectedRouteList } from "../settings/RouteMenu";



function ProtectedRoute() {
  const navigate = useNavigate();
  const { getPrincipal } = useUserAuth()  
  const status = localStorage.getItem("status")

  useEffect(() => {
    console.log(status)
    const getID = async () => {
      const id = await getPrincipal();
      if (id === "" || status == 0) {
        navigate("/");
      }else if(id !== "" && status == 2) { // buat login  && register
        navigate("/")
      }
    };
    getID();
  }, []);

  return (
    <>
      <Routes>
        {protectedRouteList.map((menu, index) => (
          <Route key={index} path={menu.path} element={menu.element} />
        ))}
      </Routes>
    </>
  );
}

export default ProtectedRoute;
