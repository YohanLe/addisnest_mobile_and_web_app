import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DashGraph1,
  DashGraph2,
  DashGraph3,
  DashGraph4,
  DashGraph5,
} from "../../../assets/images";
import { fetchDashboardStats } from "../../../Redux-store/Slices/DashboardSlice";

const OverallHistory = () => {
  const dispatch = useDispatch();
  const { roleCounts, propertyCounts, loading, error } = useSelector(
    (state) => state.Dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <>
      <div className="dashborad-details">
        <ul>
          <li>
            <div className="card dashcrd-bdy">
              <div className="card-body">
                <div className="dash-main">
                  <div className="dash-left">
                    <div className="dash-total">
                      <p>Total User</p>
                      <h3>{roleCounts.CUSTOMER || 0}</h3>
                    </div>
                  </div>
                  <div className="dash-right">
                    <div className="dash-img">
                      <img src={DashGraph1} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="card dashcrd-bdy">
              <div className="card-body">
                <div className="dash-main">
                  <div className="dash-left">
                    <div className="dash-total">
                      <p>Total Agent</p>
                      <h3>{roleCounts.AGENT || 0}</h3>
                    </div>
                  </div>
                  <div className="dash-right">
                    <div className="dash-img">
                      <img src={DashGraph2} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="card dashcrd-bdy">
              <div className="card-body">
                <div className="dash-main">
                  <div className="dash-left">
                    <div className="dash-total">
                      <p>Sold Property</p>
                      <h3>{propertyCounts.sell || 0}</h3>
                    </div>
                  </div>
                  <div className="dash-right">
                    <div className="dash-img">
                      <img src={DashGraph3} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="card dashcrd-bdy">
              <div className="card-body">
                <div className="dash-main">
                  <div className="dash-left">
                    <div className="dash-total">
                      <p>Rented Property</p>
                      <h3>{propertyCounts.rent || 0}</h3>
                    </div>
                  </div>
                  <div className="dash-right">
                    <div className="dash-img">
                      <img src={DashGraph4} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li>
            <div className="card dashcrd-bdy">
              <div className="card-body">
                <div className="dash-main">
                  <div className="dash-left">
                    <div className="dash-total">
                      <p>Overall Property</p>
                      <h3>{propertyCounts.total || 0}</h3>
                    </div>
                  </div>
                  <div className="dash-right">
                    <div className="dash-img">
                      <img src={DashGraph5} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      {loading && <p>Loading...</p>}
      {error && (
        <p style={{ color: "red" }}>
          {typeof error === "string"
            ? error
            : error.message
            ? error.message
            : JSON.stringify(error)}
        </p>
      )}
    </>
  );
};

export default OverallHistory;
