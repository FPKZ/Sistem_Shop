import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import LoadingPage from "./LoadingPage"

import { Container, Row, Col} from "react-bootstrap";

export default function ProtectedRoute() {
    const { isAutenticated, loading, verificLogin } = useAuth();
    const location = useLocation()

    useEffect(() => {
        verificLogin()
    },[location])


    if (loading) return <LoadingPage />

    return isAutenticated() ? <Outlet /> : <Navigate to="/login"/>;
    
}