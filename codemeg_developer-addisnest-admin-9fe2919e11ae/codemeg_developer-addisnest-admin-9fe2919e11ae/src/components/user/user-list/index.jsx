import React from "react";
import CommanHeader from "../../common/common-header/CommonHeader";
import UserListTable from "./sub-component/UserListTable";

const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"User List"} />
        <UserListTable />
      </div>
    </>
  );
};

export default index;
