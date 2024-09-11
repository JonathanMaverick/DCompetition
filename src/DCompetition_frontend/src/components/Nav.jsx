import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { useUserAuth } from "../context/UserContext";
import { DCompetition_backend_user } from "declarations/DCompetition_backend_user";
import { AuthClient } from "@dfinity/auth-client";

export default function Nav() {
  const { getPrincipal, setPrincipal, getUserData } = useUserAuth();
  const [id, setID] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const principalID = async () => {
      setLoading(true);
      try {
        const principal = await getPrincipal();
        setID(principal);
        console.log(principal);
      } catch (error) {
        console.error("Error getting principal:", error);
      } finally {
        setLoading(false);
      }
    };
    principalID();
  }, [getPrincipal]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id !== "") {
        setLoading(true);
        try {
          console.log(id);
          const fetchedUser = await getUserData(id);
          console.log(fetchedUser);
          setUser(fetchedUser[0]);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
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
    <Navbar>
      <NavbarBrand>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/linkasa-a354b.appspot.com/o/image%20(4).png?alt=media&token=181e4ae9-7cc8-49cf-a628-c97b013b3549"
          alt=""
          width={40}
        />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem isActive>
          <Link color="secondary" href="#">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Competitions
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
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
                indicator: "stroke-white",
                track: "stroke-white/10",
                value: "text-3xl font-semibold text-white",
              }}
              color="secondary"
              aria-label="Loading..."
            />
          ) : user ? (
            <div className="flex gap-3 items-center">
              <p>{user.username}</p>
              <Button color="secondary" variant="flat" onClick={signOut}>
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
