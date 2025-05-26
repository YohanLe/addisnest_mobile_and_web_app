import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SvgAgentNav,
  SvgDashboardNav,
  SvgFinanceNav,
  SvgNotificationNav,
  SvgPropertyNav,
  SvgSubscriptionNav,
  SvgUserNav,
} from "../../../assets/svg/Svg";
import { Logo } from "../../../assets/images";

const SideBar = () => {
  const [activeMenu, setActiveMenu] = useState(null); // Track active main menu
  const [activeSubMenu, setActiveSubMenu] = useState(null); // Track active submenu

  const location = useLocation();
  const activePath = location.pathname;

  const sidebarMenu = [
    {
      name: "Dashboard",
      link: "/",
      svg: <SvgDashboardNav />,
    },
    {
      name: "User",
      link: "/user-list",
      svg: <SvgUserNav />,
    },
    {
      name: "Agent",
      link: "/agent-list",
      svg: <SvgAgentNav />,
    },
    {
      name: "Property",
      svg: <SvgPropertyNav />,
      submenus: [
        {
          name: "Sell",
          link: "/sell-list",
        },
        {
          name: "Rent",
          link: "/rent-list",
        },
      ],
    },
    {
      name: "Subscription",
      link: "/subscription",
      svg: <SvgSubscriptionNav />,
    },
    // {
    //   name: "Notification",
    //   link: "/notification",
    //   svg: <SvgNotificationNav />,
    // },
    {
      name: "Finance",
      link: "/finance",
      svg: <SvgFinanceNav />,
    },
  ];

  const handleToggle = (menuIdx, submenuIdx = null) => {
    // Check if the sidebar is collapsed
    const isSidebarCollapsed = document.body.classList.contains("open-sidebar");

    // Prevent menu toggle if sidebar is collapsed and user clicks on main menu
    if (isSidebarCollapsed) {
      return;
    }

    if (submenuIdx === null) {
      setActiveMenu((prevActiveMenu) =>
        prevActiveMenu === menuIdx ? null : menuIdx
      );
      setActiveSubMenu(null);
    } else {
      setActiveMenu(menuIdx);
      setActiveSubMenu(submenuIdx);
    }
  };

  const removeClass = () => {
    document.body.classList.remove("open-sidebar");
  };

  return (
    <aside className="sidenav">
      <div className="sidenav-inner">
        <div className="logo">
          <span className="logo-lg">
            <img src={Logo} alt="Logo" />
          </span>
        </div>
        <div className="navbar-inner">
          <ul>
            {sidebarMenu.map((menu, idx) => (
              <li
                key={idx}
                className={`menu-item ${
                  activeMenu === idx ? "menu-accordion active" : ""
                }`}
              >
                <Link
                  onClick={() => handleToggle(idx)}
                  to={!menu.submenus ? menu.link : "#"}
                  className={`menu-link ${
                    activePath === menu.link || activeMenu === idx
                      ? "active"
                      : ""
                  }`}
                >
                  <span className="menu-icon">{menu.svg}</span>
                  <span className="menu-title">{menu.name}</span>
                  {menu.submenus && <span className="menu-arrow"></span>}
                </Link>
                {menu.submenus && (
                  <div
                    className={`menu-sub menu-sub-accordion menu-active-bg ${
                      activeMenu === idx ? "max-h-400" : "max-h-0"
                    }`}
                  >
                    {menu.submenus.map((subMenu, subIdx) => (
                      <div key={subIdx} className="menu-item">
                        <Link
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(idx, subIdx);
                          }}
                          className={`menu-link ${
                            activePath === subMenu.link ? "active" : ""
                          }`}
                          to={subMenu.link}
                        >
                          <span className="bullet-dot"></span>
                          <span className="menu-title">{subMenu.name}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div onClick={removeClass} className="close-menu">
          <span></span>
        </div>
      </div>
      <div className="overlay-sidebar" onClick={removeClass}></div>
    </aside>
  );
};

export default SideBar;
