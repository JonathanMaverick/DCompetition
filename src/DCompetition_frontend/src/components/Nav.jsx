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
import { DContest_backend_user } from "declarations/DContest_backend_user";
import { AuthClient } from "@dfinity/auth-client";
import { useLocation, Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const { getPrincipal, setPrincipal, getUserData } = useUserAuth();
  const [id, setID] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePicURL, setProfilePicURL] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

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
          const fetchedUser = await getUserData(id);
          setUser(fetchedUser[0]);

          if (fetchedUser[0]?.profilePic) {
            const blob = new Blob([fetchedUser[0].profilePic], {
              type: "image/jpeg",
            });
            const url = URL.createObjectURL(blob);
            setProfilePicURL(url);
          }
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
    await DContest_backend_user.clearPrincipalID();
    navigate("/");
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

            const user = await DContest_backend_user.login(principal);

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
          src="https://firebasestorage.googleapis.com/v0/b/demarj-59046.appspot.com/o/logo_fix_2-removebg-preview.png?alt=media&token=2daf760b-643d-4e6a-be78-129f3926fb3c"
          alt=""
          width={150}
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
        <NavbarItem isActive={location.pathname === "/face"}>
          <Link
            to={"/face"}
            className={
              location.pathname === "/face"
                ? "text-purple-500"
                : "text-white hover:text-gray-300 transition-all"
            }
          >
            Face
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
              {profilePicURL && (
                <img
                  src={profilePicURL}
                  alt="Profile"
                  className="aspect-square w-8 rounded-full"
                />
              )}
              <p>{user.username}</p>
              <p>ICP: {Number(user.money)}</p>
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
