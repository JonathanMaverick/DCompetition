import Contests from "../pages/Contests";
import Face from "../pages/Face";
import ContestDetail from "../pages/ContestDetail";
import History from "../pages/History";

export const RouteList = [
    {
        element: <Face/>,
        path: "/face"
    },
    {
        element: <Contests/>,
        path: "/contests"
    },
    {
        element: <History/>,
        path: "/history"
    },
    {
        element: <ContestDetail/>,
        path: "/contestDetail/:competitionID"
    }

]