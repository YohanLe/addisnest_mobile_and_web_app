import  { useEffect, useRef, useState } from "react";
import { ProfileImg } from "../../../../assets/images";
import { SvgActionTrashIcon, SvgActionViewIcon } from "../../../../assets/svg/Svg";
import DeletePopup from "../../../../helper/DeletePopup";
import Pagination from "../../../../helper/Pagination";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellList } from "../../../../Redux-store/Slices/SellListSlice";
import Api from "../../../../Apis/Api";

const SellListTable = () => {
  const dispatch = useDispatch();
  const { properties, loading, error, totalPages } = useSelector(
    (state) => state.SellList
  );

  const [currentItem, setCurrentItem] = useState(null);
  const selectRefs = useRef([]);
  const [showDeletePopup, setDeletePopup] = useState(false);
  const [propertyIdToDelete, setPropertyIdToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchSellList());
  }, [dispatch]);

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

  const handleDeletePopupToggle = (id = null) => {
    setPropertyIdToDelete(id);
    setDeletePopup((prev) => !prev);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyIdToDelete) return;
    setDeletePopup(false);
    try {
      await Api.deleteWithtoken(`properties/${propertyIdToDelete}`);
      dispatch(fetchSellList());
      setPropertyIdToDelete(null);
    } catch (error) {
      console.error("Error deleting property:", error);
    }
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
                    <input type="text" placeholder="Search" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="responsive-table">
            <table className="table table-row-dashed">
              <thead>
                <tr>
                  <th className="w-10px text-start">S.no</th>
                  <th className="w-250px text-start">Property Detail</th>
                  <th className="w-70px text-center">Property Type</th>
                  <th className="w-150px text-start">Listed by</th>
                  <th className="w-70px text-center">Rate</th>
                  <th className="w-70px text-center">Status</th>
                  <th className="w-70px text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {properties && properties.length > 0 ? (
                  properties.map((item, index) => (
                    <tr key={item.id}>
                      <td>#{index + 1}</td>
                      <td className="text-start">
                        <div className="usrdtls-td">
                          <div className="proptery-bg">
                            <span
                              style={{
                                backgroundImage: `url(${item.media?.filePath || ProfileImg
                                  })`,
                              }}
                            ></span>
                          </div>
                          <div className="prd-descrp propty-width">
                            <span className="d-block titl-view">{item.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{item.property_type || "N/A"}</td>
                      <td className="text-start">
                        <div className="usrdtls-td">
                          <div className="userprfl-bg">
                            <span
                              style={{
                                backgroundImage: `url(${item.user?.profile_img || ProfileImg
                                  })`,
                              }}
                            ></span>
                          </div>
                          <div className="prd-descrp">
                            <span className="d-block titl-view">{item.user?.name || "N/A"}</span>
                            <span className="d-block titl-userid">User</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                      <span className="text-success">{item.price ? `$${item.price.toLocaleString()}` : "N/A"}</span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${item.status && item.status.toLowerCase() === "active"
                              ? "success-badge"
                              : "danger-badge"
                            }`}
                        >
                          {item.status || "N/A"}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="action-main">
                          <div className="action-inner">
                            <div className="action-buttons">
                              <Link
                                to={`/property-detail/${item.id}`}
                                className="view-action"
                              >
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
                    <td colSpan="7" className="text-center">
                      {loading ? "Loading..." : error ? error : "No properties found."}
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

export default SellListTable;
