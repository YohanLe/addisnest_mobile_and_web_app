import React from "react";
import CommanHeader from "../../common/common-header/CommonHeader";
import AgentListTable from "./sub-component/AgentListTable";

const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Agent List"} />
        <AgentListTable />
      </div>
    </>
  );
};

export default index;
