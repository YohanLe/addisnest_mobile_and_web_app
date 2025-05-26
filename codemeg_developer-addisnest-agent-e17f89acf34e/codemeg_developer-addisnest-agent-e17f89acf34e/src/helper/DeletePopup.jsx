import React, { useState } from "react";
import { SvgActionTrashIcon } from "../assets/svg/Svg";
import Api from "../Apis/Api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
const DeletePopup = ({ handlePopup, ItemData }) => {
    const dispatch = useDispatch();
    const [loading, setIsLoading] = useState(false);
    const Deletefun = async () => {
        setIsLoading(true);
        try {
            const response = await Api.postWithtoken(`properties/${ItemData?.id}`);
            const data = response;
            toast.success(data?.message);
            handlePopup();
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <div className="main-popup action-modal delete-modal">
                <div className="lm-outer">
                    <div className="lm-inner">
                        <div className="popup-inner">
                            <div className="popup-body">
                                <div className="modal-common">
                                    <div className="modal-common-dtls">
                                        <div className="circle-modal-icon danger-circle">
                                            <span>
                                                <SvgActionTrashIcon />
                                            </span>
                                        </div>
                                        <h3>Delete</h3>
                                        <p>Are you sure you want to delete ?</p>
                                    </div>

                                    <div className="modal-btn">
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => { handlePopup(false) }}
                                        >
                                            No, Delete
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            onClick={Deletefun}
                                        >
                                            Yes, Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="popup-overlay" onClick={handlePopup}></div>
            </div>
        </>
    );
};

export default DeletePopup;
