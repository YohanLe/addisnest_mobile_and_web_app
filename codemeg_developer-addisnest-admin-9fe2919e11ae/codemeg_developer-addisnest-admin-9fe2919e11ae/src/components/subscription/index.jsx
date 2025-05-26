import React, { useState } from "react";
import SubscriptionList from "./sub-component/SubscriptionList";
import CommanHeader from "../common/common-header/CommonHeader";
import { Link } from "react-router-dom";
import AddSubscriptionPopup from "../../helper/AddSubscriptionPopup";

const index = () => {
    const [showAddSubscriptionPopup, setAddSubscriptionPopup] = useState(false);
    const handleAddSubscriptionPopupToggle = () => {
      setAddSubscriptionPopup((prev) => !prev);
    };

  return (
    <>
      <div className="main-wrapper">
        <div className="commen-flex-main">
          <CommanHeader title={"Subscription List"} />
          <div className="subscription-btn">
            <Link
              to="#"
              className="btn btn-primary"
              onClick={handleAddSubscriptionPopupToggle}
            >
              Add Subscription
            </Link>
          </div>
        </div>
        <SubscriptionList />
      </div>
      {showAddSubscriptionPopup && (
        <AddSubscriptionPopup handlePopup={handleAddSubscriptionPopupToggle} />
      )}
    </>
  );
};

export default index;
