import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    SvgAccountManagementIcon,
    SvgAlertNav,
    SvgContactIcon,
    SvgDashboardNav,
    SvgMessagedNav,
    SvgPropertyListNav,
    SvgLogoutIcon,
} from "../../../assets/svg/Svg";
import { ChatProfileThree, Logo, LogoIcon } from "../../../assets/images";
import { useSelector } from "react-redux";

const SideBar = () => {
    const [activeMenu, setActiveMenu] = useState(null); // Track active main menu

    const location = useLocation();
    const activePath = location.pathname;
    const ProfileDetail = useSelector((state) => state.Auth.Details);
    const profiledata = ProfileDetail?.data;
    console.log('profile', profiledata)
    const [image, setImage] = useState({ uri:profiledata?.profile_img, file: '' });


    const sidebarMenu = [
        {
            name: "Dashboard",
            link: "/",
            svg: <SvgDashboardNav />,
        },
        {
            name: "Messages",
            link: "/chat",
            svg: <SvgMessagedNav />,
        },
        {
            name: "Listed Property",
            link: "/property-list",
            svg: <SvgPropertyListNav />,
        },
        {
            name: "Alert",
            link: "/notification",
            svg: <SvgAlertNav />,
        },
        {
            name: "Account management",
            link: "/account-management",
            svg: <SvgAccountManagementIcon />,
        },
        {
            name: "Contact us",
            link: "/contact-us",
            svg: <SvgContactIcon />,
        },
    ];

    const handleToggle = (menuIdx) => {
        const isSidebarCollapsed = document.body.classList.contains("open-sidebar");

        if (!isSidebarCollapsed) {
            setActiveMenu((prevActiveMenu) =>
                prevActiveMenu === menuIdx ? null : menuIdx
            );
        }
    };

    return (
        <aside className="sidenav">
            <div className="sidenav-inner">
                <div className="logo">
                    <span className="logo-lg">
                        <img src={Logo} alt="Logo" />
                    </span>
                    <span className="logo-sm">
                        <img src={LogoIcon} alt="Logo" />
                    </span>
                </div>
                <div className="navbar-inner">
                    <ul>
                        {sidebarMenu.map((menu, idx) =>
                            menu.name === "Account management" ||
                                menu.name === "Contact us" ? null : (
                                <li
                                    key={idx}
                                    className={`menu-item ${activeMenu === idx ? "menu-accordion active" : ""
                                        }`}
                                    onMouseEnter={() =>
                                        document.body.classList.contains("open-sidebar") &&
                                        setActiveMenu(idx)
                                    }
                                    onMouseLeave={() =>
                                        document.body.classList.contains("open-sidebar") &&
                                        setActiveMenu(null)
                                    }
                                >
                                    <Link
                                        onClick={(e) => {
                                            if (document.body.classList.contains("open-sidebar")) {
                                                e.preventDefault(); // Disable click when sidebar is collapsed
                                            } else {
                                                handleToggle(idx);
                                            }
                                        }}
                                        to={!menu.submenus ? menu.link : "#"}
                                        className={`menu-link ${activePath === menu.link || activeMenu === idx
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
                                            className={`menu-sub menu-sub-accordion menu-active-bg ${activeMenu === idx ? "max-h-400" : "max-h-0"
                                                }`}
                                        >
                                            {menu.submenus.map((subMenu, subIdx) => (
                                                <div key={subIdx} className="menu-item">
                                                    <Link
                                                        className={`menu-link ${activePath === subMenu.link ? "active" : ""
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
                            )
                        )}
                        <div className="nav-position">
                            {sidebarMenu.map(
                                (menu, idx) =>
                                    (menu.name === "Account management" ||
                                        menu.name === "Contact us" ||
                                        menu.name === "Logout") && (
                                        <li
                                            key={idx}
                                            className={`menu-item ${activeMenu === idx ? "menu-accordion active" : ""
                                                }`}
                                            onMouseEnter={() =>
                                                document.body.classList.contains("open-sidebar") &&
                                                setActiveMenu(idx)
                                            }
                                            onMouseLeave={() =>
                                                document.body.classList.contains("open-sidebar") &&
                                                setActiveMenu(null)
                                            }
                                        >
                                            <Link
                                                onClick={(e) => {
                                                    if (
                                                        document.body.classList.contains("open-sidebar")
                                                    ) {
                                                        e.preventDefault(); // Disable click when sidebar is collapsed
                                                    } else {
                                                        handleToggle(idx);
                                                    }
                                                }}
                                                to={!menu.submenus ? menu.link : "#"}
                                                className={`menu-link ${activePath === menu.link || activeMenu === idx
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
                                                    className={`menu-sub menu-sub-accordion menu-active-bg ${activeMenu === idx ? "max-h-400" : "max-h-0"
                                                        }`}
                                                >
                                                    {menu.submenus.map((subMenu, subIdx) => (
                                                        <div key={subIdx} className="menu-item">
                                                            <Link
                                                                className={`menu-link ${activePath === subMenu.link ? "active" : ""
                                                                    }`}
                                                                to={subMenu.link}
                                                            >
                                                                <span className="bullet-dot"></span>
                                                                <span className="menu-title">
                                                                    {subMenu.name}
                                                                </span>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    )
                            )}
                            <div className="sidebarnav-profile">
                                <Link to="#" className="navprofle-main">
                                    <div className="chat-user-bg">
                                        <span
                                            style={{ backgroundImage: `url(${profiledata?.profile_img})` }}
                                        ></span>
                                        <em className="online"></em>
                                    </div>
                                    <h4>{profiledata?.name}</h4>
                                    <p>{profiledata?.email}</p>
                                </Link>
                                <SvgLogoutIcon />
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </aside>
    );
};

export default SideBar;
