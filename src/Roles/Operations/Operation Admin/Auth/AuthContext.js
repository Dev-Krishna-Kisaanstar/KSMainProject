// client/src/useAuth.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuthOperationAdmin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-admin/dashbord`, { withCredentials: true });
                // If authenticated, navigate to the dashboard
                navigate('/OperationAdminDashboard');
            } catch (error) {
                // User is not logged in, navigate to advisormemberlogin
                console.log('User is not logged in');
                navigate('/OperationAdminLogin');
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
    }, [navigate]);
};

export default useAuthOperationAdmin;