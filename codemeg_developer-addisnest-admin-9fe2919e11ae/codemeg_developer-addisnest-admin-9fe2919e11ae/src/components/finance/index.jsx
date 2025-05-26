import React from "react";
import CommanHeader from "../common/common-header/CommonHeader";
import FinanceList from "./sub-component/FinanceList";

const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Finance"} />
        <FinanceList />
      </div>
    </>
  );
};

export default index;
