import React from 'react';

const BillFormat = ({
  amount,
  customerCareNo,
  weight,
  orderId,
  contractId,
  customerId,
  contractPersonId,
  productName,
  totalAmountWords,
  senderName,
  senderContact,
  senderAddress,
  senderCity,
  senderPincode,
  receiverName,
  receiverContact,
  receiverAddress,
  receiverCity,
  receiverPincode,
  barcode
}) => {
  const styles = {
    container: {
      fontFamily: 'Poppins, sans-serif',
      padding: '20px',
      width: '800px',
      margin: 'auto',
    },
    header: {
      textAlign: 'center',
      fontWeight: 'bold',
      margin: '10px 0',
      fontSize: '24px',  // Increased font size for the header
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    td: {
      border: '1px solid black',
      padding: '10px',
      textAlign: 'left',
      height: '40px',
    },
    largeCell: {
      height: '80px',
    },
    center: {
      textAlign: 'center',
    },
    bold: {
      fontWeight: 'bold',
    },
    barcode: {
      fontFamily: 'monospace',
      fontSize: '18px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '5px',
    },
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Bill</title>
          <style>
            body {
              font-family: 'Poppins, sans-serif';
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              border: 1px solid black;
              padding: 10px;
              text-align: left;
              height: 40px;
            }
            h2 {
              text-align: center;
              margin: 10px 0;
              font-size: 24px;  // Match the size of the header
            }
          </style>
        </head>
        <body>
          <table>
            <tbody>
              <tr>
                <td colspan="2" style="text-align: center; font-weight: bold; font-size: 24px;">Business parcel cash on delivery</td>
              </tr>
              <tr>
                <td>For Rs : ${amount}</td>
                <td>Customer Care No: ${customerCareNo}</td>
              </tr>
              <tr>
                <td>Weight: ${weight}</td>
                <td>KS Order ID: ${orderId}</td>
              </tr>
              <tr>
                <td><strong>Contract ID: ${contractId}</strong></td>
                <td><strong>Customer -Id: ${customerId}</strong></td>
              </tr>
              <tr>
                <td><strong>Contract Person ID: ${contractPersonId}</strong></td>
                <td>${productName}</td>
              </tr>
              <tr>
                <td colSpan="2">Rupees: ${totalAmountWords}</td>
              </tr>
              <tr>
                <td class="${styles.center.className}" colSpan="1">Business parcel cash on delivery</td>
                <td class="${styles.center.className}" colSpan="1">
                  <div style="${styles.barcode}">${barcode}</div>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <table>
                    <tbody>
                      <tr>
                        <td><strong>From</strong></td>
                        <td><strong>To</strong></td>
                      </tr>
                      <tr>
                        <td>Name: ${senderName}</td>
                        <td>Name: ${receiverName}</td>
                      </tr>
                      <tr>
                        <td>Contact Number: ${senderContact}</td>
                        <td>Contact Number: ${receiverContact}</td>
                      </tr>
                      <tr>
                        <td>Address: ${senderAddress}</td>
                        <td>Address: ${receiverAddress}</td>
                      </tr>
                      <tr>
                        <td>City: ${senderCity}</td>
                        <td>City: ${receiverCity}</td>
                      </tr>
                      <tr>
                        <td>Pincode: ${senderPincode}</td>
                        <td>Pincode: ${receiverPincode}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = () => {
    const shareData = {
      title: 'Order Details',
      text: `Order ID: ${orderId}\nAmount: ${amount}\nFrom: ${senderName}\nTo: ${receiverName}`,
      url: window.location.href, // Use the current page URL.
    };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Share successful'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that do not support the Web Share API.
      const mailtoLink = `mailto:?subject=Order Details&body=${encodeURIComponent(JSON.stringify(shareData, null, 2))}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td colSpan="2" style={{ ...styles.td, ...styles.center, ...styles.header }}>
              <strong>Business parcel cash on delivery</strong>
            </td>
          </tr>
          <tr>
            <td style={styles.td}>For Rs : {amount}</td>
            <td style={styles.td}>Customer Care No: {customerCareNo}</td>
          </tr>
          <tr>
            <td style={styles.td}>Weight: {weight}</td>
            <td style={styles.td}>KS Order ID: {orderId}</td>
          </tr>
          <tr>
            <td style={{ ...styles.td, ...styles.bold }}>Contract ID: {contractId}</td>
            <td style={{ ...styles.td, ...styles.bold }}>Customer -Id: {customerId}</td>
          </tr>
          <tr>
            <td style={{ ...styles.td, ...styles.bold }}>Contract Person ID: {contractPersonId}</td>
            <td style={styles.td}>{productName}</td>
          </tr>
          <tr>
            <td style={styles.td} colSpan="2">Rupees: {totalAmountWords}</td>
          </tr>
          <tr>
            <td style={{ ...styles.td, ...styles.center, ...styles.largeCell }} colSpan="1">Business parcel cash on delivery</td>
            <td style={{ ...styles.td, ...styles.center, ...styles.largeCell }} colSpan="1">
              <div style={styles.barcode}>{barcode}</div>
            </td>
          </tr>
          <tr>
            <td style={styles.td} colSpan="2">
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td style={styles.td}><strong>From</strong></td>
                    <td style={styles.td}><strong>To</strong></td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Name: {senderName}</td>
                    <td style={styles.td}>Name: {receiverName}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Contact Number: {senderContact}</td>
                    <td style={styles.td}>Contact Number: {receiverContact}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Address: {senderAddress}</td>
                    <td style={styles.td}>Address: {receiverAddress}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>City: {senderCity}</td>
                    <td style={styles.td}>City: {receiverCity}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>Pincode: {senderPincode}</td>
                    <td style={styles.td}>Pincode: {receiverPincode}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={styles.buttonContainer}>
        <button style={{ ...styles.button, backgroundColor: 'lightblue' }} onClick={handlePrint}>
          Print
        </button>
        <button style={{ ...styles.button, backgroundColor: 'lightgreen' }} onClick={handleShare}>
          Share
        </button>
      </div>
    </div>
  );
};

export default BillFormat;