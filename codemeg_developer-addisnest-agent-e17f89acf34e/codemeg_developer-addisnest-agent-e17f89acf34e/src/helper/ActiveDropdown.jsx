import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DeletePopup from "./DeletePopup";
import { SvgDeleteIcon, SvgEditPencelIcon, SvgSoldIcon } from "../assets/svg/Svg";
import { useDispatch } from "react-redux";

const ActiveDropdown = ({ item }) => {
    const dispatch = useDispatch();
    const [currentItem, setCurrentItem] = useState(null);
    const [position, setPosition] = useState("down"); // Track position of the dropdown (up or down)
    const kebabIconRef = useRef(null); // Ref for kebab-icon
    const dropdownRef = useRef(null); // Ref for the dropdown
    const [ItemData, setItemData] = useState('');
    const [showDeletePopup, setDeletePopup] = useState(false);
    
    const [loading, setIsLoading] = useState(false);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                kebabIconRef.current &&
                !kebabIconRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setCurrentItem(null); // Close the dropdown
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setCurrentItem((prev) => (prev === 0 ? null : 0)); // Toggle for single kebab-icon

        setTimeout(() => {
            if (kebabIconRef.current && dropdownRef.current) {
                const kebabRect = kebabIconRef.current.getBoundingClientRect();
                const dropdownHeight = dropdownRef.current.offsetHeight;
                const spaceBelow = window.innerHeight - kebabRect.bottom;
                const spaceAbove = kebabRect.top;

                if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                    setPosition("up");
                } else {
                    setPosition("down");
                }
            }
        }, 0);
    };

    const handleDeletePopup = (item) => {
        setItemData(item);
        setDeletePopup(true); // Show delete popup
    };

 
    const StatusUpdatefun = async () => {
        let body={
            propertyId:item?.propertyId,
            status:'Sold',
        }
        setIsLoading(true);
        try {
            const response = await Api.postWithtoken(`properties/${ItemData?.id}`,body);
            const data = response;
            toast.success(data?.message);
            handlePopup();
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="kebab-main">
            <div className="kebab-icon" ref={kebabIconRef}>
                <span onClick={toggleDropdown}>
                    Action
                    <svg
                        width="11"
                        height="7"
                        viewBox="0 0 11 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M9.5 1.5L5.5 5.5L1.5 1.5"
                            stroke="#24292E"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
            {currentItem === 0 && (
                <div
                    className={`kebab-dropdown ${position === "up" ? "open-up" : ""}`}
                    ref={dropdownRef}
                    style={{ zIndex: 1000 }} // Ensuring dropdown appears on top
                >
                    <ul>
                        <li>
                            <Link to={`/property-form?id=${item?.id || item?.propertyId}`}>
                                <span>
                                    <SvgEditPencelIcon />
                                </span>
                                Edit
                            </Link>
                        </li>
                        <li onClick={(e) => e.stopPropagation()}>
                            <a onClick={() => handleDeletePopup(item)} className="delete-btn">
                                <span>
                                    <SvgDeleteIcon />
                                </span>
                                Delete Post
                            </a>
                        </li>
                        <li>
                            <Link onClick={()=>{StatusUpdatefun(item)}}>
                                <span>
                                    <SvgSoldIcon />
                                </span>
                                Sold
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
            {showDeletePopup && <DeletePopup handlePopup={setDeletePopup} ItemData={ItemData} />}
        </div>
    );
};

export default ActiveDropdown;
