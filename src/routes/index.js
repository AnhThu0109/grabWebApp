import People from "../pages/People";
import Login from "../pages/Login";
import MyAccount from "../pages/MyAccount";
import Welcome from "../pages/Welcome";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import History from "../pages/History";
import Add from "../pages/AddNew";
import Tracking from "../pages/Tracking";
import PeopleDetail from "../pages/PeopleDetail";

const publicRoutes = [
  {
    element: <Login />,
    path: "/login",
  },
];

const welcomeRoute = {
  element: Welcome,
  path: "/welcome",
};

const userRoutes = [
  {
    element: Home,
    path: "/",
  },
  {
    element: MyAccount,
    path: "/users/:id",
  },
  {
    element: People,
    path: "/people",
  },
  {
    element: PeopleDetail,
    path: "/people/detail/:id",
  },
  {
    element: Booking,
    path: "/booking",
  },
  {
    element: Add,
    path: "/booking/add",
  },
  {
    element: Tracking,
    path: "/booking/tracking/:id",
  },
  {
    element: History,
    path: "/history",
  },
];

export { publicRoutes, userRoutes, welcomeRoute };
