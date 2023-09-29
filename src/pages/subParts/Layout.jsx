import * as React from "react";
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
import { Link, Outlet } from "react-router-dom";
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

export default function Layout() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = localStorage.getItem("id");
  const [active, setActive] = useState({
    activeHome: true,
    activeBooking: false,
    activeHistory: false,
    activePeople: false,
    activeMyAcc: false,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
  };
  return (
    <div className="ps-3 pt-3" style={{ height: "100vh" }}>
      <Box className="mx-4 d-flex align-items-center justify-content-between text-center">
        <Typography sx={{ minWidth: 100 }}>
          <Link
            className="linkNormal"
            to="/"
            onClick={() => handleMenuItemClick(1)}
          >
            <b className="heading text-black">GrabApp</b>
            <MenuIcon fontSize="large" className="textGreen1" />
          </Link>
        </Typography>
        <div>
          <Badge color="error" variant="dot" overlap="circular">
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
            <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
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
            My account
          </MenuItem>
        </Link>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="medium" className="iconMenuAcc" />
          </ListItemIcon>
          Logout
        </MenuItem>
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
                active.activeHome === true
                  ? "menuActive my-2"
                  : "menuInactive my-2"
              }
            >
              {active.activeHome === true ? (
                <HomeFilled className="iconColor" />
              ) : (
                <HomeOutlined className="iconColor" />
              )}
              <span className="ms-1 textColor">Home</span>
            </MenuItem>
          </Link>
          <Link
            to="/booking"
            className="linkNormal"
            onClick={() => handleMenuItemClick(2)}
          >
            <MenuItem
              className={
                active.activeBooking === true
                  ? "menuActive my-2"
                  : "menuInactive my-2"
              }
            >
              <FontAwesomeIcon
                icon={
                  active.activeBooking === true
                    ? faSolidCalendar
                    : faRegularCalendar
                }
                className="iconColor"
              />
              <span className="ms-1 textColor">Booking</span>
            </MenuItem>
          </Link>
          <Link
            to="/history"
            className="linkNormal"
            onClick={() => handleMenuItemClick(3)}
          >
            <MenuItem
              className={
                active.activeHistory === true ? "menuActive" : "menuInactive"
              }
            >
              {/* <FontAwesomeIcon icon={faLocationDot} className="iconColor" /> */}
              {active.activeHistory === true ? (
                <EnvironmentFilled className="iconColor" />
              ) : (
                <EnvironmentOutlined className="iconColor" />
              )}
              <span className="ms-1 textColor">History</span>
            </MenuItem>
          </Link>
          <Link
            to="/people"
            className="linkNormal"
            onClick={() => handleMenuItemClick(4)}
          >
            <MenuItem
              className={
                active.activePeople === true
                  ? "menuActive my-2"
                  : "menuInactive my-2"
              }
            >
              {active.activePeople === true ? (
                <FontAwesomeIcon icon={faUserGroup} className="iconColor" />
              ) : (
                <TeamOutlined className="iconColor" />
              )}

              <span className="ms-1 textColor">People</span>
            </MenuItem>
          </Link>
          <Link
            to={`/users/${id}`}
            className="linkNormal"
            onClick={() => handleMenuItemClick(5)}
          >
            <MenuItem
              className={
                active.activeMyAcc === true
                  ? "menuActive my-2"
                  : "menuInactive my-2"
              }
            >
              <FontAwesomeIcon
                icon={active.activeMyAcc === true ? faSolidUser : faRegularUser}
                className="iconColor"
              />
              <span className="ms-1 textColor">My Account</span>
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
