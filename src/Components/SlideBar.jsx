import React, { useState, useEffect } from "react";
import "./SlideBar.css";
// import AnalyticsIcon from "@mui/icons-material/Analytics";
 import SettingsIcon from "@mui/icons-material/Settings";
// import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PublicIcon from "@mui/icons-material/Public";
import { useNavigate } from "react-router-dom";
 import logo from "../logo.png";
 import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

 

const SlideBar = () => {
  const navigate = useNavigate();

  const [menuState, setMenuState] = useState(() => {
    const savedState = localStorage.getItem("menuState");
    return savedState
      ? JSON.parse(savedState)
      : {
          analytics: true,
          configure: true,
          userManagement: true, // Separate state for User Management
          areaManagement: true, // Separate state for Area Management
          datareports: true,
        };
  });

  const [activeSubMenu, setActiveSubMenu] = useState(() => {
    return localStorage.getItem("activeSubMenu") || null;
  });

  // Save menuState and activeSubMenu to localStorage on change
  useEffect(() => {
    localStorage.setItem("menuState", JSON.stringify(menuState));
  }, [menuState]);

  useEffect(() => {
    localStorage.setItem("activeSubMenu", activeSubMenu);
  }, [activeSubMenu]);

  const toggleMenu = (menuName) => {
    setMenuState((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  const handledashboard = () => {
    setActiveSubMenu(null);
    navigate("/dashboard");
  };

  const handleSubMenuClick = (item, route) => {
    setActiveSubMenu(item);
    navigate(route);
  };

  const isActive = (item) => (activeSubMenu === item ? "active" : "");

  return (
    <div className="sidebar">
      <div className="navbar-logo">
        <img src={logo} alt="Company Logo" className="logo-img" />
      </div>
      <div
        className={`heading ${isActive("dashboard")}`}
        style={{ marginTop: "-10px" }}
        onClick={handledashboard}
      >
        DASHBOARD
      </div>
 
      <ul className="menu-list" style={{ marginTop: "-5px" }}>
       
      {/*  <li className="menu-item" style={{ marginTop: "-5px" }}>
          <div
            onClick={() => toggleMenu("userManagement")}
            className="menu-title"
          >
            <ManageAccountsIcon />
            <span className="menu-text">User Management</span>
            <span className="arrow">
              {menuState.userManagement ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          </div>
          {menuState.userManagement && (
            <ul className="sub-menu">
              <li
                className={`sub-menu-item ${isActive("client")}`}
                onClick={() =>
                  handleSubMenuClick("client", "/usermanagement/client")
                }
              >
                Role Management
              </li>
              <li
                className={`sub-menu-item ${isActive("operator")}`}
                onClick={() =>
                  handleSubMenuClick("operator", "/usermanagement/operator")
                }
              >
                User Management
              </li>
              <li
                className={`sub-menu-item ${isActive("meter")}`}
                onClick={() =>
                  handleSubMenuClick("meter", "/usermanagement/meters")
                }
              >
                Meter
              </li>
            </ul>
          )}
        </li> */}

        {/* Area Management Section */}
        <li className="menu-item" style={{ marginTop: "-5px" }}>
          <div
            onClick={() => toggleMenu("areaManagement")}
            className="menu-title"
          >
            <PublicIcon />
            <span className="menu-text">Area Management</span>
            <span className="arrow">
              {menuState.areaManagement ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          </div> 
          {menuState.areaManagement && (
            <ul className="sub-menu">
              <li
                className={`sub-menu-item ${isActive("hierarchytitle")}`}
                onClick={() =>
                  handleSubMenuClick(
                    "hierarchytitle",
                    "/areamanagement/hierarchytitle"
                  )
                }
              >
                 Hierarchy Title
              </li>
              </ul> )}
              {menuState.areaManagement && (
            <ul className="sub-menu">
             
              <li
                className={`sub-menu-item ${isActive("datahierarchy")}`}
                onClick={() =>
                  handleSubMenuClick(
                    "datahierarchy",
                    "/areamanagement/datahierarchy"
                  )
                }
              >
                Add Hierarchy
              </li>
              </ul> )}
             {/*  <li
                className={`sub-menu-item ${isActive("metermap")}`}
                onClick={() =>
                  handleSubMenuClick(
                    "metermap",
                    "/areamanagement/metermap"
                  )
                }
              >
                Meter Mapping
              </li>
             
            </ul>
          )}
        </li>

        {/* Analytics Section *
        <li className="menu-item">
          <div
            onClick={() => toggleMenu("datareports")}
            className="menu-title"
          >
            <AnalyticsIcon />
            <span className="menu-text">Data Reports</span>
            <span className="arrow">
              {menuState.datareports ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          </div>
          {menuState.datareports && (
            <ul className="sub-menu">
              <li
                className={`sub-menu-item ${isActive("regionalreports")}`}
                onClick={() =>
                  handleSubMenuClick(
                    "regionalreports",
                    "/datareports/regionalreports"
                  )
                }
              >
                Regional Reports
              </li>
              <li
                className={`sub-menu-item ${isActive("customdate")}`}
                onClick={() =>
                  handleSubMenuClick("customdate", "/analytics/customdate")
                }
              >
                Custom Date
              </li>
              <li
                className={`sub-menu-item ${isActive("meterreports")}`}
                onClick={() =>
                  handleSubMenuClick("meterreports", "/datareports/meterreports")
                }
              >
                Meter Reports
              </li>
            </ul>
          )} */}
        </li>

        {/* Configure Section */}
        <li className="menu-item" style={{ marginTop: "-5px" }}>
          <div onClick={() => toggleMenu("configure")} className="menu-title">
            <SettingsIcon />
            <span className="menu-text">Configure</span>
            <span className="arrow">
              {menuState.configure ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </span>
          </div>
          {menuState.configure && (
            <ul className="sub-menu">
            {/* {  <li
                className={`sub-menu-item ${isActive("time")}`}
                onClick={() => handleSubMenuClick("time", "/configure/time")}
              >
                Time
              </li>} */}
              {/* <li
                className={`sub-menu-item ${isActive("rtc")}`}
                onClick={() => handleSubMenuClick("rtc", "/configure/rtc")}
              >
                RTC
              </li> */}
               <li
                className={`sub-menu-item ${isActive("addmeter")}`}
                onClick={() => handleSubMenuClick("addmeter", "/configure/addmeter")}
              >
                Add Meter
              </li>
               <li
                className={`sub-menu-item ${isActive("allmeters")}`}
                onClick={() => handleSubMenuClick("allmeters", "/configure/allmeters")}
              >
                All Meters
              </li>
              <li
                className={`sub-menu-item ${isActive("metermap")}`}
                onClick={() =>
                  handleSubMenuClick(
                    "datahierarchy",
                    "/configure/metermap"
                  )
                }
              >
                Meter Mapping
              </li>
              {/* <li
                className={`sub-menu-item ${isActive("meterdetails")}`}
                onClick={() => handleSubMenuClick("meterdetails", "/configure/meterdetails")}
              >
                Meter Details
              </li> */}
              <li
                className={`sub-menu-item ${isActive("server")}`}
                onClick={() => handleSubMenuClick("server", "/configure/mqtt")}
              >
                Server
              </li>
              
              {/* <li
                className={`sub-menu-item ${isActive("alerts")}`}
                onClick={() => handleSubMenuClick("alerts", "/configure/alerts")}
              >
                Alerts
              </li> */}
            </ul>
          )}
        </li>  
      </ul>
    </div>
  );
};

export default SlideBar;
