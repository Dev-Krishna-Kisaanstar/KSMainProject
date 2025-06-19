import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Barcodejson from '../Assets/BarCode/BarCode.json';  // Import JSON containing barcode values
import JsBarcode from 'jsbarcode'; // Import JsBarcode

// Function to generate a Base64 barcode image
const generateBarcode = (barcodeValue) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, barcodeValue, {
    format: 'CODE128',
    displayValue: true,
  });
  return canvas.toDataURL('image/png');
};

const numberToWords = (num) => {
  if (num === 0) return 'zero rupees';

  const belowTwenty = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const belowHundred = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const aboveHundred = ['thousand', 'million', 'billion'];

   const parseNumber = (n) => {
    const words = [];
    if (n >= 100) {
      const hundreds = Math.floor(n / 100);
      words.push(belowTwenty[hundreds], 'hundred');
      n %= 100;
    }
    if (n >= 20) {
      const tens = Math.floor(n / 10);
      words.push(belowHundred[tens]);
      n %= 10;
    }
    if (n > 0) {
      words.push(belowTwenty[n]);
    }
    return words.join(' ');
  };

 const scaleNumbers = (n) => {
    if (n === 0) return 'zero';
    let scale = 0;
    const words = [];
    while (n > 0) {
      const segment = n % 1000;
      if (segment > 0) {
        const segmentWords = parseNumber(segment);
        if (scale > 0) {
          words.unshift(segmentWords + ' ' + aboveHundred[scale - 1]);
        } else {
          words.unshift(segmentWords);
        }
      }
      n = Math.floor(n / 1000);
      scale++;
    }
    return words.join(' ');
  };

  return scaleNumbers(num).trim() + ' rupees';
};

const BillFormat = ({
  finalAmount,
  orderId,
  productName,
  customerName,
  customerMobile,
  Address,
  assignedBarcode // <-- ensure you accept this prop
}) => {
  const [barcodeImage, setBarcodeImage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (assignedBarcode) {
      const barcodeDataUrl = generateBarcode(assignedBarcode);
      setBarcodeImage(barcodeDataUrl);
    }
  }, [assignedBarcode]);

  // Convert amount to words
  const totalAmountWords = numberToWords(finalAmount);

  // Static Information
  const senderDetails = {
    name: "KisaanStar Solutions Pvt. Ltd",
    contactNumber: "+918830385928",
    address: "4th floor office No 401, Vishwakarma Pride IT park, Nagar Rd, near hp petrol pump, Wagholi, Pune, Maharashtra 412207",
    city: "Pune",
    pincode: "412207",
    customerCareNo: "+918830385928",
    contractPersonId: "0000111716",
    contractId: "40229906",
    customerId: "0000070327"
  };

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
      fontSize: '24px',
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
    colWidth: {
      width: '50%',
    },
  };

  // Dispatch function to get a new barcode
  const handleDispatch = () => {
    if (currentIndex < Barcodejson.data.length - 1) {
      // Move to next order
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      console.log('All orders have been dispatched.');
    }
  };

  // Function to handle print functionality
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
              margin: 0;
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
              font-size: 24px;
            }
            .header {
              text-align: center;
              font-weight: bold;
              margin: 10px 0;
              font-size: 24px;
            }
            .bold {
              font-weight: bold;
            }
            .center {
              text-align: center;
            }
            .largeCell {
              height: 80px;
            }
          </style>
        </head>
        <body>
          <table>
            <tbody>
              <tr>
                <td colspan="2" class="header">Business Parcel Cash on Delivery</td>
              </tr>
              <tr>
                <td><b>For Rs:</b> ${finalAmount}</td>
                <td><b>Customer Care No:</b> ${senderDetails.customerCareNo}</td>
              </tr>
              <tr>
                <td><b>Weight:</b></td>
                <td></td>
              </tr>
              <tr>
                <td><b>KS Order ID:</b> ${orderId}</td>
                <td></td>
              </tr>
              <tr>
                <td class="bold">Contract ID: ${senderDetails.contractId}</td>
                <td class="bold">Customer ID: ${senderDetails.customerId}</td>
              </tr>
              <tr>
                <td class="bold">Contract Person ID: ${senderDetails.contractPersonId}</td>
                <td><b>Product Name:</b> ${productName}</td>
              </tr>
              <tr>
                <td class="bold center" colSpan="2">Rupees: ${totalAmountWords}</td>
              </tr>
              <tr>
                <td class="center largeCell" colSpan="1"><b>Business Parcel Cash on Delivery</b></td>
                <td class="center largeCell" colSpan="1">
                  <img src="${barcodeImage}" alt="Generated Barcode" style="max-width: 100%;" />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tbody>
                      <tr>
                        <td class="colWidth"><strong>From:</strong></td>
                        <td class="colWidth"><strong>To:</strong></td>
                      </tr>
                      <tr>
                        <td><b>Name:</b> ${senderDetails.name}</td>
                        <td><b>Name:</b> ${customerName}</td>
                      </tr>
                      <tr>
                        <td><b>Contact Number:</b> ${senderDetails.contactNumber}</td>
                        <td><b>Contact Number:</b> ${customerMobile}</td>
                      </tr>
                      <tr>
                        <td><b>Address:</b> ${senderDetails.address}</td>
                        <td>
                          <strong>Address:</strong><br />
                          <strong>At/Post:</strong> ${Address.postOffice}<br />
                          <strong>Village:</strong> ${Address.village}<br />
                          <strong>Taluka:</strong> ${Address.taluka}<br />
                          <strong>District:</strong> ${Address.district}<br />
                          <strong>Pincode:</strong> ${Address.pincode}<br />
                          <strong>Nearby Location:</strong> ${Address.nearbyLocation}
                        </td>
                      </tr>
                      <tr>
                        <td><b>City:</b> ${senderDetails.city}</td>
                        <td><b>City:</b> ${Address.district}</td>
                      </tr>
                      <tr>
                        <td><b>Pincode:</b> ${senderDetails.pincode}</td>
                        <td><b>Pincode:</b> ${Address.pincode}</td>
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

  const handleShare = async () => {
    const doc = new jsPDF();

    doc.setFontSize(24);
    doc.text('Business Parcel Cash on Delivery', 15, 20);
    doc.setFontSize(12);
    doc.text(`For Rs: ${finalAmount}`, 15, 30);
    doc.text(`Customer Care No: ${senderDetails.customerCareNo}`, 15, 40);
    doc.text(`KS Order ID: ${orderId}`, 15, 50);
    doc.text(`Contract ID: ${senderDetails.contractId}`, 15, 60);
    doc.text(`Customer ID: ${senderDetails.customerId}`, 15, 70);
    doc.text(`Contract Person ID: ${senderDetails.contractPersonId}`, 15, 80);
    doc.text(`Product Name: ${productName}`, 15, 90);
    doc.text(`Rupees: ${totalAmountWords}`, 15, 100);

    // Add from and to tables
    doc.autoTable({
      head: [['From', 'To']],
      body: [
        [
          `${senderDetails.name}\n${senderDetails.contactNumber}\n${senderDetails.address}\nCity: ${senderDetails.city}\nPincode: ${senderDetails.pincode}`,
          `${customerName}\n${customerMobile}\n${Address.postOffice}\n${Address.village}\n${Address.taluka}\n${Address.district}\nPincode: ${Address.pincode}`
        ]
      ],
      startY: 110,
    });

    // Add barcode image if exists
    if (barcodeImage) {
      doc.addImage(barcodeImage, 'PNG', 15, doc.autoTable.previous.finalY + 10, 60, 20);
    }

    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], `bill_${orderId}.pdf`, { type: 'application/pdf' });

    if (navigator.share) {
      const shareData = {
        title: `Order #${orderId} Details`,
        text: `Order ID: ${orderId}\nAmount: ${finalAmount}\nFrom: ${senderDetails.name}\nTo: ${customerName}`,
        files: [pdfFile],
      };

      try {
        await navigator.share(shareData);
        console.log('Share successful');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.error('Share not supported on this browser.');
    }
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td colSpan="2" style={{ ...styles.td, ...styles.center, ...styles.header }}>
              <strong>Business Parcel Cash on Delivery</strong>
            </td>
          </tr>
          <tr>
            <td style={styles.td}><b>For Rs:</b> {finalAmount}</td>
            <td style={styles.td}><b>Customer Care No:</b> {senderDetails.customerCareNo}</td>
          </tr>
          <tr>
            <td style={styles.td}><b>Weight:</b></td>
            <td style={styles.td}><b>KS Order ID:</b> {orderId}</td>
          </tr>
          <tr>
            <td style={{ ...styles.td, ...styles.bold }}>Contract ID: {senderDetails.contractId}</td>
            <td style={{ ...styles.td, ...styles.bold }}>Customer ID: {senderDetails.customerId}</td>
          </tr>
          <tr>
            <td style={{ ...styles.td, ...styles.bold }}>Contract Person ID: {senderDetails.contractPersonId}</td>
            <td style={styles.td}><b>Product Name:</b> {productName}</td>
          </tr>
          <tr>
            <td style={{ ...styles.td, textAlign: 'center' }} colSpan="2"><b>Rupees: {totalAmountWords}</b></td>
          </tr>
          <tr>
            <td style={{ ...styles.td, ...styles.center, ...styles.largeCell }} colSpan="1"><b>Business Parcel Cash on Delivery</b></td>
            <td style={{ ...styles.td, ...styles.center, ...styles.largeCell }} colSpan="1">
              <img src={barcodeImage} alt="Generated Barcode" style={{ maxWidth: '100%', height: 'auto' }} />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td style={{ ...styles.td, ...styles.colWidth }}><strong>From:</strong></td>
                    <td style={{ ...styles.td, ...styles.colWidth }}><strong>To:</strong></td>
                  </tr>
                  <tr>
                    <td style={styles.td}><b>Name:</b> {senderDetails.name}</td>
                    <td style={styles.td}><b>Name:</b> {customerName}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}><b>Contact Number:</b> {senderDetails.contactNumber}</td>
                    <td style={styles.td}><b>Contact Number:</b> {customerMobile}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}>
                      <b>Address:</b><br />
                      <strong>At/Post:</strong> {Address.postOffice}<br />
                      <strong>Village:</strong> {Address.village}<br />
                      <strong>Taluka:</strong> {Address.taluka}<br />
                      <strong>District:</strong> {Address.district}<br />
                      <strong>Pincode:</strong> {Address.pincode}<br />
                      <strong>Nearby Location:</strong> {Address.nearbyLocation}
                    </td>
                    <td style={styles.td}>
                      <strong>Address:</strong><br />
                      <strong>At/Post:</strong> {Address.postOffice}<br />
                      <strong>Village:</strong> {Address.village}<br />
                      <strong>Taluka:</strong> {Address.taluka}<br />
                      <strong>District:</strong> {Address.district}<br />
                      <strong>Pincode:</strong> {Address.pincode}<br />
                      <strong>Nearby Location:</strong> {Address.nearbyLocation}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.td}><b>City:</b> {senderDetails.city}</td>
                    <td style={styles.td}><b>City:</b> {Address.district}</td>
                  </tr>
                  <tr>
                    <td style={styles.td}><b>Pincode:</b> {senderDetails.pincode}</td>
                    <td style={styles.td}><b>Pincode:</b> {Address.pincode}</td>
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
        <button style={{ ...styles.button, backgroundColor: 'lightyellow' }} onClick={handleDispatch}>
          Dispatch
        </button>
      </div>
    </div>
  );
};

export default BillFormat;