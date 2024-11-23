import React from 'react';

function Footer() {
    return (
        <div
            className="container-fluid text-center py-4"
            style={{
                backgroundColor: '#24231D',
                color: '#FFFFFF', // Ensures text is visible on dark background
            }}
        >
            <div className="row">
                {/* Column 1: Logo, Description, Social Media */}
                <div className="col-lg-3 col-md-6 text-start">
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Logo"
                        style={{ width: '100px', marginBottom: '15px' }}
                    />
                    <p>
                        A brief description about the company or organization.
                        Providing insight into your mission or vision.
                    </p>
                    <div>
                        {/* Social Media Icons */}
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 5px', color: '#FFFFFF' }}
                        >
                            <i className="fab fa-facebook fa-lg"></i>
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 5px', color: '#FFFFFF' }}
                        >
                            <i className="fab fa-twitter fa-lg"></i>
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ margin: '0 5px', color: '#FFFFFF' }}
                        >
                            <i className="fab fa-instagram fa-lg"></i>
                        </a>
                    </div>
                </div>

                {/* Column 2: Navigation */}
                <div className="col-lg-3 col-md-6 text-start">
                    <h5>Navigation</h5>
                    <ul className="list-unstyled">
                        <li>
                            <a href="/home" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/about" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                                About Us
                            </a>
                        </li>
                        <li>
                            <a href="/services" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                                Services
                            </a>
                        </li>
                        <li>
                            <a href="/contact" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: News */}
                <div className="col-lg-3 col-md-6 text-start">
                    <h5>News</h5>
                    <ul className="list-unstyled">
                        <li>
                            <a href="/news/1" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                                Latest Updates
                            </a>
                        </li>
                        <li>
                            <a href="/news/2" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                                Blog Post 1
                            </a>
                        </li>
                        <li>
                            <a href="/news/3" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                                Blog Post 2
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 4: Contact Info */}
                <div className="col-lg-3 col-md-6 text-start">
                    <h5>Contact Us</h5>
                    <p>
                        <i className="fas fa-phone"></i>{' '}
                        <a href="tel:+1234567890" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                            +1234567890
                        </a>
                    </p>
                    <p>
                        <i className="fas fa-envelope"></i>{' '}
                        <a href="mailto:info@example.com" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
                            info@example.com
                        </a>
                    </p>
                    <p>
                        <i className="fas fa-map-marker-alt"></i>{' '}
                        <a
                            href="https://maps.google.com?q=123+Main+St,+City,+Country"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: '#FFFFFF' }}
                        >
                            123 Main St, City, Country
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
