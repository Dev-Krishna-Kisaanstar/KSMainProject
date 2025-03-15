import React, { useState } from 'react';
import './MobileLogin.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
import  { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const MobileLogin = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNumber: '',
        password: '',
        advisorName: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('customerSession');
        if (token) {
            navigate('/'); // Redirect to dashboard if already logged in
        }
    }, [navigate]);

    const toggleForms = () => {
        setIsSignup(!isSignup);
        setError(''); // Reset error on toggle
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isSignup ? '/register' : '/login';
        const body = isSignup
            ? {
                fullName: formData.fullName,
                mobileNumber: formData.mobileNumber,
                password: formData.password,
                advisorName: formData.advisorName || 'Registered by self',
              }
            : {
                mobileNumber: formData.mobileNumber,
                password: formData.password,
              };

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/customers${endpoint}`, body, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.status === 201 || response.status === 200) {
                const message = isSignup ? 'User registered successfully' : 'User logged in successfully';
                toast.success(message);

                if (!isSignup && response.data.token) {
                    Cookies.set('customerSession', response.data.token, { expires: 1 / 12 }); // Store for approximately 2 hours
                    console.log('Token received:', response.data.token);
                    navigate('/'); // Redirect to the dashboard
                }
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Network error, please try again.';
            setError(message);
            toast.error(message);
        }
    };

    return (
        <div>
        <div className="login-global d-flex align-items-center justify-content-center vh-100">
            <section className={`icontainer p-5 rounded shadow ${isSignup ? 'flip' : ''}`}>
                <div className="btn-container">
                    <label className="switch btn-color-mode-switch">
                        <input 
                            value="1" 
                            id="color_mode" 
                            name="color_mode" 
                            type="checkbox" 
                            onChange={toggleForms} 
                            checked={isSignup} 
                        />
                        <label className="btn-color-mode-switch-inner" data-off="Sign In" data-on="Sign Up" htmlFor="color_mode"></label>
                    </label>
                </div>
                <div className="heading">{isSignup ? 'Sign Up' : 'Sign In'}</div>
                <form className="form" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>} {/* Error alert */}
                    {isSignup && (
                        <input
                            required
                            className="input"
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            minLength={7}
                        />
                    )}
                    <input
                        required
                        className="input"
                        type="text"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        pattern="\d{10}"
                        title="Mobile number must be exactly 10 digits."
                    />
                    <input
                        required
                        className="input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {isSignup && (
                        <input
                            className="input"
                            type="text"
                            name="advisorName"
                            placeholder="Advisor Name (Optional)"
                            value={formData.advisorName}
                            onChange={handleChange}
                        />
                    )}
                    <button className="login-button" type="submit">
                        {isSignup ? 'Register' : 'Login'}
                    </button>
                </form>
            </section>
        </div>
        <ToastContainer />
    </div>
    
    );
};

export default MobileLogin;