import React from "react";
import { GraphImag } from "../../../assets/images";

const GraphHome = () => {
  return (
    <div>
      <div className="porperty-recomnender">
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <h3>Property Recommendation</h3>
            </div>
          </div>
          <div className="card-body">
            <div className="graph-img">
              <img src={GraphImag} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphHome;
