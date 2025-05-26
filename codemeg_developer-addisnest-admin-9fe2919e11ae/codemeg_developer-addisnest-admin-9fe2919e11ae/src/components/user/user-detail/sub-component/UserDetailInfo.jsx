import React from "react";
import { useSelector } from "react-redux";

const UserDetailInfo = () => {
  const userDetailsState = useSelector((state) => state.userDetails);
  const userData = userDetailsState && userDetailsState.data ? userDetailsState.data.data : null;

  if (!userData) {
    return <div>Loading user details...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3>User Information</h3>
        </div>
      </div>
      <div className="card-body">
        <div className="ordr-infrmtion">
          <div className="userdtl-card">
            <div className="userdtl-inner">
              <div className="brnd-vndrnmbr">
                <p>Date Of Registration</p>
                <h4>{new Date(userData.createdAt).toLocaleDateString()}</h4>
              </div>

              <div className="brnd-vndrnmbr">
                <p>Address</p>
                <h4>{userData.address || "N/A"}</h4>
              </div>
              <div className="brnd-vndrnmbr">
                <p>Total Purchase</p>
                <h4>{userData.totalPurchase || 0}</h4>
              </div>
            </div>
            <div className="userdtl-inner">
              <div className="brnd-vndrnmbr">
                <p>Email</p>
                <h4>{userData.email || "N/A"}</h4>
              </div>
              <div className="brnd-vndrnmbr">
                <p>Phone No.</p>
                <h4>{userData.phone || "N/A"}</h4>
              </div>
              <div className="brnd-vndrnmbr">
                <p>Total Sell</p>
                <h4>{userData.totalSell || 0}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailInfo;
