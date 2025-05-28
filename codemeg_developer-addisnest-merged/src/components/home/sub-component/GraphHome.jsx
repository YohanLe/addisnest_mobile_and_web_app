import React, { useEffect } from "react";
import DatePickerInput from "../../../helper/DatePickerInput";
import Select from "react-select";
import { SvgFillDangerArrowIcon, SvgFillSuccessArrowIcon } from "../../../assets/svg/Svg";
import { useDispatch, useSelector } from "react-redux";
import { GetDashboardList } from "../../../Redux-store/Slices/DashboardListSlice";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
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

    // Chart configuration
    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Property Views',
                data: DashboardList?.monthly_views || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            },
            {
                label: 'Phone Views',
                data: DashboardList?.monthly_phone_views || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Performance Overview',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Views per Month',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Months',
                },
            },
        },
    };

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
                                            {DashboardList?.impression || 0}{" "}
                                            <span className="text-success">
                                                <em>
                                                    <SvgFillSuccessArrowIcon />
                                                </em>
                                                {DashboardList?.impression_percentage || 0}%
                                            </span>
                                        </h4>
                                    </div>
                                </li>
                                <li>
                                    <div className="deshbrd-auth-revenue">
                                        <p>Visitors</p>
                                        <h4>
                                            {DashboardList?.visitors || 0}{" "}
                                            <span className={DashboardList?.visitors_percentage >= 0 ? "text-success" : "text-danger"}>
                                                <em>
                                                    {DashboardList?.visitors_percentage >= 0 ? 
                                                        <SvgFillSuccessArrowIcon /> : 
                                                        <SvgFillDangerArrowIcon />
                                                    }
                                                </em>
                                                {Math.abs(DashboardList?.visitors_percentage || 0)}%
                                            </span>
                                        </h4>
                                    </div>
                                </li>
                                <li>
                                    <div className="deshbrd-auth-revenue">
                                        <p>Phone view</p>
                                        <h4>
                                            {DashboardList?.phone_view || 0}{" "}
                                            <span className={DashboardList?.phone_view_percentage >= 0 ? "text-success" : "text-danger"}>
                                                <em>
                                                    {DashboardList?.phone_view_percentage >= 0 ? 
                                                        <SvgFillSuccessArrowIcon /> : 
                                                        <SvgFillDangerArrowIcon />
                                                    }
                                                </em>
                                                {Math.abs(DashboardList?.phone_view_percentage || 0)}%
                                            </span>
                                        </h4>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="graph-img" style={{height: '400px', padding: '20px'}}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraphHome;
