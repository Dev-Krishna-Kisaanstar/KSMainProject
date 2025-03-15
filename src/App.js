import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate,useLocation  } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Components/SmallComponents/store';
import Header from './Components/SmallComponents/Header';
import Login from './Pages/Login';
import Registration from './Pages/Registration';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import Products from './Pages/Products';
import Contactus from './Pages/Contactus';
import ViewProfile from './Pages/ViewProfile';
import AuthWrapper from './Auth/AuthWrapper';
import Orders from './Pages/CxProfileview/Orders';
import FarmingDetails from './Pages/CxProfileview/FarmingDetails';
import Wishlist from './Pages/CxProfileview/Wishlist';
import Address from './Pages/CxProfileview/Address';
import ProductPage from './Pages/ProductPage';
import ServerError from './Pages/ServerError';
import Advisormemberlogin from './Loginandregistration/Advisormemberlogin';
import ProtectedRoute from './Roles/Advisor/AdvisorMember/Auth/ProtectedRoute';
import ProtectedRouteAdmin from './Roles/Advisor/AdvisorAdmin/Auth/ProtectedRoute';
import ProtectedRouteOperationAdmin from './Roles/Operations/Operation Admin/Auth/ProtectedRoute';
import ProtectedRouteOperationMember from './Roles/Operations/Operation Member/Auth/ProtectedRoute';
import ProtectedRouteVendorMember from './Roles/Vendor/VendorMember/Auth/ProtectedRoute';
import ProtectedRouteVendorAdmin from './Roles/Vendor/VendorAdmin/Auth/ProtectedRoute';
import AdvisoryMemberDashboard from './Roles/Advisor/AdvisorMember/AdvisorMemberDashboard';
import AdvisorMemberSearchcx from './Roles/Advisor/AdvisorMember/AdvisorMemberSearchcx';
import AdvisorMemberAddCx from './Roles/Advisor/AdvisorMember/AdvisorMemberAddCx';
import AdvisorMemberseenewcxdetails from './Roles/Advisor/AdvisorMember/AdvisorMemberseenewcxdetails';
import AdvisorAdminRegister from './Loginandregistration/AdvisorAdminRegisterandLogin/AdvisorAdminRegister';
import AdvisorAdminLogin from './Loginandregistration/AdvisorAdminRegisterandLogin/AdvisorAdminLogin';
import AddAdvisorMember from './Roles/Advisor/AdvisorAdmin/AddAdvisorMember';
import AdvisorMemberList from './Roles/Advisor/AdvisorAdmin/AdvisorMemberList';
import ToggleLogin from './Roles/Advisor/AdvisorAdmin/ToggleLogin';
import VendorMemberRegisterRequest from './Roles/Vendor/VendorMember/VendorMemberRegisterRequest';
import AdvisorAdminDashboard from './Roles/Advisor/AdvisorAdmin/AdvisorAdminDashboard';
import VendorAdminRegister from './Loginandregistration/VendorAdminRegisterandLogin/VendorAdminRegister';
import VendorAdminLogin from './Loginandregistration/VendorAdminRegisterandLogin/VendorAdminLogin';
import PendingVendorMemberRegistrationRequest from './Roles/Vendor/VendorAdmin/PendingVendorMemberRegistrationRequests';
import ApprovedRegistrationList from './Roles/Vendor/VendorAdmin/ApprovedRegistrationList';
import RejectedRegistrationList from './Roles/Vendor/VendorAdmin/RejectedRegistrationList';
import VendorAdminDashboard from './Roles/Vendor/VendorAdmin/VendorAdminDashboard';
import VendorMemberRegistrationForm from './Roles/Vendor/VendorAdmin/VendorMemberRegistrationForm';
import ViewPendingVendorMemberRegistrationRequest from './Roles/Vendor/VendorAdmin/ViewPendingVendorMemberRegistrationRequest';
import ViewApprovedRegistrationfulldetails from './Roles/Vendor/VendorAdmin/ViewApprovedRegistrationfulldetails';
import VendorMemberLogin from './Loginandregistration/VendorMemberLogin/VendorMemberLogin';
import VendorMemberDashboard from './Roles/Vendor/VendorMember/VendorMemberDashboard';
import ProductRequest from './Roles/Vendor/VendorMember/ProductRequest';
import ListProductRequest from './Roles/Vendor/VendorMember/ListProductRequest';
import ViewDetailsProductList from './Roles/Vendor/VendorMember/ViewDetailsProductList';
import ListPendingProducts from './Roles/Vendor/VendorAdmin/ListPendingProducts';
import ViewDetailsPendingProducts from './Roles/Vendor/VendorAdmin/ViewDetailsPendingProducts';
import ApprovedProductsList from './Roles/Vendor/VendorAdmin/ApprovedProductsList';
import ViewDetailsApprovedProducts from './Roles/Vendor/VendorAdmin/ViewDetailsApprovedProducts';
import RejectedProductsList from './Roles/Vendor/VendorAdmin/RejectedProductsList';
import ApprovedProductsListMember from './Roles/Vendor/VendorMember/ApprovedProductList';
import AddProduct from './Roles/Vendor/VendorAdmin/AddProduct';
import ProductList from './Roles/Vendor/VendorAdmin/ProductList';
import ViewDetailsProduct from './Roles/Vendor/VendorAdmin/ViewDetailsProductList';
import TaggingAuth from './Roles/Advisor/AdvisorMember/Auth/TaggingAuth';
import ProductListAdvisory from './Roles/Advisor/AdvisorMember/ProductList';
import Categories from './Pages/Categories';
import SubCategory from './Pages/SubCategory';
import Product from './Pages/Products'
import ViewMoreDetails from './Pages/ViewMoreDetails';
import VendorProductsPage from './Pages/VendorProductsPage';
import Cart from './Pages/Cart/Cart';
import CallCenter from './Pages/CallCenter';
import "./App.css"
import Checkout from './Pages/Cart/Checkout';
import Fourzerofour from './Pages/Fourzerofour';
import MobileLogin from './Pages/MobileLogin';
import Shop from './Pages/Shop';
import OrderSuccess from './Pages/OrderSuccess';
import Remark from './Roles/Advisor/AdvisorMember/Tabs/Tagging';
import Oldorders from './Roles/Advisor/AdvisorMember/Tabs/Oldorders';
import PlaceOrder from './Roles/Advisor/AdvisorMember/Tabs/Placeorder';
import Tagging from './Roles/Advisor/AdvisorMember/Tabs/Tagging';
import Cxnearbyorders from './Roles/Advisor/AdvisorMember/Tabs/Cxnearbyorders';
import AdvisorMemberMyOrders from './Roles/Advisor/AdvisorMember/AdvisorMemberMyOrders';
import AdvisorAdminAdvisoryOrders from './Roles/Advisor/AdvisorAdmin/AdvisorAdminAdvisoryOrders';
import OperationAdminLogin from './Loginandregistration/OperationRegisterandlogin/OperationAdmin/OperationAdminLogin';
import OperationMemberLogin from './Loginandregistration/OperationRegisterandlogin/OperationMember/OperationMemberLogin';
import OperationAdminRegister from './Loginandregistration/OperationRegisterandlogin/OperationAdmin/OperationAdminRegister';
import OperationAdminDashboard from './Roles/Operations/Operation Admin/OperationAdminDashboard';
import OperationAdminAddMember from './Roles/Operations/Operation Admin/OperationAdminAddMember';
import OperationMemberList from './Roles/Operations/Operation Admin/OperationMemberList';
import OppToggleLogin from './Roles/Operations/Operation Admin/ToggleLogin'
import OperationMemberDashboard from './Roles/Operations/Operation Member/OperationMemberDashboard';
import OperationMemberOrders from './Roles/Operations/Operation Member/OperationMemberOrders';
import OppOrders from './Roles/Operations/Operation Admin/Orders'
import ConfirmOrders from './Roles/Operations/Operation Member/ConfirmOrders';
import AdvisorIDOrders from './Roles/Operations/Operation Admin/AdvisorIDOrders';

// Function to get a cookie by name
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
};


function App() {
    const location = useLocation();
    const [isServerError, setIsServerError] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { mobileNumber,trimmedMobileNumber } = location.state || {};
    const [customerId, setCustomerId] = useState(null); // Store customerId


    const navigate = useNavigate();



    useEffect(() => {
        const checkServer = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error connecting to the server:', error);
                setIsServerError(true);
            }
        };

        checkServer();

        // const token = getCookie('frontendadvisorycustomertoken');


        // if (token) {
        //     // Navigate to /change-it-for-love first
        //     navigate('/change-it-for-love', { replace: true });
      
        //     // Then navigate to /change-it after 2 seconds
        //     setTimeout(() => {
        //         navigate(`/AdvisorMemberseenewcxdetails/${token}`, { state: { mobileNumber,trimmedMobileNumber }, replace: true });
        //         console.log(mobileNumber);
        //         console.log(trimmedMobileNumber);
        //     }, 20); // Use 2000 ms as suggested for a clearer timeout
        // }

    }, [navigate]);

    if (isServerError) {
        return <ServerError />;
    }



    // Render the message if not redirecting
    if (isRedirecting) {
        return null; // Redirecting, so nothing is rendered
    }

    return (

        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/MobileLogin" element={<MobileLogin />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products/Categories" element={<Categories />} />
            <Route path="/subcategories/:categoryName" element={<SubCategory />} />
            <Route path="/subcategories/:categoryName/:subCategoryName" element={<Products />} />
            <Route path="/ViewMoreDetails/:vendorId" element={<ViewMoreDetails />} />
            <Route path="/VendorProductsPage/:vendorId" element={<VendorProductsPage />} />
            <Route path="/Fourzerofour" element={<Fourzerofour />} />
            <Route path="/order-success" element={<OrderSuccess />} />


            <Route path="/contactus" element={<Contactus />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/products/:categoryName/:subCategoryName" element={<ProductList />} />
            <Route path="/Advisormemberlogin" element={<Advisormemberlogin />} />
            <Route path='/AdvisorAdminRegister' element={<AdvisorAdminRegister />} />
            <Route path='/AdvisorAdminLogin' element={<AdvisorAdminLogin />} />
            <Route path='/OperationAdminLogin' element={<OperationAdminLogin />} />
            <Route path='/OperationMemberLogin' element={<OperationMemberLogin />} />
            <Route path='/OperationAdminRegister' element={<OperationAdminRegister />} />
            <Route path='/VendorMemberRegisterRequest' element={<VendorMemberRegisterRequest />} />
            <Route path='/VendorAdminRegister' element={<VendorAdminRegister />} />
            <Route path='/VendorAdminLogin' element={<VendorAdminLogin />} />
            <Route path='/VendorMemberLogin' element={<VendorMemberLogin />} />
            <Route path='/CallCenter' element={<CallCenter />} />
            <Route path='/Shop' element={<Shop/>} />


            {/* Protected Routes */}
            <Route path="/profile" element={<AuthWrapper><ViewProfile /></AuthWrapper>} />
            <Route path="/orders/:customerId" element={<AuthWrapper><Orders /></AuthWrapper>} />
            <Route path="/FarmingDetails" element={<AuthWrapper><FarmingDetails /></AuthWrapper>} />
            <Route path="/Wishlist" element={<AuthWrapper><Wishlist /></AuthWrapper>} />
            <Route path="/Address" element={<AuthWrapper><Address /></AuthWrapper>} />
            <Route path="/Cart" element={<AuthWrapper><Cart /></AuthWrapper>} />
            <Route path="/Checkout" element={<AuthWrapper><Checkout /></AuthWrapper>} />


            {/* Advisory members  */}
            <Route path="/advisory-member-dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AdvisoryMemberDashboard /></ProtectedRoute >} />
            <Route path="/AdvisorMemberSearchcx" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AdvisorMemberSearchcx /></ProtectedRoute >} />
            <Route path="/AdvisorMemberAddCx" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} ><AdvisorMemberAddCx /></ProtectedRoute >} />
            <Route path="/AdvisorMemberseenewcxdetails/:customerId" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AdvisorMemberseenewcxdetails /></ProtectedRoute >} />
            <Route path="/tagging-auth" element={<TaggingAuth />} />
            <Route path="/ProductList" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ProductListAdvisory /></ProtectedRoute >} />
            <Route path="/MyOrders" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AdvisorMemberMyOrders /></ProtectedRoute >} />
            <Route path="/Tagging" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><Tagging /></ProtectedRoute >} />
            <Route path="/Oldorders" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><Oldorders /></ProtectedRoute >} />
            <Route path="/PlaceOrder/:customerId" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><PlaceOrder /></ProtectedRoute >} />
            <Route path="/Cxnearbyorders/:customerId" element={<ProtectedRoute isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><Cxnearbyorders /></ProtectedRoute >} />


            {/* Advisory Admin */}
            <Route path='/AdvisorAdminDashboard' element={<ProtectedRouteAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AdvisorAdminDashboard /></ProtectedRouteAdmin>} />
            <Route path='/AddAdvisorMember' element={<ProtectedRouteAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AddAdvisorMember /></ProtectedRouteAdmin>} />
            <Route path='/AdvisorMemberList' element={<ProtectedRouteAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AdvisorMemberList /></ProtectedRouteAdmin>} />
            <Route path='/ToggleLogin/:customerId' element={<ProtectedRouteAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ToggleLogin /></ProtectedRouteAdmin>} />
            <Route path='/AllAdvisoryOrders' element={<ProtectedRouteAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AdvisorAdminAdvisoryOrders /></ProtectedRouteAdmin>} />

            {/* Operation Admin  */}
            <Route path='/OperationAdminDashboard' element={<ProtectedRouteOperationAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><OperationAdminDashboard /></ProtectedRouteOperationAdmin>} />
            <Route path='/AddOperationMember' element={<ProtectedRouteOperationAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><OperationAdminAddMember /></ProtectedRouteOperationAdmin>} />
            <Route path='/OperationMemberList' element={<ProtectedRouteOperationAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><OperationMemberList /></ProtectedRouteOperationAdmin>} />
            <Route path='/OppToggleLogin/:customerId' element={<ProtectedRouteOperationAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><OppToggleLogin /></ProtectedRouteOperationAdmin>} />
            <Route path='/OppAOrders' element={<ProtectedRouteOperationAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><OppOrders /></ProtectedRouteOperationAdmin>} />
            <Route path='/AdvosorOrders/:customerId' element={<ProtectedRouteOperationAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AdvisorIDOrders /></ProtectedRouteOperationAdmin>} />


            {/* Operation Member  */}
            <Route path='/OperationMemberDashboard' element={<ProtectedRouteOperationMember isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><OperationMemberDashboard /></ProtectedRouteOperationMember>} />
            <Route path='/OppOrders' element={<ProtectedRouteOperationMember isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><OperationMemberOrders /></ProtectedRouteOperationMember>} />
            <Route path='/OppOrdersConfirmed' element={<ProtectedRouteOperationMember isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ConfirmOrders /></ProtectedRouteOperationMember>} />




            {/* Vendor Member */}
            <Route path='/VendorMemberDashboard' element={<ProtectedRouteVendorMember isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><VendorMemberDashboard /></ProtectedRouteVendorMember>} />
            <Route path='/ProductRequest' element={<ProtectedRouteVendorMember isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ProductRequest /></ProtectedRouteVendorMember>} />
            <Route path='/ListProductRequest' element={<ProtectedRouteVendorMember isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ListProductRequest /></ProtectedRouteVendorMember>} />
            <Route path='/ViewDetails/:customerId' element={<ProtectedRouteVendorMember isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ViewDetailsProductList /></ProtectedRouteVendorMember>} />
            <Route path='/ApprovedProductsListMember' element={<ProtectedRouteVendorMember isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ApprovedProductsListMember /></ProtectedRouteVendorMember>} />



            {/* Vendor Admin */}
            <Route path='/VendorAdminDashboard' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><VendorAdminDashboard /></ProtectedRouteVendorAdmin>} />
            <Route path='/pending-registration-requests' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><PendingVendorMemberRegistrationRequest /></ProtectedRouteVendorAdmin>} />
            <Route path='/ApprovedRegistrationList' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ApprovedRegistrationList /></ProtectedRouteVendorAdmin>} />
            <Route path='/RejectedRegistrationList' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><RejectedRegistrationList /></ProtectedRouteVendorAdmin>} />
            <Route path='/VendorMemberRegistrationForm' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><VendorMemberRegistrationForm /></ProtectedRouteVendorAdmin>} />
            <Route path='/pendingregistrationrequests/ViewPendingVendorMemberRegistrationRequest' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ViewPendingVendorMemberRegistrationRequest /></ProtectedRouteVendorAdmin>} />
            <Route path='/ApprovedRegistrationList/ViewApprovedRegistrationfulldetails/:vendorId' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ViewApprovedRegistrationfulldetails /></ProtectedRouteVendorAdmin>} />
            <Route path='/ListPendingProducts' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ListPendingProducts /></ProtectedRouteVendorAdmin>} />
            <Route path='/ListPendingProducts/ViewDetailsPendingProducts/:vendorId' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ViewDetailsPendingProducts /></ProtectedRouteVendorAdmin>} />
            <Route path='/ApprovedProductsList' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ApprovedProductsList /></ProtectedRouteVendorAdmin>} />
            <Route path='/ApprovedProductsList/ViewDetailsApprovedProducts/:vendorId' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ViewDetailsApprovedProducts /></ProtectedRouteVendorAdmin>} />
            <Route path='/RejectedProductsList' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><RejectedProductsList /></ProtectedRouteVendorAdmin>} />
            <Route path='/AddProduct' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><AddProduct /></ProtectedRouteVendorAdmin>} />
            <Route path='/ProductListVendorAdmin' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ProductList /></ProtectedRouteVendorAdmin>} />
            <Route path='/ViewDetailsProduct/:customerId' element={<ProtectedRouteVendorAdmin isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}><ViewDetailsProduct /></ProtectedRouteVendorAdmin>} />


        </Routes>

    );
}

export default App;