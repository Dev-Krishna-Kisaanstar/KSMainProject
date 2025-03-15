// client/src/ProtectedRoute.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRouteAdmin = ({ children, isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate(); // Hook for navigation

    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory-admin/dashboard`, {
                    withCredentials: true,
                });
                setAuthenticated(true);
            } catch {
                setAuthenticated(false);
                // User is not authenticated, navigate to login
                setIsLoggedIn(false); // Ensure state is updated before redirection
                navigate('/AdvisorAdminLogin'); // Navigate immediately after state update
            }
        };

        // Check the authentication immediately first
        checkAuth();

        // Set an interval to check the authentication every 15 seconds
        const intervalId = setInterval(() => {
            checkAuth();
        }, 15000); // 15000 milliseconds = 15 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [setIsLoggedIn, navigate]); // Dependency array

    // While checking authentication, show loading
    if (authenticated === null) {
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login
    return authenticated ? children : <Navigate to="/AdvisorAdminLogin" />;
}

export default ProtectedRouteAdmin;
