import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { useUserAuth } from "../context/UserContext";
import { DCompetition_backend_user } from "declarations/DCompetition_backend_user";
import { AuthClient } from "@dfinity/auth-client";
import { useLocation, Link } from "react-router-dom";

export default function Nav() {
  const { getPrincipal, setPrincipal, getUserData } = useUserAuth();
  const [id, setID] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const principalID = async () => {
      try {
        const principal = await getPrincipal();
        setID(principal);
        console.log(principal);
      } catch (error) {
        console.error("Error getting principal:", error);
      }
    };
    principalID();
  }, [getPrincipal]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id !== "") {
        try {
          setLoading(true);
          console.log(id);
          const fetchedUser = await getUserData(id);
          console.log(fetchedUser);
          setUser(fetchedUser[0]);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };
    fetchUserData();
  }, [id, getUserData]);

  const signOut = async () => {
    await DCompetition_backend_user.clearPrincipalID();
    window.location.href = "/";
  };

  const loginAndStorePrincipal = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          setPrincipal(principal);

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
        },
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Navbar maxWidth="xl">
      <NavbarBrand>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/linkasa-a354b.appspot.com/o/image%20(4).png?alt=media&token=181e4ae9-7cc8-49cf-a628-c97b013b3549"
          alt=""
          width={40}
        />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem isActive={location.pathname === "/"}>
          <Link
            to={"/"}
            className={
              location.pathname === "/"
                ? "text-purple-500"
                : "text-white hover:text-gray-300 transition-all"
            }
          >
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === "/contests"}>
          <Link
            to={"/contests"}
            className={
              location.pathname === "/contests"
                ? "text-purple-500"
                : "text-white hover:text-gray-300 transition-all"
            }
          >
            Contests
          </Link>
        </NavbarItem>
        <NavbarItem isActive={location.pathname === "/results"}>
          <Link
            to={"/results"}
            className={
              location.pathname === "/results"
                ? "text-purple-500"
                : "text-white hover:text-gray-300 transition-all"
            }
          >
            Results
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          {loading ? (
            <CircularProgress
              classNames={{
                svg: "w-6 h-6 drop-shadow-md",
                indicator: "stroke-purple-500",
                track: "stroke-purple-500/10",
                value: "text-3xl font-semibold text-purple-500",
              }}
              color="secondary"
              aria-label="Loading..."
            />
          ) : user ? (
            <div className="flex gap-3 items-center">
              <p>{user.username}</p>
              <Button
                color="secondary"
                variant="flat"
                onClick={signOut}
                className="text-purple-500"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              color="secondary"
              variant="flat"
              onClick={loginAndStorePrincipal}
            >
              Sign In
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
