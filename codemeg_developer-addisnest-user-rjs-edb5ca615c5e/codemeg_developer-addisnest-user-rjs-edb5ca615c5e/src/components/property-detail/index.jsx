import React, { useEffect } from "react";
import PropertyDetail from "./sub-component/PropertyDetail";
import PropertyDetailPayment from "./sub-component/PropertyDetailPayment";
import PropertyListSlider from "./sub-component/PropertyListSlider";
import { useDispatch, useSelector } from "react-redux";
import { GetPropertyDetail } from "../../Redux-store/Slices/PropertyDetailSlice";
import { useParams } from "react-router-dom";
import { GetHomeData } from "../../Redux-store/Slices/HomeSlice";

const index = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const PropertyData = useSelector((state) => state.PropertyDetail.data);
    const PropertyDetails = PropertyData?.data?.data;
    useEffect(() => {
        dispatch(GetPropertyDetail({ id: id}));
    }, [id]);

    const HomeData = useSelector((state) => state.Home.HomeData);
    const HomeList = HomeData?.data?.data;

    useEffect(() => {
        if(PropertyDetails){
            dispatch(GetHomeData({ type:PropertyDetails?.propertyFor}));
        }
    }, [PropertyDetails]);
    return (
        <>
            <div className="main-wrapper">
                <PropertyDetail PropertyDetails={PropertyDetails}/>
                <PropertyDetailPayment PropertyDetails={PropertyDetails}/>
                <PropertyListSlider HomeList={HomeList}/>
            </div>
        </>
    );
};

export default index;
