import { Link } from "react-router-dom";
import { Property3 } from "../../../assets/images";
import ActiveDropdown from "../../../helper/ActiveDropdown";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetPropertyList } from "../../../Redux-store/Slices/PropertyListSlice";
import DeletePopup from "../../../helper/DeletePopup";

const MyListProperty = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("");
    const tabs = ["All", "Active", "Sold", "Pending", "Rejected"];
    const [ItemData, setItemData] = useState('');
    const [showDeletePopup, setDeletePopup] = useState(false);
    const PropertData = useSelector((state) => state.PropertyList.Data);
    const PropertyList = PropertData?.data?.data;
 
    useEffect(() => {
        if (activeTab === 'All') {
            dispatch(GetPropertyList({ type: '' }));
        } else {
            dispatch(GetPropertyList({ type: activeTab }));
        }

    }, [activeTab])

    const handleDeletePopup = (item) => {
        setItemData(item)
        setDeletePopup((p) => !p);
    };

    return (
        <>
            <div className="container">
                <div className="bradcrumb-top">
                    <div className="bradcrumb-title">
                        <h3>My Listings</h3>
                        <span>{PropertyList?.length}</span>
                    </div>
                    <div className="property-list-tabbing">
                        <ul>
                            {tabs.map((tab) => (
                                <li key={tab} onClick={() => setActiveTab(tab)}>
                                    <div
                                        className={`propertylist-tabtitle ${activeTab === tab ? "active" : ""
                                            }`}
                                    >
                                        <p>{tab}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bradcrumb-btn">
                        <Link to="/property-form" className="btn btn-primary">
                            List Property <span>+</span>
                        </Link>
                    </div>
                </div>
                <div className="proprety-list-tabel">
                    <div className="responsive-table">
                        <table className="table table-row-dashed">
                            <thead>
                                <tr>
                                    <th className="w-10px text-start">S.no</th>
                                    <th className="w-100px text-start">Picture</th>
                                    <th className="w-250px text-start">Address</th>
                                    <th className="w-150px text-center">Type</th>
                                    <th className="w-100px text-center">Status</th>
                                    <th className="w-250px text-center">Price</th>
                                    <th className="w-70px text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PropertyList?.length > 0 ? (
                                    PropertyList && PropertyList.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td className="text-start">
                                                <div className="usrdtls-td">
                                                    <div className="proptery-bg">
                                                        <span
                                                            style={{
                                                                backgroundImage: `url(${item?.media[0]?.filePath})`,
                                                            }}
                                                        ></span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-start">
                                                <span className="font-text">{item?.address}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="font-text">{item?.property_type}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${item?.status}`}>
                                                    {item?.status}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="price-tbl">
                                                    <span>Overall Price</span>
                                                    <h5>ETB {item?.price}</h5>
                                                    <p>ETB {item?.price} per sqm</p>
                                                </div>
                                            </td>
                                            <td className="text-end">
                                                <div className="action-main">
                                                    <div className="action-inner">
                                                        <span className="action-dropdownmain">
                                                            <ActiveDropdown item={item} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            No properties found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    );
};

export default MyListProperty;
