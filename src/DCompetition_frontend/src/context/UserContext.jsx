import { createContext, useContext, useState } from "react";
import { DContest_backend_user } from "../../../declarations/DContest_backend_user";
import PropTypes from "prop-types";

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const getPrincipal = async () => {
    const principalID = await DContest_backend_user.getPrincipalID();
    return principalID;
  };

  const setPrincipal = async (principal) => {
    await DContest_backend_user.storePrincipalID(principal);
  };

  const getUserData = async (principal) => {
    const user = await DContest_backend_user.login(principal);
    return user;
  };

  const value = { getUserData, getPrincipal, setPrincipal };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}

UserAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
