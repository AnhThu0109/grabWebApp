// import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faUser as faSolidUser,
  faCalendarDays as faSolidCalendar,
} from "@fortawesome/free-solid-svg-icons";
import {
  faUser as faRegularUser,
  faCalendarDays as faRegularCalendar,
} from "@fortawesome/free-regular-svg-icons";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuList from "@mui/material/MenuList";
import { Settings, Logout } from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";
import "./style.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  HomeOutlined,
  HomeFilled,
  EnvironmentFilled,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import getById from "../../utils/getById";
import { ADMIN } from "../../utils/API";
import { Switch } from "antd";
import { Trans, useTranslation } from "react-i18next";

export default function Layout() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = localStorage.getItem("userId");
  const [active, setActive] = useState({
    activeHome: false,
    activeBooking: false,
    activeHistory: false,
    activePeople: false,
    activeMyAcc: false,
  });
  const [userData, setUserData] = useState();
  const dispatch = useDispatch();
  const avatar = useSelector((state) => state.avatar.avatarPath);
  const navigate = useNavigate();
  const activeItem = localStorage.getItem("active");
  const token = localStorage.getItem("token");
  const { i18n } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //Logout func ==> when click login, page redirect to "/login"
  const handleLogout = async () => {
    localStorage.clear();
    navigate("/login");
  };

  //Function setting active menu item when handle click
  const handleMenuItemClick = (item) => {
    setActive({
      activeHome: item === 1,
      activeBooking: item === 2,
      activeHistory: item === 3,
      activePeople: item === 4,
      activeMyAcc: item === 5,
    });
    localStorage.setItem("active", item);
  };

  // Set the title and active menu item based on the current URL when the user clicks the browser's back or forward button
  const setTitleCurrentURL = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("/booking")) {
      handleMenuItemClick(2);
    } else if (currentPath.includes("/history")) {
      handleMenuItemClick(3);
    } else if (currentPath.includes("/people")) {
      handleMenuItemClick(4);
    } else if (currentPath.includes("/users")) {
      handleMenuItemClick(5);
    } else {
      handleMenuItemClick(1);
    }
  };

  const handleChangeLang = (checked) => {
    if (checked) {
      // Switch is checked (En)
      i18n.changeLanguage("en");
    } else {
      // Switch is unchecked (Vi)
      i18n.changeLanguage("vi");
    }
  };

  useEffect(() => {
    //getUserInfo
    const fetchUserData = async () => {
      try {
        const user = await getById(id, ADMIN, token);
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    // Set the initial title and active menu item based on the current URL
    setTitleCurrentURL();
    // Add an event listener to update the title and active menu item when the user clicks the browser's back or forward button
    window.addEventListener("popstate", setTitleCurrentURL);

    return () => {
      // Remove the event listener when the component unmounts
      window.removeEventListener("popstate", setTitleCurrentURL);
    };
  }, []);

  return (
    <div className="ps-3 pt-3" style={{ height: "100vh" }}>
      <Box className="mx-4 d-flex align-items-center justify-content-between text-center">
        <Typography sx={{ minWidth: 100 }}>
          <Link
            className="linkNormal"
            to="/"
            onClick={() => handleMenuItemClick(1)}
          >
            {/* <b className="heading text-black">GrabApp</b> */}
            <img src="/images/logo.png" alt="logo" className="logoImg" />
            <MenuIcon fontSize="large" className="textGreen1" />
          </Link>
        </Typography>
        <div>
          <Switch
            checkedChildren="En"
            unCheckedChildren="Vi"
            defaultChecked
            onChange={handleChangeLang}
          />

          <Badge
            color="error"
            variant="dot"
            overlap="circular"
            className="ms-4"
          >
            <NotificationsIcon />
          </Badge>

          <IconButton
            className="ms-4"
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={
                avatar !== ""
                  ? avatar
                  : userData?.avatarPath
                  ? userData?.avatarPath
                  : "https://lh3.googleusercontent.com/ED85u6aQ2oseaV3Zi4ff-DyLnQpc-02EbG328ilQChGqg-4OkQuDzfirfuCnRP_Sv9DWwkI3iG_DALmWPVRr-SxO"
              }
              alt="avatar"
            />
          </IconButton>
        </div>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "10px",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link
          to={`/users/${id}`}
          className="linkNormal text-black"
          onClick={() => handleMenuItemClick(5)}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="medium" className="iconMenuAcc" />
            </ListItemIcon>
            <Trans i18nKey="accMenu">My account</Trans>
          </MenuItem>
        </Link>
        <Link
          to="/login"
          onClick={handleLogout}
          className="linkNormal text-black"
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Logout fontSize="medium" className="iconMenuAcc" />
            </ListItemIcon>
            <Trans i18nKey="logoutMenu">Logout</Trans>
          </MenuItem>
        </Link>
      </Menu>
      <div className="d-flex" style={{ height: "100vh" }}>
        <MenuList sx={{ width: "150px" }}>
          <Link
            to="/"
            className="linkNormal"
            onClick={() => handleMenuItemClick(1)}
          >
            <MenuItem
              className={
                activeItem === null ||
                activeItem === "1" ||
                active.activeHome === true
                  ? "menuActive my-2"
                  : "menuInactive my-2"
              }
            >
              {activeItem === null ||
              activeItem === "1" ||
              active.activeHome === true ? (
                <HomeFilled className="iconColor" />
              ) : (
                <HomeOutlined className="iconColor" />
              )}
              <span className="ms-1 textColor">
                <Trans i18nKey="homeMenu">Home</Trans>
              </span>
            </MenuItem>
          </Link>
          <Link
            to="/booking"
            className="linkNormal"
            onClick={() => handleMenuItemClick(2)}
          >
            <MenuItem
              className={
                activeItem === "2" || active.activeBooking === true
                  ? "menuActive my-2"
                  : "menuInactive my-2"
              }
            >
              <FontAwesomeIcon
                icon={
                  activeItem === "2" || active.activeBooking === true
                    ? faSolidCalendar
                    : faRegularCalendar
                }
                className="iconColor"
              />
              <span className="ms-1 textColor">
                <Trans i18nKey="bookingMenu">Booking</Trans>
              </span>
            </MenuItem>
          </Link>
          <Link
            to="/history"
            className="linkNormal"
            onClick={() => handleMenuItemClick(3)}
          >
            <MenuItem
              className={
                activeItem === "3" || active.activeHistory === true
                  ? "menuActive"
                  : "menuInactive"
              }
            >
              {/* <FontAwesomeIcon icon={faLocationDot} className="iconColor" /> */}
              {activeItem === "3" || active.activeHistory === true ? (
                <EnvironmentFilled className="iconColor" />
              ) : (
                <EnvironmentOutlined className="iconColor" />
              )}
              <span className="ms-1 textColor">
                <Trans i18nKey="historyMenu">History</Trans>
              </span>
            </MenuItem>
          </Link>
          <Link
            to="/people"
            className="linkNormal"
            onClick={() => handleMenuItemClick(4)}
          >
            <MenuItem
              className={
                activeItem === "4" || active.activePeople === true
                  ? "menuActive my-2"
                  : "menuInactive my-2"
              }
            >
              {activeItem === "4" || active.activePeople === true ? (
                <FontAwesomeIcon icon={faUserGroup} className="iconColor" />
              ) : (
                <TeamOutlined className="iconColor" />
              )}

              <span className="ms-1 textColor">
                <Trans i18nKey="peopleMenu">People</Trans>
              </span>
            </MenuItem>
          </Link>
          <Link
            to={`/users/${id}`}
            className="linkNormal"
            onClick={() => handleMenuItemClick(5)}
          >
            <MenuItem
              className={
                activeItem === "5" || active.activeMyAcc === true
                  ? "menuActive my-2"
                  : "menuInactive my-2"
              }
            >
              <FontAwesomeIcon
                icon={
                  activeItem === "5" || active.activeMyAcc === true
                    ? faSolidUser
                    : faRegularUser
                }
                className="iconColor"
              />
              <span className="ms-1 textColor">
                <Trans i18nKey="accMenu">My account</Trans>
              </span>
            </MenuItem>
          </Link>
        </MenuList>
        <div className="col outlet ms-3 mt-2" style={{ height: "100vh" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
