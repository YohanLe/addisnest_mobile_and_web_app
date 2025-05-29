import React, { useState } from "react";
import PropertyListTable from "./sub-component/PropertyListTable";

const PropertyList = () => {
  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="content-header-left">
          <h2 className="content-title">Property List</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Property List
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="content-body">
        <PropertyListTable />
      </div>
    </div>
  );
};

export default PropertyList;
