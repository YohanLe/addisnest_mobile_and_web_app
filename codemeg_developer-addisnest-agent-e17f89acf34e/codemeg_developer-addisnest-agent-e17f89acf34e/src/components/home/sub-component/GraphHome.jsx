import React, { useEffect } from "react";
import { GraphImag } from "../../../assets/images";
import DatePickerInput from "../../../helper/DatePickerInput";
import Select from "react-select";
import { SvgFillDangerArrowIcon, SvgFillSuccessArrowIcon } from "../../../assets/svg/Svg";
import { useDispatch, useSelector } from "react-redux";
import { GetDashboardList } from "../../../Redux-store/Slices/DashboardListSlice";
const GraphHome = () => {
    const SelectClient = [
        { value: "All", label: "All" },
        { value: "Weekly", label: "Weekly" },
        { value: "Monthly", label: "Monthly" },
        { value: "Yearly", label: "Yearly" },
    ];

    const dispatch = useDispatch();
    const DashboardData = useSelector((state) => state.DashboardList.Data);
    const DashboardList = DashboardData?.data?.data;
    console.log('______________dashboard',DashboardList)
    useEffect(() => {
        dispatch(GetDashboardList());
    }, [])

    return (
        <div>
            <div className="porperty-recomnender">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <h3>Performance Metrics</h3>
                        </div>
                        <div className="desbord-slection-auth">
                            <div className="dbddate-pickar">
                                <DatePickerInput />
                            </div>
                            <div className="desbord-select-box">
                                <Select options={SelectClient} placeholder="Select" />
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="deshbord-revenu-main">
                            <ul>
                                <li>
                                    <div className="deshbrd-auth-revenue">
                                        <p>Impression</p>
                                        <h4>
                                            3665{" "}
                                            <span className="text-success">
                                                <em>
                                                    <SvgFillSuccessArrowIcon />
                                                </em>
                                                10.78%
                                            </span>
                                        </h4>
                                    </div>
                                </li>
                                <li>
                                    <div className="deshbrd-auth-revenue">
                                        <p>Visitors</p>
                                        <h4>
                                            3665{" "}
                                            <span className="text-danger">
                                                <em>
                                                    <SvgFillDangerArrowIcon />
                                                </em>
                                                10.78%
                                            </span>
                                        </h4>
                                    </div>
                                </li>
                                <li>
                                    <div className="deshbrd-auth-revenue">
                                        <p>Phone view</p>
                                        <h4>
                                            3665{" "}
                                            <span className="text-success">
                                                <em>
                                                    <SvgFillSuccessArrowIcon />
                                                </em>
                                                10.78%
                                            </span>
                                        </h4>
                                    </div>
                                </li>
                            </ul>
                        </div>
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
