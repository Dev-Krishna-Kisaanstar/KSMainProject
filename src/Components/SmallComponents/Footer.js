import React from 'react';
import logo from '../../Assets/Logo/Kisaanstarlogo1.webp';

function Footer() {
    return (
        <div
            className="container-fluid text-center py-4"
            style={{
                backgroundColor: '#F6F6F6', // Background color
                color: '#333333', // Updated text color
                fontFamily: 'Poppins, sans-serif', // Font for footer
            }}
        >
            <div className="row">
                {/* Column 1: Logo, Description, Social Media */}
                <div className="col-lg-3 col-md-6 text-start">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: '200px', marginBottom: '15px', borderRadius: '30px' }}
                    />
                    <p style={{ fontFamily: 'Poppins, sans-serif' }}>
                        A brief description about the company or organization.
                        Providing insight into your mission or vision.
                    </p>
                    <div>
                        {/* Social Media Icons */}
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 5px', color: '#4BAF47' }} // Icon color
                        >
                            <i className="fab fa-facebook fa-lg"></i>
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 5px', color: '#4BAF47' }} // Icon color
                        >
                            <i className="fab fa-twitter fa-lg"></i>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 5px', color: '#4BAF47' }} // Icon color
                        >
                            <i className="fab fa-instagram fa-lg"></i>
                        </a>
                    </div>
                </div>

                {/* Column 2: Navigation */}
                <div className="col-lg-3 col-md-6 text-start">
                    <h5 style={{ fontFamily: 'Poppins, sans-serif', color: '#333333' }}>Navigation</h5>
                    <ul className="list-unstyled">
                        <li>
                            <a href="/home" style={{ textDecoration: 'none', color: '#333333' }}>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/about" style={{ textDecoration: 'none', color: '#333333' }}>
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="/services" style={{ textDecoration: 'none', color: '#333333' }}>
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="/contact" style={{ textDecoration: 'none', color: '#333333' }}>
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: News */}
                <div className="col-lg-3 col-md-6 text-start">
                    <h5 style={{ fontFamily: 'Poppins, sans-serif', color: '#333333' }}>News</h5>
                    <ul className="list-unstyled">
                        <li>
                            <a href="/news/1" style={{ textDecoration: 'none', color: '#333333' }}>
                                Latest Updates
                            </a>
                        </li>
                        <li>
                            <a href="/news/2" style={{ textDecoration: 'none', color: '#333333' }}>
                                Blog Post 1
                            </a>
                        </li>
                        <li>
                            <a href="/news/3" style={{ textDecoration: 'none', color: '#333333' }}>
                                Blog Post 2
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Contact Info */}
                <div className="col-lg-3 col-md-6 text-start">
                    <h5 style={{ fontFamily: 'Poppins, sans-serif', color: '#333333' }}>Contact Us</h5>
                    <p>
                        <i className="fas fa-phone"></i>{' '}
                        <a
                            href="tel:+918830385928"
                            style={{ textDecoration: 'none', color: '#333333' }}
                        >
                            +91 883 038 5928
                        </a>
                    </p>
                    <p>
                        <i className="fas fa-envelope"></i>{' '}
                        <a
                            href="mailto:info@kisaanstar.com"
                            style={{ textDecoration: 'none', color: '#333333' }}
                        >
                            info@kisaanstar.com
                        </a>
                    </p>
                    <p>
                        <i className="fas fa-map-marker-alt"></i>{' '}
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Wagholi,+Pune,+Maharashtra+412207"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: '#333333' }}
                        >
                            4th floor, office number 401, Vishwaraj Pride, Nagar Rd, near hp petrol pump, Wagholi, Pune, Maharashtra 412207
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
