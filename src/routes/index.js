import Users from "../pages/People";
import Login from "../pages/Login";
import MyAccount from "../pages/MyAccount";
import Welcome from "../pages/Welcome";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import History from "../pages/History";

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