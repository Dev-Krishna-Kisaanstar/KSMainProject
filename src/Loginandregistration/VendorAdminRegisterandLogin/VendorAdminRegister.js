import { toast, ToastContainer } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VendorAdminRegister = () => {
  const [employmentId, setEmploymentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [dobError, setDobError] = useState(""); // Error for date of birth
  const navigate = useNavigate();

  const handleDobChange = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();

    // Adjust age if the birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setDobError("You must be at least 18 years old to register.");
      setDateOfBirth("");
    } else {
      setDobError("");
      setDateOfBirth(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dobError) return; // Prevent submission if there's a DOB error

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/vendor-admin/register`,
        {
          employmentId,
          fullName,
          dateOfBirth,
          officialEmail,
        }
      );
      setMessage(response.data.message);
      setEmploymentId("");
      setFullName("");
      setDateOfBirth("");
      setOfficialEmail("");
      navigate("/login");
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
      toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header text-center">
              <h4>Vendor Admin Registration</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="employmentId" className="form-label">
                    Employment ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="employmentId"
                    value={employmentId}
                    onChange={(e) => setEmploymentId(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={handleDobChange}
                    required
                  />
                  {dobError && (
                    <div className="text-danger mt-2">
                      {dobError}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="officialEmail" className="form-label">
                    Official Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="officialEmail"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
              {message && (
                <div className="alert alert-info mt-3 text-center" role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add this at the top of your app */}
      <ToastContainer />
    </div>
  );
};

export default VendorAdminRegister;