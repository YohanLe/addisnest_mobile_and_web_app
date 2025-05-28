import { Link } from "react-router-dom";
import { Property3 } from "../../../assets/images";
import { SvgActionTrashIcon } from "../../../assets/svg-files/SvgFiles";
import ActiveDropdown from "../../../Helper/ActiveDropdown";
import { GetHomeData } from "../../../Redux-store/Slices/HomeSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const MyListProperty = () => {
    const dispatch = useDispatch();
    const HomeData = useSelector((state) => state.Home.HomeData);
    const HomeList = HomeData?.data?.data;
    useEffect(() => {
        dispatch(GetHomeData({ type: 'sell' }));
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
            <section className="breadcrumb-section">
                <div className="container">
                    <div className="bradcrumb-top">
                        <div className="bradcrumb-title">
                            <h3>My Listings</h3>
                        </div>
                        <div className="bradcrumb-btn">
                            <Link to="/property-form" className="btn btn-primary">
                                List Property <span>+</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <section className="property-list-section">
                <div className="container">
                    <div className="proprety-list-tabel">
                        <div className="responsive-table">
                            <table className="table table-row-dashed">
                                <thead>
                                    <tr>
                                        <th className="w-10px text-start">S.no</th>
                                        <th className="w-100px text-start">Picture</th>
                                        <th className="w-175px text-start">Address</th>
                                        <th className="w-150px text-center">Type</th>
                                        <th className="w-100px text-center">Status</th>
                                        <th className="w-250px text-center">Price</th>
                                        <th className="w-70px text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {HomeList && HomeList.map((item, index) => (
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
                                                            <ActiveDropdown />
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default MyListProperty;
