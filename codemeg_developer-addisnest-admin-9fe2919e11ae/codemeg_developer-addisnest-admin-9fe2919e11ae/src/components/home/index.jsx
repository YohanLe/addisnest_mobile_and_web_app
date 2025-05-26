import React from "react";
import CommanHeader from "../common/common-header/CommonHeader";
import { GraphHome, OverallHistory } from "./sub-component";

const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Dashboard"} />
        <OverallHistory />
        <GraphHome/>
      </div>
    </>
  );
};

export default index;
