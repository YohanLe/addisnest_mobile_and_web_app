import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { AuthUserDetails } from '../Redux-store/Slices/AuthSlice';
import Api, { addAccessToken }  from "../Apis/Api"

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    let location = useLocation();
    if(localStorage.getItem('isLogin') == '1'){
        addAccessToken(localStorage.getItem('access_token'));
        dispatch(AuthUserDetails());
    }else{
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

export default ProtectedRoute;
