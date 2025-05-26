import { useSelector } from "react-redux";

const AgentDetail = () => {
  const agentDetailsState = useSelector((state) => state.agentDetails);
  const agentData = agentDetailsState && agentDetailsState.data ? agentDetailsState.data.data : null;

  if (!agentData) {
    return <div>Loading agent details...</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <h3>Agent Information</h3>
        </div>
      </div>
      <div className="card-body">
        <div className="ordr-infrmtion">
          <div className="userdtl-card">
            <div className="userdtl-inner">
              <div className="brnd-vndrnmbr">
                <p>Date Of Registration</p>
                <h4>{new Date(agentData.createdAt).toLocaleDateString()}</h4>
              </div>

              <div className="brnd-vndrnmbr">
                <p>Address</p>
                <h4>{agentData.address || "N/A"}</h4>
              </div>
              <div className="brnd-vndrnmbr">
                <p>Total Rent</p>
                <h4>{agentData.totalRent || 0}</h4>
              </div>
            </div>
            <div className="userdtl-inner">
              <div className="brnd-vndrnmbr">
                <p>Email</p>
                <h4>{agentData.email || "N/A"}</h4>
              </div>
              <div className="brnd-vndrnmbr">
                <p>Phone No.</p>
                <h4>{agentData.phone || "N/A"}</h4>
              </div>
              <div className="brnd-vndrnmbr">
                <p>Total Sell</p>
                <h4>{agentData.totalSell || 0}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;
