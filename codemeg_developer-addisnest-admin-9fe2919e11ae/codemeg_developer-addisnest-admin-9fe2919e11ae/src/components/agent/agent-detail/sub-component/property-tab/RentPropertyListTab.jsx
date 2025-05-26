import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PropertyImg } from "../../../../../assets/images";
import { SvgActionTrashIcon, SvgActionViewIcon } from "../../../../../assets/svg/Svg";
import DeletePopup from "../../../../../helper/DeletePopup";
import { useSelector, useDispatch } from "react-redux";
import { fetchAgentPropertyDetails, clearAgentPropertyDetails } from "../../../../../Redux-store/Slices/AgentDetailsSlice";

const RentPropertyListTab = () => {
  const [currentItem, setCurrentItem] = useState(null);
  const [showDeletePopup, setDeletePopup] = useState(false);

  const selectRefs = useRef([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  const agentPropertyState = useSelector((state) => state.agentDetails);
  const agentPropertyCompletData = agentPropertyState?.data?.data || null;
  const agentId = agentPropertyState.agentPropertyData?.data?.id || id;


  console.log(agentPropertyCompletData , "agentPropertyState");
  useEffect(() => {
    if (id) {
      dispatch(fetchAgentPropertyDetails({ id, propertyFor: "rent" }));
    }
    return () => {
      dispatch(clearAgentPropertyDetails());
    };
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        
        currentItem !== null &&
        selectRefs.current[currentItem] &&
        !selectRefs.current[currentItem].contains(event.target)
      ) {
        setCurrentItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentItem]);

  if (!agentPropertyCompletData) {
    return <div>Loading agent details...</div>;
  }

 
  const handleDeletePopupToggle = () => {
    setDeletePopup((prev) => !prev);
  };



  return (
    <>
      <div className="responsive-table">
        <table className="table table-row-dashed">
          <thead>
            <tr>
              <th className="w-10px text-start">S.no</th>
              <th className="w-250px text-start">Property Detail</th>
              <th className="w-70px text-center">Property Type</th>
              <th className="w-70px text-center">Rate</th>
              <th className="w-70px text-center">Status</th>
              <th className="w-70px text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {agentPropertyCompletData.properties.map((item, index) => (
              <tr key={item.id || item.Id || index}>
                <td>#{index + 1}</td>
                <td className="text-start">
                  <div className="usrdtls-td">
                    <div className="proptery-bg">
                      <span
                        style={{
                          backgroundImage: `url(${item?.media[0]?.filePath || PropertyImg})`,
                        }}
                      ></span>
                    </div>
                    <div className="prd-descrp propty-width">
                      <span className="d-block titl-view">
                        {item.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="text-center">{item.property_type || "N/A"}</td>
                <td className="text-center">
                  <span className="text-success">{item.price || "N/A"}</span>
                </td>
                <td className="text-center">
                  <span
                    className={`badge ${
                      item.status === "Active" || "ACTIVE"
                        ? "success-badge"
                        : "danger-badge"
                    }`}
                  >
                    {item.status || "N/A"}
                  </span>
                </td>
                <td className="text-end">
                  <div className="action-main">
                    <div className="action-inner">
                      <div className="action-buttons">
                        <Link to={`/property-detail/${agentId}/${item.id}`} className="view-action">
                          <SvgActionViewIcon />
                        </Link>
                      </div>
                    </div>
                    <div className="action-inner">
                      <div className="action-buttons">
                        <span className="trash-action" onClick={handleDeletePopupToggle}>
                          <SvgActionTrashIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeletePopup && <DeletePopup handlePopup={handleDeletePopupToggle} />}

    </>
  );
};
export default RentPropertyListTab;
