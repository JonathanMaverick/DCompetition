import { createContext, useContext, useState } from "react";
import { DCompetition_backend_user } from "../../../declarations/DCompetition_backend_user";
import PropTypes from "prop-types";

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const getPrincipal = async() => {
    const principalID = await DCompetition_backend_user.getPrincipalID()
    return principalID
  }

  const setPrincipal = async(principal) => {
    await DCompetition_backend_user.storePrincipalID(principal)
  }

  function getUserData() {
    console.log("user data")
  }

  function setUserData(user) {
    console.log("set user data")
  }

  function update(user) {
    console.log("update")
  }

  const value = { update, setUserData, getUserData , getPrincipal, setPrincipal};

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
