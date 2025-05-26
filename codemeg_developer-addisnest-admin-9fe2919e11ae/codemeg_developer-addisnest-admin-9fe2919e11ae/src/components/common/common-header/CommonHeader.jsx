import React from "react";
import { Link } from "react-router-dom";

const CommanHeader = ({ title, type }) => {
  return (
    <>
      <div className="breadcrumb-main">
        <div className="breadcrumb-inner">
          <div className="page-title">
            <h3>{title}</h3>
          </div>
          <div className="btns-evnts">
            {type == "1" ? (
              <div className="btns-evnts-inner">
                <Link
                  to="/add-salesperson"
                  className="btn btn-primary btnwth-icon"
                >
                  Add Salesperson
                </Link>
              </div>
            ) : type == "2" ? (
              <>
                <div className="btns-evnts-inner">
                  <Link
                    to="/user-manegement/add-sub-admin"
                    className="btn btn-primary btnwth-icon"
                  >
                    Add Sub-admin
                  </Link>
                </div>
              </>
            ): (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommanHeader;
