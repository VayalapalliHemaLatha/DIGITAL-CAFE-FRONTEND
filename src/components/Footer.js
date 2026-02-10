import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="footer-restoran">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <h5>Company</h5>
            <Link to="/" className="footer-link">About Us</Link>
            <Link to="/" className="footer-link">Contact Us</Link>
            <Link to="/login" className="footer-link">Sign In</Link>
            <Link to="/register" className="footer-link">Register</Link>
            <Link to="/account" className="footer-link">Account / Sign out</Link>
          </div>
          <div id="contact" className="col-lg-3 col-md-6">
            <h5>Contact</h5>
            <p className="mb-1"><i className="fas fa-map-marker-alt text-primary me-2"></i>123 Street, New York, USA</p>
            <p className="mb-1"><i className="fas fa-phone text-primary me-2"></i>+012 345 67890</p>
            <p className="mb-0"><i className="fas fa-envelope text-primary me-2"></i>info@digitalcafe.com</p>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Opening</h5>
            <p className="mb-1">Monday - Saturday<br />09AM - 09PM</p>
            <p className="mb-0">Sunday<br />10AM - 08PM</p>
          </div>
          <div className="col-lg-3 col-md-6">
            <h5>Newsletter</h5>
            <p className="small mb-3">Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
            <div className="input-group">
              <input type="text" className="form-control rounded-0" placeholder="Your email" />
              <button className="btn btn-primary rounded-0" type="button">SignUp</button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="copyright text-center">
          <span className="text-white">&copy; Digital Cafe, All Right Reserved.</span>
          <span className="ms-2">Designed By <a href="https://htmlcodex.com" className="text-primary" target="_blank" rel="noreferrer">HTML Codex</a></span>
          <span className="ms-2">| Distributed By <a href="https://themewagon.com" className="text-primary" target="_blank" rel="noreferrer">ThemeWagon</a></span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
