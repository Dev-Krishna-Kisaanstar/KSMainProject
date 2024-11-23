import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './Login.css'; // Custom styles

// This component handles user login and registration with token caching.
function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');

  const toggleForms = () => {
    setIsSignup((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isSignup ? '/api/customers/register' : '/api/customers/login';
    const method = 'POST';

    const body = isSignup
      ? JSON.stringify({
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          password: formData.password,
        })
      : JSON.stringify({
          mobileNumber: formData.mobileNumber,
          password: formData.password,
        });

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.json();

      if (response.ok) {
        console.log(isSignup ? "User registered successfully" : "User logged in successfully");
        console.log(data);
        if (!isSignup && data.token) {
          localStorage.setItem('token', data.token); // Store JWT token in localStorage
          console.log(`JWT Token stored: ${data.token}`);
        }
      } else {
        console.error("Error:", data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error, please try again.");
    }
  };

  return (
    <div className="login-global d-flex align-items-center justify-content-center vh-100">
      <section className={`login-wrapper ${isSignup ? 'active' : ''} p-5 rounded shadow bg-primary text-white`}>
        <div className="login-form signup">
          <header onClick={toggleForms} className="mb-4 cursor-pointer">Signup</header>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="form-control mb-3" 
              placeholder="Full name" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required 
            />
            <input 
              type="text" 
              className="form-control mb-3" 
              placeholder="Mobile number" 
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required 
            />
            <input 
              type="password" 
              className="form-control mb-3" 
              placeholder="Password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
            {error && <div className="text-danger mb-3">{error}</div>}
            <input type="submit" className="btn btn-light btn-block" value="Signup" />
          </form>
        </div>

        <div className="login-form login mt-4">
          <header onClick={toggleForms} className="mb-4 cursor-pointer">Login</header>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="form-control mb-3" 
              placeholder="Mobile number" 
              name="mobileNumber" 
              value={formData.mobileNumber} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="password" 
              className="form-control mb-3" 
              placeholder="Password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
            {error && <div className="text-danger mb-3">{error}</div>}
            <a href="#" className="text-white">Forgot password?</a>
            <input type="submit" className="btn btn-light btn-block mt-3" value="Login" />
          </form>
        </div>
      </section>
    </div>
  );
}

export default Login;