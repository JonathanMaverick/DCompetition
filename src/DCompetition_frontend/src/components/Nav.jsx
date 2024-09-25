import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  CircularProgress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { useUserAuth } from "../context/UserContext";
import { DContest_backend_user } from "declarations/DContest_backend_user";
import { AuthClient } from "@dfinity/auth-client";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import icp from "../../public/favicon.ico";
import { CgLogOut, CgProfile } from "react-icons/cg";
import { MdMenu } from "react-icons/md";

export default function Nav() {
  const { getPrincipal, setPrincipal, getUserData, userData, setUserData } =
    useUserAuth();
  const [id, setID] = useState("");
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
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id !== "") {
        try {
          const fetchedUser = await getUserData(id);
          setUserData(fetchedUser[0]);

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

            const user = await DContest_backend_user.login(principal);

            if (Array.isArray(user) && user.length > 0) {
              console.log(user);
              window.location.href = "/";
            } else {
              window.location.href = "/auth/register";
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
        <Dropdown className="block sm:hidden">
          <DropdownTrigger className="flex justify-center sm:hidden">
            <Button
              variant="bordered"
              isIconOnly
              className="w-[3rem] h-[2.5rem]"
            >
              <MdMenu className="text-2xl" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="nav">
            <DropdownItem
              key="home"
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </DropdownItem>
            <DropdownItem
              key="contests"
              onClick={() => {
                navigate("/contests");
              }}
            >
              Contests
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className="flex sm:hidden top-0 left-0 absolute min-w-[100vw] justify-center">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/demarj-59046.appspot.com/o/logo_fix_2-removebg-preview.png?alt=media&token=2daf760b-643d-4e6a-be78-129f3926fb3c"
            alt=""
            width={150}
            className="-mt-3 -ml-8"
          />
        </div>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/demarj-59046.appspot.com/o/logo_fix_2-removebg-preview.png?alt=media&token=2daf760b-643d-4e6a-be78-129f3926fb3c"
          alt=""
          width={150}
          className="hidden sm:block"
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
        {/* <NavbarItem isActive={location.pathname === "/history"}>
          <Link
            to={"/history"}
            className={
              location.pathname === "/history"
                ? "text-purple-500"
                : "text-white hover:text-gray-300 transition-all"
            }
          >
            History
          </Link>
        </NavbarItem> */}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="mt-1">
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
          ) : userData ? (
            // <div className="flex gap-3 items-center">
            //   {profilePicURL && (
            //     <img
            //       src={profilePicURL}
            //       alt="Profile"
            //       className="aspect-square w-8 rounded-full object-cover"
            //     />
            //   )}
            //   <p>{userData.username}</p>
            //   <p>ICP: {Number(userData.money)}</p>
            //   <Button
            //     color="secondary"
            //     variant="flat"
            //     onClick={signOut}
            //     className="text-purple-500"
            //   >
            //     Sign Out
            //   </Button>
            // </div>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center space-x-3 p-2 px-4 bg-opacity-0 bg-neutral-800 rounded-lg hover:bg-opacity-70 transition cursor-pointer -mt-1">
                  <img
                    width={32}
                    src={profilePicURL}
                    alt="Profile picture"
                    className="rounded-full aspect-square border-2 border-purple-500"
                  />
                  <span className="hidden sm:block text-white font-semibold">
                    {userData.username}
                  </span>
                  <FaAngleDown className="translate-y-[1px] text-white transition-transform duration-300 group-hover:rotate-180" />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                className="bg-neutral-900 text-white shadow-2xl border-neutral-700 rounded-xl"
              >
                <DropdownItem
                  key="profile"
                  className="flex flex-col items-start py-2 px-3 gap-1 hover:bg-neutral-700 rounded-lg transition-all"
                >
                  <p className="text-sm text-neutral-400">Signed in as</p>
                  <p className="font-semibold">{userData.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <img src={icp} alt="ICP" className="w-4 h-4" />
                    <p className="font-semibold">{Number(userData.money)}</p>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="my_profile"
                  className="py-2 px-3 hover:bg-purple-600 rounded-lg transition-all flex items-center"
                  onClick={() => {
                    navigate("/history");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CgProfile /> My Profile
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="sign_out"
                  className="py-2 px-3 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                  onClick={signOut}
                >
                  <div className="flex items-center gap-2">
                    <CgLogOut className="translate-y-[0.6px] translate-x-[0.5px] text-[16px]" />{" "}
                    Sign Out
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
