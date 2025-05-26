import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DeletePopup from "../../../../helper/DeletePopup";
import Pagination from "../../../../helper/Pagination";
import { SvgActionTrashIcon, SvgActionViewIcon } from "../../../../assets/svg/Svg";
import { ProfileImg } from "../../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "../../../../Redux-store/Slices/UserListSlice";
import Api from "../../../../Apis/Api";

const UserListTable = () => {
  const dispatch = useDispatch();
  const { customers, loading, error, totalPages, currentPage: reduxCurrentPage } = useSelector(
    (state) => state.UserList
  );

  const [currentItem, setCurrentItem] = useState(null);
  const selectRefs = useRef([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceTimeout = useRef(null);

  const fetchUsers = useCallback(
    (page, search) => {
      dispatch(fetchUserList({ page, search }));
    },
    [dispatch]
  );

  // Debounce effect for searchTerm
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 2000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm]);

  // Fetch users when currentPage or debouncedSearchTerm changes
  useEffect(() => {
    fetchUsers(currentPage, debouncedSearchTerm);
  }, [fetchUsers, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    setCurrentPage(reduxCurrentPage);
  }, [reduxCurrentPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        currentItem !== null &&
        selectRefs.current[currentItem] &&
        !selectRefs.current[currentItem].contains(event.target)
      ) {
        setCurrentItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentItem]);

  const handleItemClick = (index) => {
    setCurrentItem(currentItem === index ? null : index);
  };
  const [showDeletePopup, setDeletePopup] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const handleDeletePopupToggle = (id = null) => {
    setUserIdToDelete(id);
    setDeletePopup((prev) => !prev);
  };

const handleDeleteConfirm = async () => {
  if (!userIdToDelete) return;
  setDeletePopup(false);
  try {
    const response = await Api.postWithtoken(`users/users/${userIdToDelete}`, {}); 
    if (response.success) { 
      fetchUsers(currentPage, debouncedSearchTerm); // Call useCallback function
      setUserIdToDelete(null);
      // Optional: toast.success("User deleted successfully!");
    } else {
      throw new Error(response.message || "Delete failed");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="card-header search-tabing-header">
            <div className="card-filtr">
              <div className="fltr-inner">
                <div className="fltrsrch-input">
                  <label>
                    <span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.167 15.833c3.682 0 6.667-2.985 6.667-6.667S12.848 2.5 9.167 2.5 2.5 5.485 2.5 9.167s2.985 6.666 6.667 6.666z"
                          stroke="#797979"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.5 17.5l-3.333-3.333"
                          stroke="#797979"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="responsive-table">
            <table className="table table-row-dashed">
              <thead>
                <tr>
                  <th className="w-250px text-start">User Name</th>
                  <th className="w-250px text-Start">Contact Detail</th>
                  <th className="w-250px text-center">Address</th>
                  <th className="w-250px text-center">City</th>
                  <th className="w-70px text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {customers && customers.length > 0 ? (
                  customers.map((item) => (
                    <tr key={item.id}>
                      <td className="text-start">
                        <div className="usrdtls-td">
                          <div className="userprfl-bg">
                            <span
                              style={{
                                backgroundImage: `url(${
                                  item.profile_img || ProfileImg
                                })`,
                              }}
                            ></span>
                          </div>
                          <div className="prd-descrp">
                            <span className="d-block titl-view">{item.name}</span>
                            <span className="d-block titl-userid">#{item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="text-title">{item.email}</span>
                        <span className="text-title">{item.phone || "N/A"}</span>
                      </td>
                      <td className="text-center">{item.address || "N/A"}</td>
                      <td className="text-center"> {/* City data not provided in API response */} N/A </td>
                      <td className="text-end">
                        <div className="action-main">
                          <div className="action-inner">
                            <div className="action-buttons">
                              <Link to={`/user-detail/${item.id}`} className="view-action">
                                <SvgActionViewIcon />
                              </Link>
                            </div>
                          </div>
                          <div className="action-inner">
                            <div className="action-buttons">
                              <span
                                className="trash-action"
                                onClick={() => handleDeletePopupToggle(item.id)}
                              >
                                <SvgActionTrashIcon />
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      {loading
                        ? "Loading..."
                        : error
                        ? typeof error === "string"
                          ? error
                          : error.message || JSON.stringify(error)
                        : "No users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      {showDeletePopup && (
        <DeletePopup
          handlePopup={handleDeletePopupToggle}
          handleDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};

export default UserListTable;
