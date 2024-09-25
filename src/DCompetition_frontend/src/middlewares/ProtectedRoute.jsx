import React, { useEffect } from "react";
import { useUserAuth } from "../context/UserContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { protectedRouteList } from "../settings/RouteMenu";

function ProtectedRoute() {
  const { getPrincipal } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getID = async () => {
      const id = await getPrincipal();
      if (id !== "") {
        navigate("/");
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
