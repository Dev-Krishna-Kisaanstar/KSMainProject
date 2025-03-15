import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import { LinkedIn } from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTube from '@mui/icons-material/YouTube';
import { Navbar, Nav } from 'react-bootstrap';
import './Header.css'; // Import the CSS file for consistent styles

function Headerbar() {
  return (
    <Navbar
      className="d-none d-lg-flex"
      style={{
        backgroundColor: '#fff', // White background
        padding: '0 10px',
        fontFamily: 'Poppins, sans-serif',
      }}
      expand="lg"
    >
      <Navbar.Collapse id="headerbar-navbar-nav">
        <Nav className="w-100 align-items-center">
          <div className="d-flex flex-column flex-lg-row align-items-center w-100 justify-content-between">
            {/* Location */}
            <div className="d-flex flex-wrap align-items-center">
              <Nav.Link
                href="https://www.google.com/maps/search/?api=1&query=Wagholi,+Pune,+Maharashtra+412207"
                target="_blank"
                className="nav-link text-black d-flex align-items-center mx-2"
              >
                <LocationOnIcon className="icon-grey" />
                <span className="ml-1" style={{ fontSize: '0.875rem' }}>
                  Wagholi, Pune, Maharashtra 412207
                </span>
              </Nav.Link>

              {/* Email */}
              <Nav.Link
                href="mailto:info@kisaanstar.com"
                className="nav-link text-black d-flex align-items-center mx-2"
              >
                <EmailIcon className="icon-grey" />
                <span className="ml-1" style={{ fontSize: '0.875rem' }}>
                  info@kisaanstar.com
                </span>
              </Nav.Link>
            </div>

            {/* Social Links */}
            <div className="d-flex mt-2 mt-lg-0">
              <Nav.Link
                href="https://youtube.com/@kisaanstar?si=21s_5XXHiH7HwGdO"
                target="_blank"
                className="nav-link text-black mx-1"
              >
                <YouTube className="icon-grey" />
              </Nav.Link>
              <Nav.Link
                href="https://www.instagram.com/kisaanstar?igsh=YWs3d2V3MW5oejE"
                target="_blank"
                className="nav-link text-black mx-1"
              >
                <InstagramIcon className="icon-grey" />
              </Nav.Link>
              <Nav.Link
                href="https://www.linkedin.com/company/kisaanstar"
                target="_blank"
                className="nav-link text-black mx-1"
              >
                <LinkedIn className="icon-grey" />
              </Nav.Link>
            </div>
          </div>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Headerbar;
