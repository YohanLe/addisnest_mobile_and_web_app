import React from "react";
import CommanHeader from "../common/common-header/CommonHeader";
import { ProfileForm } from "./sub-component";
const index = () => {
  return (
    <>
      <div className="main-wrapper">
        <CommanHeader title={"Profile"} />
        <ProfileForm />
      </div>
    </>
  );
};

export default index;
