import React from "react";
import NotificationList from "./sub-component/NotificationList";
import CommanHeader from "../common/common-header/CommonHeader";

const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Notification List"} />
        <NotificationList />
      </div>
    </>
  );
};

export default index;
