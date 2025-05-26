import React from "react";
import RentListTable from "./sub-component/RentListTable";
import CommanHeader from "../../common/common-header/CommonHeader";

const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Rent List"} />
        <RentListTable />
      </div>
    </>
  );
};

export default index;
