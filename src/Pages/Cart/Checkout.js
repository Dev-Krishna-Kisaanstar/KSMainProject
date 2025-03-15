import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    TableHead,
    InputAdornment,
    Divider,
    Select,
    MenuItem,
    Paper,
    Modal,
    CircularProgress,
    FormControl,
    InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Headerbar from '../../Components/SmallComponents/Headerbar';
import Header from '../../Components/SmallComponents/Header';
import Footer from '../../Components/SmallComponents/Footer';
import Footerbar from '../../Components/SmallComponents/Footerbar';
import { ArrowForward as ArrowForwardIcon, CardGiftcard as GiftIcon } from "@mui/icons-material";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { styled } from '@mui/material/styles';
import Phonepay from '../../Assets/Logo/Phonepay.svg'


const Checkout = () => {
    const [customerData, setCustomerData] = useState(null);
    const [addressData, setAddressData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [cartItems, setCartItems] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate();
    const [subtotal, setSubtotal] = useState(0);
    const [coupons, setCoupons] = useState([]); // State for coupons
    const [selectedCoupon, setSelectedCoupon] = useState(""); // State for selected coupon

    const [isOnlinePaymentModalOpen, setIsOnlinePaymentModalOpen] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const screenshotInputRef = useRef(null);
    const [showPlaceOrderButton, setShowPlaceOrderButton] = useState(false);
    const [isQrCodeLoading, setIsQrCodeLoading] = useState(false);
    const [upiLink, setUpiLink] = useState("");  // State to hold the UPI link
    const [isPaymentFormModalOpen, setIsPaymentFormModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buttonText, setButtonText] = useState('Place Order');
    const [isOnlinePaymentSelected, setIsOnlinePaymentSelected] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);


    const base64ToImage = (base64String) => {
        if (!base64String) return null;

        console.log("QR Code Base64 String:", base64String); // Debugging

        return (
            <img
                src={base64String} // Use directly, since it already has "data:image/png;base64,"
                alt="QR Code"
                style={{ width: '200px', height: '200px', display: 'block', margin: '10px auto' }}
                onError={(e) => console.error("Image loading error", e)}
            />
        );
    };


    useEffect(() => {
        fetchCustomerData();
        fetchCartItems(navigate);
        fetchCoupons(); // Fetch coupons on component mount
    }, [navigate]);

    const StyledPaper = styled(Paper)(({ theme }) => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }));

    const fetchCustomerData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/dashboard`, {
                withCredentials: true,
            });
            const { customer, address } = response.data;
            console.log(response.data);

            setCustomerData(customer || {});
            setAddressData(address || {});
        } catch (error) {
            console.error("Error fetching customer data:", error);
        }
    };

    const fetchCartItems = async (navigate) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
                withCredentials: true,
            });

            if (response.status === 404 || !response.data.cart || response.data.cart.length === 0) {
                alert("Cart is empty or not found. Redirecting to the home page...");
                navigate("/");
                return;
            }
            console.log(response.data.cart);

            const cartData = response.data.cart;
            const enrichedCartItems = cartData.map((item) => ({
                productId: item.productId,
                productName: item.productName,
                productBrandName: item.productBrandName,
                quantity: item.quantity,
                availableStock: item.availableStock,
                outOfStock: item.outOfStock,
                productImages: item.productImages,
                productBasedPrice: item.productBasedPrice,
                price: item.price,
                subtotal: item.quantity * item.price, // Calculate the subtotal for each item
            }));

            setCartItems(enrichedCartItems);
        } catch (error) {
            console.error("An error occurred while fetching your cart. Please try again later.", error);
        }
    };

    const fetchCoupons = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/get-coupons`, {
                withCredentials: true,
            });
            if (response.data.coupons) {
                setCoupons(response.data.coupons);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        }
    };

    const handleCouponChange = (event) => {
        const coupon = coupons.find(c => c.code === event.target.value);
        setSelectedCoupon(event.target.value);
        setDiscount(coupon ? coupon.discountAmount : 0); // Set discount based on selected coupon
    };

    const calculateTotal = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
        const discountAmount = selectedCoupon ? coupons.find(c => c.code === selectedCoupon)?.discountAmount || 0 : 0;
        return {
            subtotal,
            discount: discountAmount,
            total: subtotal - discountAmount,
        };
    };

    // Function to convert an image file to Base64 with MIME type
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Ensures MIME type is included
            reader.onload = () => {
                const base64String = reader.result; // Example: "data:image/jpeg;base64,/9j/4AAQ..."
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };


    const handleImageUpload = async (event) => { // Changed to async function and using event
        const file = event.target.files[0]; // Get the file from the event
        if (file) {
            setPaymentLoading(true);
            try {
                const base64String = await fileToBase64(file); // Convert to base64

                setPaymentScreenshot(base64String); // Update the state with base64 string
                // No separate API call for image upload; it's handled in handlePlaceOrder

            } catch (error) {
                console.error("Error converting image to base64:", error);
                alert("Error processing the image. Please try again.");
            } finally {
                setPaymentLoading(false);
            }
        } else {
            setPaymentScreenshot(null);
        }
    };


    const totals = calculateTotal();

    // Update isMobile on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Generate QR code
    const generateQrCode = async () => {
        setIsQrCodeLoading(true);
        try {
            const totals = calculateTotal();

            if (!customerData || !customerData.fullName) {  // Use fullName from customerData
                alert("Customer name is not available. Please refresh the page.");
                setIsQrCodeLoading(false);
                return;
            }

            const requestBody = {
                amount: totals.total,
                customerName: customerData.fullName, // Use fullName
            };

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/generate-qr`, requestBody, {
                withCredentials: true,
            });

            if (response.data.qrCode) {
                let qrCodeData = response.data.qrCode;

                if (typeof qrCodeData === 'object' && qrCodeData !== null && qrCodeData.base64) {
                    qrCodeData = qrCodeData.base64;
                }

                if (typeof qrCodeData !== 'string' || !qrCodeData.startsWith('data:image')) {
                    console.error("Invalid QR code format:", qrCodeData);
                    throw new Error("Invalid QR code format received from the server.");
                }

                setQrCode(qrCodeData);

                if (response.data.upiLink) {
                    setUpiLink(response.data.upiLink);
                }

                setIsModalOpen(true); // Open the modal after successful generation

            } else {
                throw new Error("Invalid QR code response");
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
            alert("Failed to generate QR code. Please try again.");
        } finally {
            setIsQrCodeLoading(false);
        }
    };


    // Handle online payment
    const handleOnlinePayment = async () => {
        try {
            if (isMobile) {
                window.location.href = `/mobile-upi-link/${process.env.REACT_APP_API_URL}/${qrCode}`;
            } else {
                await generateQrCode();
                setIsOnlinePaymentModalOpen(true);
            }
        } catch (error) {
            console.error("Error during online payment process:", error);
            alert("An error occurred during online payment setup. Please try again.");
        }
    };

    // Desktop Functions
    const handleDesktopOnlinePaymentClick = async () => {
        await generateQrCode();
    };

    // Mobile Functions
    const handleMobileOnlinePayment = async () => {
        await generateQrCode();
    };


    // Function to handle the "Online Payment" radio button click - Desktop
    const handleOnlinePaymentSelectDesktop = () => {
        setIsOnlinePaymentSelected(true);
        handleOpenPaymentFormModal();
    };

    // Function to handle the "Online Payment" radio button click - Mobile
    const handleOnlinePaymentSelectMobile = () => {
        setIsOnlinePaymentSelected(true);
        handleOpenPaymentFormModal();
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setIsOnlinePaymentModalOpen(false);
    };


    // Check if both the transaction ID and payment screenshot are filled
    const isPaymentDataFilled = transactionId && paymentScreenshot;

    // Example: Correctly handling the button click and modal open
    const handleProceedToPayDesktop = async () => {
        console.log("handleProceedToPayDesktop called, paymentMethod:", paymentMethod); // Debug
        if (paymentMethod === "Online Payment") {
            // 1. Start loading
            setPaymentLoading(true);
            try {
                // 2. Generate the QR code (asynchronously)
                console.log("Generating QR code...");
                await handleDesktopOnlinePaymentClick(); // Assuming this generates the QR code and sets state

                // 3. Open the modal (after QR code)
                console.log("Opening online payment modal");
                setIsOnlinePaymentModalOpen(true); // Open the modal *after* QR code generation
            } catch (error) {
                console.error("Error during desktop online payment:", error);
                alert("An error occurred. Please try again.");
            } finally {
                setPaymentLoading(false); // Stop Loading
            }
        } else {
            // Handle other payment methods (e.g., COD)
            console.log("Placing order (COD or other)");
            handlePlaceOrder();
        }
    };
    const handleProceedToPayMobile = () => {
        console.log("handleProceedToPayMobile called");
        handlePlaceOrder();
    };

    // Function to open the payment modal
    const handleOpenPaymentFormModal = async () => {
        console.log("handleOpenPaymentFormModal called, paymentMethod:", paymentMethod);
        if (paymentMethod === "Online Payment") {
            setPaymentLoading(true); // Start loading
            try {
                console.log("Generating QR code...");
                await generateQrCode(); // Generate the QR code
            } catch (error) {
                console.error("Error generating QR code:", error);
                alert("Failed to generate QR code. Please try again.");
            } finally {
                setPaymentLoading(false); // Stop loading
                setIsPaymentFormModalOpen(true); // Open the modal *after* QR code generation or after failure
                setButtonText('Place Order'); // Change button text when the modal opens
            }
        } else {
            // COD flow - No QR code needed. Still open the modal
            setIsPaymentFormModalOpen(true);
            setButtonText('Place Order');
        }
    };


    const handleClosePaymentFormModal = () => {
        setIsPaymentFormModalOpen(false);
        setButtonText('Place Order'); // Reset button text when the modal closes
    };

    //Handle the online payment toggle
    const handleOnlinePaymentToggle = async (event) => {
        const isChecked = event.target.value === "Online Payment";
        setIsOnlinePaymentSelected(isChecked);

        if (isChecked) {
            setPaymentMethod("Online Payment");
            setButtonText('Proceed to Pay');
            // Generate the QR code and UPI link here
            setPaymentLoading(true);
            try {
                await generateQrCode(); // Call the API to get the QR code and UPI link
            } catch (error) {
                console.error("Error generating QR code in toggle:", error);
                alert("Failed to generate QR code. Please try again.");
            } finally {
                setPaymentLoading(false);
                handleOpenPaymentFormModal();
            }
        } else {
            setPaymentMethod("COD");
            setButtonText('Place Order');
            setUpiLink(""); // Clear the UPI link
            setIsPaymentFormModalOpen(false);
        }
    };


    const handlePlaceOrder = async () => {
        try {
            const formattedPaymentMethod = paymentMethod === "Online Payment" ? "Online" : paymentMethod;

            if (formattedPaymentMethod === "Online" && !transactionId) {
                alert("Please enter the transaction ID.");
                return;
            }
            if (formattedPaymentMethod === "Online" && !paymentScreenshot) {
                alert("Please upload a payment screenshot.");
                return;
            }

            const orderItems = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                productName: item.productName,
                productImage: item.productImages || 'https://via.placeholder.com/120',
            }));

            const totals = calculateTotal();

            const orderResponse = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/orders/place`,
                {
                    paymentMethod: formattedPaymentMethod,
                    transactionId: transactionId,
                    screenshotUrl: paymentScreenshot, // Send the base64 string here
                    couponCode: selectedCoupon,
                    orderItems: orderItems,
                    totalAmount: totals.total,
                    customerId: customerData?._id,
                },
                { withCredentials: true }
            );

            if (orderResponse.status === 200) {
                // If online payment and payment screenshot and transaction id is available.
                if (formattedPaymentMethod === "Online" && paymentScreenshot && transactionId) {
                    // No separate call to `/api/customers/uploadTransactionDetails` is needed
                    // since we send base64 to /api/orders/place
                }

                alert(orderResponse.data.message);
                setCartItems([]);
                navigate('/order-success');
                setIsOnlinePaymentModalOpen(false);
                setIsPaymentFormModalOpen(false);
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert('Failed to place order. Please try again.');
        } finally {
            setButtonText('Place Order');
            setPaymentLoading(false);
        }
    };

 // Inside DesktopPaymentModule: Example of prop usage and console logging
const DesktopPaymentModule = ({ isOpen, onClose, handlePlaceOrder, isPaymentLoading, paymentLoading, qrCode, base64ToImage, transactionId, setTransactionId, paymentScreenshot, handleScreenshotUpload }) => {
  console.log("DesktopPaymentModule rendered, isOpen:", isOpen, "paymentScreenshot", paymentScreenshot, "transactionId", transactionId, "paymentLoading", paymentLoading); // Debugging
  return (
      <Modal
          open={isOpen}
          onClose={onClose}
          aria-labelledby="payment-form-modal"
          aria-describedby="upload-screenshot-and-transaction-id"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: 400 },
          maxWidth: '480px', // Set a maximum width for large screens
          bgcolor: '#EAE1F4', // Semi-transparent background
          display: 'flex',
          flexDirection: 'column',
          padding: 4,
          gap: 2,
          borderRadius: '16px',
          boxShadow: 24,
        }}>
          {/* PhonePe Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img
              src={Phonepay}
              alt="PhonePay Logo"
              style={{
                width: 120,
                height: 50,
                objectFit: 'contain',
                filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))',
              }}
            />
          </Box>

          {/* Section Header */}
          {qrCode && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {base64ToImage(qrCode)}
            </Box>
          )}

          {/* Transaction ID */}
          <TextField
  fullWidth
  label="Transaction ID"
  variant="outlined"
  value={transactionId}
  onChange={(e) => {
    const newValue = e.target.value; // Store value
    console.log("Transaction ID changed:", newValue); // Debugging - check what's being typed
    setTransactionId(newValue);
  }}
  margin="normal"
  InputLabelProps={{
    style: { color: '#4F0F0F' },
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#EAE1F4',
      },
      '&:hover fieldset': {
        borderColor: '#4F0F0F',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4F0F0F',
      },
      '& .MuiInputBase-input': {
        padding: '16px',
      },
    },
  }}
/>

          {/* Payment Screenshot */}
          <div className="mb-3">
            <label
              htmlFor="screenshot-upload"
              style={{
                color: '#4F0F0F',
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.9rem',
              }}
            >
              Upload Payment Screenshot
            </label>
            <input
              type="file"
              id="screenshot-upload"
              onChange={handleScreenshotUpload}
              ref={screenshotInputRef}
              accept=".jpg, .png, .jpeg"
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #EAE1F4',
                backgroundColor: '#fff',
                fontSize: '1rem',
              }}
            />
            {paymentScreenshot && (
              <img
                src={paymentScreenshot}
                alt="Uploaded Image"
                style={{
                  width: '100%',
                  maxHeight: 200,
                  objectFit: 'cover',
                  padding: '16px',
                  borderRadius: '16px',
                  boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
                }}
              />
            )}
          </div>

          {/* Place Order Button */}
          <Button
            variant="contained"
            color="success" // Green for success button
            onClick={handlePlaceOrder}
            fullWidth
            disabled={isPaymentLoading}
            sx={{
              mt: 2,
              backgroundColor: '#2e7d32', // Green
              color: '#EAE1F4',
              '&:hover': {
                backgroundColor: '#225825', // Darker Green on hover
              },
              padding: '14px 20px',
              fontSize: '16px',
              borderRadius: '16px',
              boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            Place Order
          </Button>
        </Box>
      </Modal>
    );
  };


 // Inside MobilePaymentModule: Example of prop usage and console logging
 const MobilePaymentModule = ({ isOpen, onClose, handlePlaceOrder, upiLink, transactionId, setTransactionId, handleScreenshotUpload, paymentScreenshot, isPaymentLoading }) => {
  // Calculate if the Place Order button should be enabled
  const isPlaceOrderEnabled = !!transactionId && !!paymentScreenshot;

return (
    <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="payment-form-modal"
        aria-describedby="upload-screenshot-and-transaction-id"
    >
        <Box
            sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90vw', sm: 500, md: 600 },
                bgcolor: 'background.paper',
                boxShadow: 24,
                borderRadius: '16px',
                overflow: 'hidden',
                zIndex: 1000,
            }}
        >
            <Box sx={{ p: 4, pb: 2 }}>
                {/* PhonePe Logo */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <img
                        src={Phonepay}
                        alt="PhonePay Logo"
                        style={{
                            width: 120,
                            height: 50,
                            objectFit: 'contain',
                            filter: 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))',
                        }}
                    />
                </Box>

                {/* UPI Link */}
                {upiLink && (
                    <Typography
                        variant="body1"
                        sx={{ mb: 2, textAlign: 'center', color: '#555' }}
                    >
                        Please open your UPI app and pay using the link:
                    </Typography>
                )}

                {/* UPI Button */}
                {upiLink && (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                            window.open(upiLink, '_blank');
                        }}
                        sx={{ mb: 2 }}
                    >
                        Open UPI App to Pay
                    </Button>
                )}

                                             {/* Transaction ID */}
                  <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => {
                          const newValue = e.target.value; // Store value
                          setTransactionId(newValue);
                      }}
                      style={{
                          padding: '16px',
                          width: '100%',
                          fontSize: '16px',
                          border: '1px solid #EAE1F4',
                          borderRadius: '8px',
                      }}
                      placeholder="Enter Transaction ID"
                  />

                {/* Payment Screenshot */}
                <div className="mb-3">
                    <label
                        htmlFor="screenshot-upload"
                        style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontSize: '0.9rem',
                        }}
                    >
                        Upload Payment Screenshot
                    </label>
                    <input
                        type="file"
                        id="screenshot-upload"
                        onChange={handleImageUpload}
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '1rem',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    />
                    {paymentScreenshot && (
                        <img
                            src={paymentScreenshot}
                            alt="Uploaded Image"
                            style={{
                                width: '100%',
                                maxHeight: 200,
                                objectFit: 'cover',
                                padding: '16px',
                                borderRadius: '16px',
                                boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    )}
                </div>

                {/* Place Order Button */}
                <Button
                    variant="contained"
                    color="success" // Green for success button
                    onClick={handlePlaceOrder}
                    fullWidth
                    disabled={!isPlaceOrderEnabled || isPaymentLoading} // Disable if not enabled or loading
                    sx={{
                        mt: 2,
                        backgroundColor: '#2e7d32', // Green
                        color: '#EAE1F4',
                        '&:hover': {
                            backgroundColor: '#225825', // Darker Green on hover
                        },
                        padding: '14px 20px',
                        fontSize: '16px',
                        borderRadius: '16px',
                        boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    Place Order
                </Button>
            </Box>
        </Box>
    </Modal>
);
};

 // Function to render payment modules
 const PaymentModules = () => {
  return (
      <React.Fragment>
          <FormControl>
              <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}  // Update paymentMethod
              >
                  <FormControlLabel value="COD" control={<Radio />} label="Cash on Delivery" />
                  <FormControlLabel
                      value="Online Payment"
                      control={<Radio />}
                      label="Online Payment"
                      onChange={handleOnlinePaymentToggle} // Call the toggle function
                  />
              </RadioGroup>
              {paymentMethod === "Online Payment" && (
                  <Typography variant="caption" color="error">
                      You need to upload a screenshot of the payment done and paste the Transaction ID of the payment to place the order successfully.
                  </Typography>
              )}
              {(paymentMethod === "COD") && (
                  <Button
                      variant="contained"
                      color="success"
                      onClick={handlePlaceOrder}
                      fullWidth
                      sx={{
                          mt: 2,
                          borderRadius: '8px',
                          display: { xs: 'block', md: 'none' },
                      }}
                  >
                      {buttonText}
                  </Button>
              )}
              {(paymentMethod === "Online Payment") && (
                  <>
                      <Button
                          variant="contained"
                          color="success"
                          onClick={handleProceedToPayMobile}
                          fullWidth
                          sx={{
                              mt: 2,
                              borderRadius: '8px',
                              display: { xs: 'block', md: 'none' },
                          }}
                      >
                          {buttonText}
                      </Button>
                  </>
              )}
          </FormControl>
      </React.Fragment>
  );
};
  return (
    <>
    <Headerbar />
    <Header />

    {/* Desktop Version */}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      <div className="container-fluid d-flex justify-content-between py-5">
        {/* Left Side */}
        <div className="col-md-8 p-4 bg-light rounded shadow-lg">
          <Card variant="outlined" className="mb-4 shadow-lg border-success rounded-4">
            <CardContent>
              <Typography variant="h6" className="text-success mb-3">Customer Details</Typography>
              {customerData?.fullName && customerData?.mobileNumber ? (
                <>
                  <Typography><strong>Name:</strong> {customerData.fullName}</Typography>
                  <Typography><strong>Mobile No:</strong> {customerData.mobileNumber}</Typography>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/profile")}
                  className="mt-3"
                >
                  Complete Profile
                </Button>
              )}
            </CardContent>
          </Card>
          <Card variant="outlined" className="mb-4 shadow-lg border-success rounded-4">
            <CardContent>
              <Typography variant="h6" className="text-success mb-3">Address Details</Typography>
              {addressData?.village ? (
                <>
                  <Typography><strong>Village:</strong> {addressData.village}</Typography>
                  <Typography><strong>Taluka:</strong> {addressData.taluka}</Typography>
                  <Typography><strong>District:</strong> {addressData.district}</Typography>
                  <Typography><strong>State:</strong> {addressData.state}</Typography>
                  <Typography><strong>Pincode:</strong> {addressData.pincode}</Typography>
                  <Typography><strong>Nearby Location:</strong> {addressData.nearbyLocation}</Typography>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/address")}
                  className="mt-3"
                >
                  Add Address
                </Button>
              )}
            </CardContent>
          </Card>
          <Card variant="outlined" className="shadow-lg border-success rounded-4">
            <CardContent>
              <Typography variant="h6" className="text-success mb-3">Payment Method</Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                row
              >
                <FormControlLabel value="COD" control={<Radio />} label="COD" />
                <FormControlLabel value="Online Payment" control={<Radio />} label="Online Payment" />
              </RadioGroup>
              {paymentMethod === "Online Payment" && (
                <Typography variant="caption" style={{ color: 'red' }}>
                  You need to upload a screenshot of the payment done and paste the Transaction ID of the payment to place the order successfully.
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div className="col-md-3 p-4 bg-white border rounded shadow-lg">
          <Typography variant="h5" className="mb-4 text-success">Order Summary</Typography>
          <Select
            fullWidth
            value={selectedCoupon}
            onChange={handleCouponChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="" disabled>Select a coupon</MenuItem>
            {coupons.map((coupon) => (
              <MenuItem key={coupon.code} value={coupon.code}>
                {coupon.code} - ₹{coupon.discountAmount}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setSelectedCoupon("");
            }}
            sx={{ marginTop: 1 }}
          >
            Clear
          </Button>
          <TableContainer component={Card} className="shadow-lg border-success rounded-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>₹{item.price * item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="mt-4">
            <Typography>Subtotal: ₹{totals.subtotal}</Typography>
            <Divider />
            <Typography variant="h6">Total Amount: ₹{totals.total}</Typography>
            <Button
              variant="contained"
              color="success"
              fullWidth
              className="mt-4"
              onClick={handleProceedToPayDesktop}
            >
              {paymentMethod === "COD" ? "Place Order" : "Proceed to Pay"}
            </Button>
          </div>
        </div>
      </div>
    </Box>

    {/* Desktop Modal*/}
    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
      <DesktopPaymentModule
        isOpen={isOnlinePaymentModalOpen}
        onClose={handleCloseModal}
        handlePlaceOrder={handlePlaceOrder}
        isPaymentLoading={paymentLoading}
        qrCode={qrCode}
        base64ToImage={base64ToImage}
        transactionId={transactionId}
        setTransactionId={setTransactionId}
        paymentScreenshot={paymentScreenshot}
        handleScreenshotUpload={handleImageUpload}
      />
    </Box>

    {/* Mobile Version */}
    <Box sx={{ display: { xs: 'block', md: 'none' }, padding: '16px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '80px' }}>
        <Typography variant="h5" fontWeight="bold" color="#2e7d32">Checkout</Typography>

        {/* Customer Details */}
        <Card variant="outlined" className="mb-4 shadow-lg border-success rounded-4">
          <CardContent>
            <Typography variant="h6" className="text-success mb-3">Customer Details</Typography>
            {customerData?.fullName && customerData?.mobileNumber ? (
              <>
                <Typography><strong>Name:</strong> {customerData.fullName}</Typography>
                <Typography><strong>Mobile No:</strong> {customerData.mobileNumber}</Typography>
              </>
            ) : (
              <Button variant="contained" color="success" onClick={() => navigate("/profile")} className="mt-3">
                Complete Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card variant="outlined" className="mb-4 shadow-lg border-success rounded-4">
          <CardContent>
            <Typography variant="h6" className="text-success mb-3">Shipping Address</Typography>
            {addressData?.village ? (
              <>
                <Typography><strong>Village:</strong> {addressData.village}</Typography>
                <Typography><strong>Taluka:</strong> {addressData.taluka}</Typography>
                <Typography><strong>District:</strong> {addressData.district}</Typography>
                <Typography><strong>State:</strong> {addressData.state}</Typography>
                <Typography><strong>Pincode:</strong> {addressData.pincode}</Typography>
                <Typography><strong>Nearby Location:</strong> {addressData.nearbyLocation}</Typography>
              </>
            ) : (
              <Button variant="contained" color="success" onClick={() => navigate("/address")} className="mt-3">
                Add Address
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Cart Summary */}
        <Card variant="outlined" className="mb-4 shadow-lg border-success rounded-4">
          <CardContent>
            <Typography variant="h6" className="text-success mb-3">
              Order Summary
            </Typography>

            {/* Coupon Dropdown */}
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="coupon-label">Apply Coupon</InputLabel>
              <Select
                labelId="coupon-label"
                id="coupon-code"
                value={selectedCoupon}
                label="Apply Coupon"
                onChange={handleCouponChange}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        Select Coupon
                      </Typography>
                    );
                  }
                  const coupon = coupons.find(c => c.code === selected);
                  return coupon ? `${coupon.code} - ₹${coupon.discountAmount}` : selected;
                }}
              >
                <MenuItem value="" disabled>
                  <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
                    Select Coupon
                  </Typography>
                </MenuItem>
                {coupons.map((coupon) => (
                  <MenuItem key={coupon.code} value={coupon.code}>
                    {coupon.code} - ₹{coupon.discountAmount}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {cartItems.map((item) => (
              <Box
                key={item.productId}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={item.productImages || 'https://via.placeholder.com/50'}
                    alt={item.productName}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      marginRight: '8px',
                    }}
                  />
                  <Typography>
                    {item.productName} x{item.quantity}
                  </Typography>
                </Box>
                <Typography>₹ {item.price * item.quantity}</Typography>
              </Box>
            ))}
            <Divider sx={{ margin: '16px 0' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Subtotal:</Typography>
              <Typography>₹ {totals.subtotal}</Typography>
            </Box>
            {selectedCoupon && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Discount:</Typography>
                <Typography>- ₹{totals.discount}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">₹ {totals.total}</Typography>
            </Box>

            {/* Payment Options */}
            <PaymentModules />
          </CardContent>
        </Card>
      </Box>
    </Box>
        {/* Mobile Modal */}
        <MobilePaymentModule
      isOpen={isPaymentFormModalOpen}
      onClose={handleClosePaymentFormModal}
      handlePlaceOrder={handlePlaceOrder}
      upiLink={upiLink}
      transactionId={transactionId}
      setTransactionId={setTransactionId}
      handleScreenshotUpload={handleImageUpload}
      paymentScreenshot={paymentScreenshot}
      isPaymentLoading={paymentLoading}
      qrCode={qrCode} // Pass qrCode to the mobile module
      base64ToImage={base64ToImage} // Pass base64ToImage to the mobile module
    />
  </>
  );
};

export default Checkout;