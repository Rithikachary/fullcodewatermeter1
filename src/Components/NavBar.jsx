import React, { useState, useRef, useEffect } from "react";
import "./NavBar.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
//import Notification from "./Notification"; // Notification list component
//import Profile from "./profile";

const NavBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationDropdownRef = useRef(null); // Ref for the notification dropdown

  // Toggle the notifications dropdown
  const toggleNotifications = (e) => {
    setShowNotifications((prev) => !prev);
    e.stopPropagation(); // Prevent click event from propagating to document
  };

  // Close the notification dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target) &&
        !event.target.closest(".notify-icon") // Make sure clicks outside the icon and dropdown close the dropdown
      ) {
        setShowNotifications(false);
      }
    };

    // Add event listener for outside click
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); // Empty dependency array to ensure this effect runs once

  return (
    <nav className="navbar">
      {/* Left side - Logo or Title */}
      <div className="navbar-left"></div>

      {/* Right side */}
      <div className="navbar-right">
        {/* Notification Icon */}
        <button
          className="notify-icon"
          aria-label="Notifications"
          onClick={toggleNotifications}
        >
          <NotificationsIcon />
        </button>

        {/* Notification Dropdown 
        {showNotifications && (
          <div
            className={`notification-dropdown ${showNotifications ? "show" : ""}`}
            ref={notificationDropdownRef} // Attach ref to the dropdown
          >
            <Notification />
          </div>
        )} */}

        {/* Logout Button 
        <Profile /> */}
      </div>
    </nav>
  );
};

export default NavBar;
