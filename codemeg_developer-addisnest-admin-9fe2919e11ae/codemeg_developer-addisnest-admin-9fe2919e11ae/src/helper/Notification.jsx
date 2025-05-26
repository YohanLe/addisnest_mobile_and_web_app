import { useEffect } from "react";
import { SvgCloseIcon } from "../assets/svg/Svg";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications } from "../Redux-store/Slices/AdminNotidicationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const openNotifyPopup = () => {
    document.body.classList.toggle("show-notification-modal");
  };

  return (
    <>
      <div className="notification-modal">
        <div className="notification-head">
          <div className="notification-head-title">
            <h3>Notification</h3>
          </div>
          <div className="notification-close">
            <span onClick={openNotifyPopup}>
              <SvgCloseIcon />
            </span>
          </div>
        </div>
        <ul>
          {loading && <li>Loading notifications...</li>}
          {error && <li>Error loading notifications: {error}</li>}
          {!loading && !error && notifications && notifications.length === 0 && (
            <li>No notifications available</li>
          )}
          {!loading &&
            !error &&
            notifications &&
            notifications.map((notification) => (
              <li key={notification.id || notification._id}>
                <div className="noticard-dtl">
                  <div className="notiprfl-descrp">
                    <h3>{notification.title || "Notification"}</h3>
                    <div className="advrtise-date">
                      <p>{notification.date || notification.createdAt || "Date not available"}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <div className="notification-overlay" onClick={openNotifyPopup}></div>
      </div>
    </>
  );
};

export default Notification;
