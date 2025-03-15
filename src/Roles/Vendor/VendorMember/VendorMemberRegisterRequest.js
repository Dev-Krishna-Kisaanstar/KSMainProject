import React, { useState } from 'react';
import { TextField, Button, Stepper, Step, StepLabel, Typography, Paper, InputAdornment } from '@mui/material'; // Correct import of InputAdornment
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';

const STEPS = [
    { label: "Personal Details" },
    { label: "Shop Details" },
    { label: "Bank Details" },
    { label: "KYC" },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    borderRadius: '10px',
    boxShadow: theme.shadows[5],
}));



function VendorMemberRegisterRequest() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        profilephoto: '',
        fullName: '',
        mobileNumber: '',
        alternateMobileNumber: '',
        fullAddress: '',
        emailId: '',
        addressProof: '',
        panCard: '',
        shopName: '',
        shopRegistrationProof: '',
        shopLogo: '',
        shopWebsite: '',
        shopAddress: '',
        shopAddressProof: '',
        gstNo: '',
        gstCertificate: '',
        panImage: '',
        cinNo: '',
        seedLicenseNo: '',
        pesticidesLicenseNo: '',
        fertilizerLicenseNo: '',
        otherLicenseNo: '',
        shopActLicense: '',
        gramPanchayatNoc: '',
        cancelledCheque: '',
        bankAccountNumber: '',
        bankAccountName: '',
        bankCode: '',
        bankName: ''
    });

    const [imagePreviews, setImagePreviews] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];

        // Check image size (limit to 1MB)
        if (file && file.size > 1024 * 1024) {
            toast.error(`${name.replace(/([A-Z])/g, ' $1')} image size exceeds 1MB.`);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviews((prev) => ({
                ...prev,
                [name]: reader.result,
            }));

            setFormData((prev) => ({
                ...prev,
                [name]: reader.result, // Store base64 string
            }));
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = (name) => {
        setImagePreviews((prev) => ({
            ...prev,
            [name]: '',
        }));
        setFormData((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleNext = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, STEPS.length - 1));
    };

    const handlePrev = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    const validateAllFields = () => {
        const mobileRegex = /^\d{10}$/;
        let isValid = true;
        let missingFields = [];

        if (!formData.fullName) {
            missingFields.push("Full Name");
            isValid = false;
        }
        if (!formData.emailId) {
            missingFields.push("Email ID");
            isValid = false;
        }
        if (!formData.mobileNumber || !mobileRegex.test(formData.mobileNumber)) {
            missingFields.push("Mobile Number (must be exactly 10 digits)");
            isValid = false;
        }
        if (!formData.fullAddress) {
            missingFields.push("Full Address");
            isValid = false;
        }
        if (!formData.shopName) {
            missingFields.push("Shop Name");
            isValid = false;
        }
        if (!formData.shopAddress) {
            missingFields.push("Shop Address");
            isValid = false;
        }
        if (!formData.gstNo) {
            missingFields.push("GST No");
            isValid = false;
        }
        if (!formData.panCard) {
            missingFields.push("PAN Card");
            isValid = false;
        }
        if (!formData.bankAccountNumber) {
            missingFields.push("Bank Account Number");
            isValid = false;
        }
        if (!formData.bankName) {
            missingFields.push("Bank Name");
            isValid = false;
        }
        if (!formData.bankAccountName) {
            missingFields.push("Bank Account Name");
            isValid = false;
        }
        if (!formData.shopRegistrationProof) {
            missingFields.push("Shop Registration Proof");
            isValid = false;
        }
        if (!formData.shopActLicense) {
            missingFields.push("Shop Act License");
            isValid = false;
        }
        if (!formData.cancelledCheque) {
            missingFields.push("Cancelled Cheque");
            isValid = false;
        }

        if (!isValid) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        }

        return isValid;
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        // Validate all fields before submitting
        const allValid = validateAllFields();
        if (!allValid) return;
    
        setLoading(true); // Set loading to true when starting the request
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/vendor-member/register-request`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials for CORS requests
            });
    
            const result = await response.json();
            if (response.ok) {
                toast.success(result.message);
                // Reset formData and image previews after successful submission
                setFormData({
                    // Resetting your form data...
                });
                setImagePreviews({});
                setCurrentStep(0);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        } finally {
            setLoading(false); // Reset loading state after the request is complete
        }
    };

    return (
        <StyledPaper elevation={3} className="container my-5">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
        <Typography variant="h4" className="text-center mb-4">Vendor Member Registration Request</Typography>
        
        {loading && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Typography variant="h6">Submitting your request...</Typography>
                {/* place your spinner component here if using one */}
            </div>
        )}

        <Stepper activeStep={currentStep} alternativeLabel className="mb-4">
            {STEPS.map((step, index) => (
                <Step key={index}>
                    <StepLabel>
                        <Typography variant="body2" style={{ fontWeight: currentStep === index ? 'bold' : 'normal', color: currentStep === index ? '#1976d2' : '#000' }}>
                            {step.label}
                        </Typography>
                    </StepLabel>
                </Step>
            ))}
        </Stepper>

            <form className="row g-3" onSubmit={handleSubmit}>
                {currentStep === 0 && (
                    <>
                        <div className="col-md-6">
                            <TextField fullWidth label="Full Name" variant="outlined" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="Email ID" variant="outlined" name="emailId" value={formData.emailId} onChange={handleInputChange} type="email" required />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                variant="outlined"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleInputChange}
                                required
                                inputProps={{ maxLength: 10 }}
                                helperText="Must be exactly 10 digits."
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                                }}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Alternate Mobile Number"
                                variant="outlined"
                                name="alternateMobileNumber"
                                value={formData.alternateMobileNumber}
                                onChange={handleInputChange}
                                inputProps={{ maxLength: 10 }}
                                helperText="Must be exactly 10 digits if provided."
                            />
                        </div>
                        <div className="col-md-12">
                            <TextField fullWidth label="Full Address" variant="outlined" name="fullAddress" value={formData.fullAddress} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <div className="custom-file mb-3">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="profilephoto-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="profilephoto"
                                />
                                <label className="form-label" htmlFor="profilephoto-upload">
                                    <AttachFileIcon /> Upload Profile Photo
                                </label>
                            </div>
                            {imagePreviews.profilephoto && (
                                <div className="mt-2">
                                    <img src={imagePreviews.profilephoto} alt="Profile" style={{ width: '100px' }} />
                                    <span>Profile Photo</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('profilephoto')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {currentStep === 1 && (
                    <>
                        <div className="col-md-6">
                            <TextField fullWidth label="Shop Name" variant="outlined" name="shopName" value={formData.shopName} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="Shop Website" variant="outlined" name="shopWebsite" value={formData.shopWebsite} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-12">
                            <TextField fullWidth label="Shop Address" variant="outlined" name="shopAddress" value={formData.shopAddress} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="GST No" variant="outlined" name="gstNo" value={formData.gstNo} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="CIN No" variant="outlined" name="cinNo" value={formData.cinNo} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="shopRegistrationProof-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="shopRegistrationProof"
                                    required
                                />
                                <label className="form-label" htmlFor="shopRegistrationProof-upload">
                                    <AttachFileIcon /> Upload Shop Registration Proof
                                </label>
                            </div>
                            {imagePreviews.shopRegistrationProof && (
                                <div className="mt-2">
                                    <img src={imagePreviews.shopRegistrationProof} alt="Shop Registration Proof" style={{ width: '100px' }} />
                                    <span>Shop Registration Proof</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('shopRegistrationProof')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="shopLogo-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="shopLogo"
                                />
                                <label className="form-label" htmlFor="shopLogo-upload">
                                    <AttachFileIcon /> Upload Shop Logo
                                </label>
                            </div>
                            {imagePreviews.shopLogo && (
                                <div className="mt-2">
                                    <img src={imagePreviews.shopLogo} alt="Shop Logo" style={{ width: '100px' }} />
                                    <span>Shop Logo</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('shopLogo')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="shopAddressProof"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="shopAddressProof"
                                    required
                                />
                                <label className="form-label" htmlFor="shopAddressProof">
                                    <AttachFileIcon /> Upload shopAddressProof
                                </label>
                            </div>
                            {imagePreviews.shopAddressProof && (
                                <div className="mt-2">
                                    <img src={imagePreviews.shopAddressProof} alt="shopAddressProof Image" style={{ width: '100px' }} />
                                    <span>shopAddressProof Image</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('shopAddressProof')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {currentStep === 2 && (
                    <>
                        <div className="col-md-6">
                            <TextField fullWidth label="Bank Account Number" variant="outlined" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="Bank Name" variant="outlined" name="bankName" value={formData.bankName} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="Bank Account Name" variant="outlined" name="bankAccountName" value={formData.bankAccountName} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="Bank Code" variant="outlined" name="bankCode" value={formData.bankCode} onChange={handleInputChange} required />
                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <>
                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="addressProof-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="addressProof"
                                    required
                                />
                                <label className="form-label" htmlFor="addressProof-upload">
                                    <AttachFileIcon /> Upload Address Proof
                                </label>
                            </div>
                            {imagePreviews.addressProof && (
                                <div className="mt-2">
                                    <img src={imagePreviews.addressProof} alt="Address Proof" style={{ width: '100px' }} />
                                    <span>Address Proof</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('addressProof')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>

                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="gramPanchayatNoc"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="gramPanchayatNoc"
                                    required
                                />
                                <label className="form-label" htmlFor="gramPanchayatNoc">
                                    <AttachFileIcon /> Upload gramPanchayatNoc
                                </label>
                            </div>
                            {imagePreviews.gramPanchayatNoc && (
                                <div className="mt-2">
                                    <img src={imagePreviews.gramPanchayatNoc} alt="gramPanchayatNoc Image" style={{ width: '100px' }} />
                                    <span>gramPanchayatNoc Image</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('gramPanchayatNoc')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>

                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="panCard-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="panCard"
                                    required
                                />
                                <label className="form-label" htmlFor="panCard-upload">
                                    <AttachFileIcon /> Upload PAN Card
                                </label>
                            </div>
                            {imagePreviews.panCard && (
                                <div className="mt-2">
                                    <img src={imagePreviews.panCard} alt="PAN Card" style={{ width: '100px' }} />
                                    <span>PAN Card</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('panCard')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>

                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="gstCertificate-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="gstCertificate"
                                    required
                                />
                                <label className="form-label" htmlFor="gstCertificate-upload">
                                    <AttachFileIcon /> Upload GST Certificate
                                </label>
                            </div>
                            {imagePreviews.gstCertificate && (
                                <div className="mt-2">
                                    <img src={imagePreviews.gstCertificate} alt="GST Certificate" style={{ width: '100px' }} />
                                    <span>GST Certificate</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('gstCertificate')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>

                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="shopActLicense-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="shopActLicense"
                                    required
                                />
                                <label className="form-label" htmlFor="shopActLicense-upload">
                                    <AttachFileIcon /> Upload Shop Act License
                                </label>
                            </div>
                            {imagePreviews.shopActLicense && (
                                <div className="mt-2">
                                    <img src={imagePreviews.shopActLicense} alt="Shop Act License" style={{ width: '100px' }} />
                                    <span>Shop Act License</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('shopActLicense')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>

                        <div className="col-md-6">
                            <TextField fullWidth label="Fertilizer License No" variant="outlined" name="fertilizerLicenseNo" value={formData.fertilizerLicenseNo} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="Other License No" variant="outlined" name="otherLicenseNo" value={formData.otherLicenseNo} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="Pesticides License No" variant="outlined" name="pesticidesLicenseNo" value={formData.pesticidesLicenseNo} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <TextField fullWidth label="Seed License No" variant="outlined" name="seedLicenseNo" value={formData.seedLicenseNo} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="panImage-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="panImage"
                                    required
                                />
                                <label className="form-label" htmlFor="panImage-upload">
                                    <AttachFileIcon /> Upload PAN Image
                                </label>
                            </div>
                            {imagePreviews.panImage && (
                                <div className="mt-2">
                                    <img src={imagePreviews.panImage} alt="PAN Image" style={{ width: '100px' }} />
                                    <span>PAN Image</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('panImage')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <div className="custom-file">
                                <input
                                    accept="image/*"
                                    className="form-control form-control-lg"
                                    id="cancelledCheque-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                    name="cancelledCheque"
                                    required
                                />
                                <label className="form-label" htmlFor="cancelledCheque-upload">
                                    <AttachFileIcon /> Upload Cancelled Cheque
                                </label>
                            </div>
                            {imagePreviews.cancelledCheque && (
                                <div className="mt-2">
                                    <img src={imagePreviews.cancelledCheque} alt="Cancelled Cheque" style={{ width: '100px' }} />
                                    <span>Cancelled Cheque</span>
                                    <Button variant="outlined" color="secondary" onClick={() => handleImageRemove('cancelledCheque')} className="mt-2">Remove</Button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                <div className="col-md-12">
                    <Button variant="contained" color="primary" onClick={handlePrev} disabled={currentStep === 0}>Previous</Button>
                    {currentStep === STEPS.length - 1 ? (
                        <Button variant="contained" color="primary" type="submit">Submit Registration Request</Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
                    )}
                </div>
            </form>
        </StyledPaper>
    );
}

export default VendorMemberRegisterRequest;