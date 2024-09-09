import React, { useState, useEffect } from "react";
import { DCompetition_backend_user } from "declarations/DCompetition_backend_user";
import { AuthClient } from "@dfinity/auth-client";

function Login() {
  const [principalId, setPrincipalId] = useState(null);

  const loginAndStorePrincipal = async () => {
    try {
      const authClient = await AuthClient.create();

      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          setPrincipalId(principal);
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    const checkUser = async () => {
      if (principalId) {
        try {
          console.log("Logged in Principal ID:", principalId);

          const user = await DCompetition_backend_user.login(principalId);
          console.log("User data:", user);

          //Keknya backend perlu di modif, ini user nya ngereturn array
          if (Array.isArray(user) && user.length > 0) {
            window.location.href = "/home";
          } else {
            localStorage.setItem("principal_id", JSON.stringify(principalId));
            window.location.href = "/register";
          }
        } catch (error) {
          console.error("Error during user check:", error);
        }
      }
    };

    checkUser();
  }, [principalId]);

  return (
    <div>
      <h1>Internet Identity Login</h1>
      <button onClick={loginAndStorePrincipal}>
        Login With Internet Identity (click Me)
      </button>
      {principalId && <p>Logged in! Principal ID: {principalId}</p>}
    </div>
  );
}

export default Login;
