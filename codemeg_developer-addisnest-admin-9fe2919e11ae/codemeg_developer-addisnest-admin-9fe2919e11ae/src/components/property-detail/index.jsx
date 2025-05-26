import React from "react";
import CommanHeader from "../common/common-header/CommonHeader";
import PropertyDetail from "./sub-component/PropertyDetail";

const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Property Detail"} />
        <PropertyDetail />
      </div>
    </>
  );
};

export default index;
