import Contests from "../pages/Contests";
import Face from "../pages/Face";
import ContestDetail from "../pages/ContestDetail";
import History from "../pages/History";
import Register from "../pages/Register";
import { element } from "prop-types";
import UpdateProfile from "../pages/UpdateProfile";

export const RouteList = [
  // {
  //   element: <Contests />,
  //   path: "/contests",
  // },
  {
    element: <History />,
    path: "/history",
  },
  {
    element: <UpdateProfile />,
    path: "/update-profile",
  },
];

export const protectedRouteList = [
  {
    element: <Face />,
    path: "/face",
  },
  {
    element: <Register />,
    path: "/register",
  },
];
