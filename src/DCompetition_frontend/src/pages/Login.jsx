import React, { useState, useEffect } from "react";
import { DCompetition_backend_user } from "declarations/DCompetition_backend_user";
import { AuthClient } from "@dfinity/auth-client";
import { useUserAuth } from "../context/UserContext";

function Login() {
  const { getPrincipal, setPrincipal } = useUserAuth();

  const loginAndStorePrincipal = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          setPrincipal(principal);
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const principal = await getPrincipal(); 

      if (principal !== '') {
        try {
          console.log("Logged in Principal ID:", principal);

          const user = await DCompetition_backend_user.login(principal);

          if (Array.isArray(user) && user.length > 0) {
            window.location.href = "/home";
          } else {
            window.location.href = "/register";
          }
        } catch (error) {
          console.error("Error during user check:", error);
        }
      }
    };

    checkUser();
  }, [getPrincipal]);


  return (
    <div>
      <h1>Internet Identity Login</h1>
      <button onClick={loginAndStorePrincipal}>
        Login With Internet Identity (click Me)
      </button>
    </div>
  );
}

export default Login;
