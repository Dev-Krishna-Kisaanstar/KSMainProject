import React from 'react';

function Footerbar() {
    return (
        <div
            className="container-fluid text-center py-3"
            style={{
                backgroundColor: '#F6F6F6', // Background color
                color: '#333333', // Updated text color
                fontFamily: 'Poppins, sans-serif', // Font for footer
            }}
        >
            <div className="row">
                {/* Column 1: Copyright Text */}
                <div className="col-md-6">
                    <p style={{ margin: 0, fontFamily: 'Poppins, sans-serif' }}>
                        @all copyright reserved
                    </p>
                </div>

                {/* Column 2: Terms and Privacy Links */}
                <div className="col-md-6">
                    <p style={{ margin: 0 }}>
                        <a
                            href="/terms-of-use"
                            style={{
                                textDecoration: 'none',
                                color: '#333333', // Link color adjusted
                                marginRight: '15px',
                                fontFamily: 'Poppins, sans-serif', // Font for links
                            }}
                        >
                            Terms of Use
                        </a>
                        |
                        <a
                            href="/privacy-policy"
                            style={{
                                textDecoration: 'none',
                                color: '#333333', // Link color adjusted
                                marginLeft: '15px',
                                fontFamily: 'Poppins, sans-serif', // Font for links
                            }}
                        >
                            Privacy Policy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Footerbar;
