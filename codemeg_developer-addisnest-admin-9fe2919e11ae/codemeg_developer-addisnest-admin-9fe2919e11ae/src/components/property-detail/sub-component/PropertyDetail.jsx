import React, { useEffect, useState } from "react";
import {
  ProfileImg,
  PropertyImg1,
  PropertyImg2,
  PropertyImg3,
  PropertyImg4,
  DummyHome
} from "../../../assets/images";
import {
  SvgActionViewIcon,
  SvgBounder,
  SvgBulding,
  SvgCarParking,
  SvgClock,
  SvgHouse,
  SvgLocationIcon,
  SvgSquare,
  SvgThermom,
} from "../../../assets/svg/Svg";
import { useParams } from "react-router-dom";
import Api from "../../../Apis/Api";
const baseURL = import.meta.env.VITE_BASEURL;

const PropertyDetail = () => {
  const { agentId, propertyId } = useParams();
  const [agentMoreinfo, setAgentMoreinfo] = useState(null);
  const [PropertyDetails, setPropertyDetails] = useState({});

  useEffect(() => {
    const fetchAgentAndPropertyDetails = async () => {
      try {
        const response = await Api.get(`${baseURL}users/agents/${agentId}`);
        const agentData = response.data;
        setAgentMoreinfo(agentData);

        const property = agentData?.properties.find(
          (prop) => prop.id.toString() === propertyId.toString()
        );
        setPropertyDetails(property)
        console.log("Property Details:", property);
      } catch (error) {
        console.error("Error fetching agent or property details:", error);
      }
    };


    // Case 2: When only `propertyId` is available
    const fetchPropertyDetails = async () => {
      try {
        const response = await Api.get(`${baseURL}properties/${propertyId}`);
        setPropertyDetails(response.data);
        console.log("Property Details:", response.data.media);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };

    if (agentId && propertyId) {
      // Fetch both agent and property details
      fetchAgentAndPropertyDetails();
    } else if (propertyId) {
      // Only fetch property details
      fetchPropertyDetails();
    }

  }, [agentId, propertyId]);



  const getMonthsSinceListing = (createdAt) => {
    if (!createdAt) return null;

    const createdDate = new Date(createdAt);
    const now = new Date();

    const yearsDiff = now.getFullYear() - createdDate.getFullYear();
    const monthsDiff = now.getMonth() - createdDate.getMonth();

    const totalMonths = yearsDiff * 12 + monthsDiff;

    return totalMonths;
  };

  const getImageUrl = (item) => {
    if (!item) return DummyHome;
    if (typeof item === 'string') return item;
    if (item?.filePath) return item.filePath;
    return DummyHome;
  };



  const price = PropertyDetails.price; // 15000
  const size = parseFloat(PropertyDetails.property_size); // 185.81

  const pricePerSqm = size ? Math.round(price / size) : 0;


  return (
    <div className="property-deatil-section">
      <div className="property-detail-main">
        {/* <div className="property-image-list">
          <div className="property-inner-60">
            <div className="property-img-1">
              <span style={{ backgroundImage: `url(${PropertyImg1})` }}></span>
            </div>
          </div>
          <div className="property-inner-40">
            <div className="property-rght-main">
              <div className="property-img-2">
                <span
                  style={{ backgroundImage: `url(${PropertyImg2})` }}
                ></span>
              </div>
              <div className="property-rght-flx">
                <div className="property-inner-50">
                  <div className="property-img-3">
                    <span
                      style={{ backgroundImage: `url(${PropertyImg3})` }}
                    ></span>
                  </div>
                </div>
                <div className="property-inner-50">
                  <div className="property-img-3">
                    <span
                      style={{ backgroundImage: `url(${PropertyImg4})` }}
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="container">
          <div className="property-img-list">
            <div className="main-flex">
              {PropertyDetails?.media?.slice(0, 4).map((item, index) => (
                <div key={index} className="property-image prpty-img-single">
                  <span
                    style={{ backgroundImage: `url("${getImageUrl(item)}")` }}
                    onError={(e) =>
                      (e.target.style.backgroundImage = `url(${DummyHome})`)
                    }
                  ></span>
                </div>
              ))}

              {PropertyDetails?.media?.length < 4 &&
                Array.from({ length: 4 - (PropertyDetails?.media?.length || 0) }).map(
                  (_, index) => (
                    <div
                      key={`dummy-${index}`}
                      className="property-image prpty-img-single"
                    >
                      <span
                        style={{
                          backgroundImage: `url(${DummyHome})`,
                        }}
                      ></span>
                    </div>
                  )
                )}
            </div>
          </div>
        </div>


        <div className="property-detail-status">
          <div className="house-status">
            <span className="text-title">House For {PropertyDetails.propertyFor || "N/A"}</span>
            <span className="badge success-badge f-12 dot-icon">{PropertyDetails.status || "Pending"}</span>
          </div>
          <div className="posted-status">
            <SvgClock />
            <p>
              Posted <span>13 hour</span> ago
            </p>
          </div>
          <div className="posted-status">
            <SvgActionViewIcon />
            <p>{PropertyDetails.viws || "N/A"}</p>
          </div>
          <div className="posted-status">
            <h6>Listed By :</h6>
            <p>Polar Denis (Agent)</p>
          </div>
        </div>
        <div className="prpty-content-inner">
          <div className="prpty-content-heading">
            <h3>ETB {PropertyDetails.price ? PropertyDetails.price.toLocaleString() : "N/A"}</h3>

            <div className="prptey-loction">
              <div className="prpty-loction-adress">
                <span>
                  <SvgLocationIcon />
                </span>
                <p>
                  {PropertyDetails.address || "N/A"} , <span> {PropertyDetails.city || "N/A"} </span>
                </p>
              </div>
              <div className="prptey-fecility">
                <span>N/A</span>
                <span>
                  <em></em>{PropertyDetails?.bathroom_information?.length || "N/A"} bath
                </span>
                <span>
                  <em></em>Size {PropertyDetails?.property_size}
                </span>
              </div>
            </div>
            <div className="propty-desc-detl">
              <h4>Description</h4>
              <p>
                {PropertyDetails?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="proptydetil-abt-main">
          <div className="proptydetail-abtheading">
            <h5>About Place</h5>
          </div>
          <ul>
            <li>
              <div className="abt-inner-list">
                <span>
                  <SvgClock />
                </span>
                <p>{getMonthsSinceListing(PropertyDetails.createdAt)} Mos on Ethionest</p>
              </div>
            </li>
            <li>
              <div className="abt-inner-list">
                <span>
                  <SvgThermom />
                </span>
                <p>{PropertyDetails?.heating_information?.type} & {PropertyDetails?.cooling_information?.type}</p>
              </div>
            </li>
            <li>
              <div className="abt-inner-list">
                <span>
                  <SvgHouse />
                </span>
                <p>Single Family</p>
              </div>
            </li>
            <li>
              <div className="abt-inner-list">
                <span>
                  <SvgBounder />
                </span>
                <p>{PropertyDetails?.property_size} sqm. Lot</p>
              </div>
            </li>
            <li>
              <div className="abt-inner-list">
                <span>
                  <SvgSquare />
                </span>
                <p>ETB{pricePerSqm} Per sqm.</p>
              </div>
            </li>
            <li>
              <div className="abt-inner-list">
                <span>
                  <SvgBulding />
                </span>
                <p>N/A</p>
              </div>
            </li>
            <li>
              <div className="abt-inner-list">
                <span>
                  <SvgCarParking />
                </span>
                <p>N/A</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
