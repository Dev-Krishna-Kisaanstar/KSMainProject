import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from '../Assets/Logo/Kisaanstarlogo1.webp';

function Invoice({ order }) {  // Accepting order as a prop
  const head = document.head;
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
  link.rel = "stylesheet";
  head.appendChild(link);

  const styles = {
    container: {
      margin: "0 auto",
      fontFamily: "'Poppins', sans-serif",
      background: "#fff",
      padding: "10mm", // Adjusted padding for A6
      boxShadow: "none" // Remove shadow for print
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "2px solid #ddd",
      paddingBottom: "15px"
    },
    logoContainer: {
      position: "relative",
      background: "#A2D7A0", // Updated light green color
      padding: "15px",
      width: "180px",
      clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)"
    },
    title: { textAlign: "right" },
    sectionTitle: {
      color: "#A2D7A0", // Updated light green color
      fontWeight: "bold",
      textTransform: "uppercase"
    },
    tableHeader: {
      background: "#A2D7A0", // Updated light green color
      color: "#000",
      fontWeight: "bold",
      textAlign: "center"
    },
    tableCell: { textAlign: "center" },
    totalHighlight: {
      background: "#A2D7A0", // Updated light green color
      padding: "10px",
      display: "inline-block",
      borderRadius: "5px",
      fontWeight: "bold"
    },
    footer: {
      background: "#A2D7A0", // Updated light green color
      padding: "25px 15px 15px",
      color: "#000",
      textAlign: "center",
      marginTop: "50px",
      clipPath: "polygon(0 15%, 50% 0, 100% 15%, 100% 100%, 0 100%)"
    },
    footerText: {
      margin: 0,
      fontSize: "0.95rem"
    },
    logoImage: {
      width: "150px",
      height: "100px",
      objectFit: "contain",
      borderRadius: "40px"
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      margin: "20px 0"
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold"
    },
    printButton: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    shareButton: {
      backgroundColor: "#008CBA",
      color: "white",
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const subject = "Invoice from Kisaanstar";
    const body = "Please find attached the invoice from Kisaanstar.";
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Make sure to check that order.licenseInfo is defined before accessing its properties
  const licenseInfo = order.licenseInfo || {};

  return (
    <div className="container" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={Logo} alt="Kisaanstar" style={styles.logoImage} />
        </div>
        <div style={styles.title}>
          <h2 className="fw-bold">Invoice</h2>
          <p className="text-muted">Invoice Number: {order.orderId}</p>
          <p className="text-muted">Invoice Date: {new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <h6 style={styles.sectionTitle}>Sold by</h6>
          <p className="fw-bold">Sold by: Kisaanstar</p>
          <p className="text-muted">Vendor Address: Address line here</p>
          <p className="text-muted">Vendor PAN Number: ABCDE1234F</p>
          <p className="text-muted">Vendor GSTIN: 1234ABCDE</p>
        </div>
        
        <div className="col-md-4">
          <h6 style={styles.sectionTitle}>Shipping Details</h6>
          <p className="fw-bold">Name: {order.customerName}</p>
          <p className="text-muted">Shipping Address: {`${order.village}, ${order.taluka}, ${order.district}, ${order.pincode}`}</p>
          <p className="text-muted">Mobile Number: {order.customerMobile}</p>
        </div>
        
        <div className="col-md-4">
          <h6 style={styles.sectionTitle}>Invoice Details</h6>
          <p className="fw-bold">Invoice No: {order.orderId}</p>
          <p className="text-muted">Invoice Date: {new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
      </div>

      <table className="table table-bordered mt-4">
        <thead>
          <tr style={styles.tableHeader}>
            <th>Sr No</th>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>HSN Code</th>
            <th>Product Price</th>
            <th>Tax (%)</th>
            <th>Qty</th>
            <th>SubTotal</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product, index) => (
            <tr key={index}>
              <td style={styles.tableCell}>{index + 1}</td>
              <td style={styles.tableCell}>P{product.code}</td>
              <td style={styles.tableCell}>{product.productName}</td>
              <td style={styles.tableCell}>{product.hsnCode}</td>
              <td style={styles.tableCell}>₹{product.productPrice}</td>
              <td style={styles.tableCell}>{product.taxRate}</td>
              <td style={styles.tableCell}>{product.quantity}</td>
              <td style={styles.tableCell}>₹{(product.productPrice * product.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment Method and Pricing Details Row */}
      <div className="row mt-4">
        <div className="col-md-6">
          <h6 style={styles.sectionTitle}>Payment Method</h6>
          <p className="text-muted">COD / Online</p>
        </div>
        
        <div className="col-md-6 text-end">
          <h6 style={styles.sectionTitle}>Pricing Details</h6>
          <p>Total Order Price: ₹{order.totalAmount}</p>
          <p>Delivery Charge: ₹{order.deliveryCharges}</p>
          <p>Wallet Used: ₹{order.walletUsed}</p>
          <h5 style={styles.totalHighlight}>Final Total: ₹{(order.totalAmount + order.deliveryCharges - order.walletUsed).toFixed(2)}</h5>
        </div>
      </div>

      {/* License Information Row */}
      <div className="mt-4">
        <h6 style={styles.sectionTitle}>License Information</h6>
        <div className="row">
          <div className="col-md-3">
            <p>Seed License Number:</p>
            <p className="fw-bold">{licenseInfo.seedLicense || "N/A"}</p>
          </div>
          <div className="col-md-3">
            <p>Pesticide License Number:</p>
            <p className="fw-bold">{licenseInfo.pesticideLicense || "N/A"}</p>
          </div>
          <div className="col-md-3">
            <p>Fertilizer License Number:</p>
            <p className="fw-bold">{licenseInfo.fertilizerLicense || "N/A"}</p>
          </div>
          <div className="col-md-3">
            <p>Other License Number:</p>
            <p className="fw-bold">{licenseInfo.otherLicense || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h6 style={styles.sectionTitle}>GST Declaration</h6>
        <p>
          We certify that our registration certificate under the GST Act, 2017 is in force on the date on which the supply of goods specified in this tax invoice is made by me/us & the transaction of supply covered by this Tax Invoice had been effected by me/us & it shall be accounted for in the turnover of supplies while filling of return & the due tax if any payable on the supplies has been paid or shall be paid. Further certified that the particulars given above are true and correct & the amount indicated represents the prices actually charged and that there is no flow additional consideration directly or indirectly from the buyer. Interest @15% p.a. charged on all outstanding more than one month after invoice has been rendered.
        </p>
      </div>

      <div className="mt-4">
        <h6 style={styles.sectionTitle}>Kisaanstar Pvt Ltd. Declaration Letter</h6>
        <p>To Whomesoever It May Concern</p>
        <p>I, {order.customerName}, hereby confirm that said above goods are being purchased for my internal or personal purpose and not for re-sale. I have read & understand and I am legally bound by terms and conditions of sale available at agribird.co.in or upon request.</p>
        <p>To return an item, visit <a href="https://kisaanstar.com/return-policy">https://kisaanstar.com/return-policy</a> for more information on your orders, visit <a href="https://kisaanstar.com/">https://kisaanstar.com/</a></p>
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>Thank you for buying on kisaanstar.com</p>
        <p style={styles.footerText}>Contact us: +91 8830385928</p>
      </div>

      {/* Print and Share Buttons */}
      <div style={styles.buttonContainer}>
        <button style={{ ...styles.button, ...styles.printButton }} onClick={handlePrint}>
          Print Invoice
        </button>
        <button style={{ ...styles.button, ...styles.shareButton }} onClick={handleShare}>
          Share Invoice
        </button>
      </div>

      <div style={{ display: 'none' }}>
        <style>{`
          @media print {
            @page {
              size: A6 portrait; /* A6 page size */
              margin: 0;  /* Remove default margin */
            }
            body {
              margin: 0; /* Remove default body margin */
            }
            .container {
              padding: 10mm; /* Adjust padding to suit the print area */
            }
            .buttonContainer {
              display: none; /* Hide buttons during print */
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Invoice;