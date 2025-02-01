import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    const decodedToken = jwtDecode(token);
    const userRole = Number(decodedToken?.role);
    
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return React.isValidElement(children) ? children : <>{children}</>;
};

export default ProtectedRoute;
