import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { AuthUserDetails } from '../Redux-store/Slices/AuthSlice';

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    let location = useLocation();
    if(localStorage.getItem('isLogin')==='1'){
       
    }else{
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

export default ProtectedRoute;
