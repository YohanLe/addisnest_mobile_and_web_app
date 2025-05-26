import React, { useEffect } from "react";
import CommanHeader from "../../common/common-header/CommonHeader";
import { AgentDetail, PropertyList } from "./sub-component";
import { useDispatch } from "react-redux";
import { fetchAgentDetails } from "../../../Redux-store/Slices/AgentDetailsSlice";
import { useParams } from "react-router-dom";

const Index = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(fetchAgentDetails(id));
    }
  }, [id, dispatch]);

  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Agent Detail"} />
        <AgentDetail />
        <PropertyList />
      </div>
    </>
  );
};

export default Index;
