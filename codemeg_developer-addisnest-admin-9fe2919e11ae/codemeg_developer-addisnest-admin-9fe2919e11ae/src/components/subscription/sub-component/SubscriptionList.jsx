import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SvgActionEditIcon, SvgActionTrashIcon } from "../../../assets/svg/Svg";
import EditSubscriptionPopup from "../../../helper/EditSubscriptionPopup";
import DeletePopup from "../../../helper/DeletePopup";
import { fetchSubscriptions } from "../../../Redux-store/Slices/SubscriptionSlice";
import Api from "../../../Apis/Api";

const SubscriptionList = () => {
  const dispatch = useDispatch();
  const { subscriptions, loading, error } = useSelector((state) => state.Subscription);

  const [currentItem, setCurrentItem] = useState(null);
  const selectRefs = useRef([]);

  useEffect(() => {
    dispatch(fetchSubscriptions());
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

  const [showEditSubscriptionPopup, setEditSubscriptionPopup] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const handleEditSubscriptionPopupToggle = () => {
    setEditSubscriptionPopup((prev) => !prev);
  };

  const handleEditClick = (subscription) => {
    setSelectedSubscription(subscription);
    setEditSubscriptionPopup(true);
  };

  const handlePopupClose = () => {
    setSelectedSubscription(null);
    setEditSubscriptionPopup(false);
  };

  const [showDeletePopup, setDeletePopup] = useState(false);
  const [subscriptionIdToDelete, setSubscriptionIdToDelete] = useState(null);

  const handleDeletePopupToggle = (id = null) => {
    setSubscriptionIdToDelete(id);
    setDeletePopup((prev) => !prev);
  };

  const handleDeleteConfirm = async () => {
    if (!subscriptionIdToDelete) return;
    setDeletePopup(false);
    try {
      await Api.deleteWithtoken(`admin/subscriptions/${subscriptionIdToDelete}`);
      dispatch(fetchSubscriptions());
      setSubscriptionIdToDelete(null);
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  return (
    <>
      <div className="finance-main">
        <div className="dashborad-details">
          <ul>
            <li>
              <div className="card dashcrd-bdy">
                <div className="card-body">
                  <div className="dash-main">
                    <div className="dash-left">
                      <div className="dash-total">
                        <p>Total Revenue</p>
                        <h3>{subscriptions.reduce((acc, sub) => acc + sub.amount, 0).toLocaleString()}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="responsive-table">
              <table className="table table-row-dashed">
                <thead>
                  <tr>
                    <th className="w-10px text-start">S.no</th>
                    <th className="w-150px text-start">Plan Name</th>
                    <th className="w-150px text-center">Days</th>
                    <th className="w-100px text-center">Amount</th>
                    <th className="w-100px text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">Loading...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="text-center text-danger">{error}</td>
                    </tr>
                  ) : subscriptions.length > 0 ? (
                    subscriptions.map((item, index) => (
                      <tr key={item.id}>
                        <td>#{index + 1}</td>
                        <td className="text-start">{item.planName}</td>
                        <td className="text-center">{item.days}</td>
                        <td className="text-center">
                        <span className="text-success">{item.amount.toLocaleString()}</span>

                        </td>
                        <td className="text-end">
                          <div className="action-main">
                            <div className="action-inner">
                              <div className="action-buttons">
                          <Link
                            to="#"
                            className="edit-action"
                            onClick={() => handleEditClick(item)}
                          >
                            <SvgActionEditIcon />
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
                      <td colSpan="5" className="text-center">No subscriptions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {showEditSubscriptionPopup && (
        <EditSubscriptionPopup
          subscription={selectedSubscription}
          handlePopup={handlePopupClose}
          refreshList={() => dispatch(fetchSubscriptions())}
        />
      )}
      {showDeletePopup && <DeletePopup handlePopup={handleDeletePopupToggle} handleDeleteConfirm={handleDeleteConfirm} />}
    </>
  );
};

export default SubscriptionList;
