import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

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

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (principalId) {
      console.log('Logged in Principal ID:', principalId);
    }
  }, [principalId]);

  return (
    <div>
      <h1>Internet Identity Login</h1>
      <button onClick={loginAndStorePrincipal}>Login With Internet Identity (click Me)</button>
      {principalId && (
        <p>Logged in! Principal ID: {principalId}</p>
      )} 
    </div>
  );
}

export default Login;
