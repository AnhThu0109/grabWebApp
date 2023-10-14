import Users from "../pages/People";
import Login from "../pages/Login";
import MyAccount from "../pages/MyAccount";
import Welcome from "../pages/Welcome";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import History from "../pages/History";
import Add from "../pages/AddNew";
import Tracking from "../pages/Tracking";

const publicRoutes = [
    {
        element: <Welcome/>,
        path: "/welcome"
    },
    {
        element: <Login/>,
        path: "/login"
    },
    {
        element: <Home/>,
        path: "/"
    },
    {
        element: <MyAccount/>,
        path: "/users/:id"
    },
    {
        element: <Users/>,
        path: "/people"
    },
    {
        element: <Booking/>,
        path: "/booking"
    },
    {
        element: <Add/>,
        path: "/booking/add"
    },
    {
        element: <Tracking/>,
        path: "/booking/tracking"
    },
    {
        element: <History/>,
        path: "/history"
    },
]

const userRoutes = [
    {
        element: Home,
        path: "/"
    },
    {
        element: MyAccount,
        path: "/users/:id"
    },
    {
        element: Users,
        path: "/people"
    },
    
]

export {publicRoutes, userRoutes};