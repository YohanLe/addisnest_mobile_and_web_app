import React from "react";
import SellListTable from "./sub-component/SellListTable";
import CommanHeader from "../../common/common-header/CommonHeader";

const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Sell List"} />
        <SellListTable />
      </div>
    </>
  );
};

export default index;
