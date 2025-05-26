import React from "react";
import PropertyListForm from "./sub-component/PropertyListForm";
// import LocationPopupMain from "../location-popup/LocationPopupMain";

const index = () => {
    return (
        <>
            <div className="main-wrapper">
                <PropertyListForm />
                {/* <LocationPopupMain /> */}
            </div>
        </>
    );
};

export default index;
