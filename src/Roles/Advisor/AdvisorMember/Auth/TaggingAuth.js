import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
function TaggingAuth() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const customerToken = Cookies.get('frontendadvisorycustomertoken');

    const mainToken = Cookies.get('advisoryMemberSession');


    if (customerToken) {
      // Inform user they need to submit the tagging
      toast.error('You need to submit the tagging before going back!');
      navigate(`/AdvisorMemberseenewcxdetails/${customerToken}`);
    } else if (mainToken) {

      // If authenticated, navigate to the dashboard
      navigate('/advisory-member-dashboard');

    };

    
  
  }, [navigate]);

return (
  <div>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    <Typography variant="h6">
      Checking for tagging...
    </Typography>
  </div>
);
}

export default TaggingAuth;