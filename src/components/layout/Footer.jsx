import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

 const Footer = () => {
  return (
    <footer className='mega-footer'>
      <div className='footer-container'>
        <div className='footer-section'>
          <h3>About Us</h3>
          <p>electric products.</p>
        </div>

        <div className='footer-section'>
          <h3>Category</h3>
          <ul>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </ul>
        </div>

        <div className='footer-section'>
          <h3>Contact</h3>
          <p>Email: gotnowshop@gmail.com</p>
          <p>Phone: 0123456789</p>
        </div>

        <div className='footer-section'>
          <h3>Follow Us</h3>
          <div className='social-icons'>
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'>
              <FaFacebookF />
            </a>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'>
              <FaTwitter />
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'>
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className='footer-bottom'>
          <p>&copy; 2025 gotnow.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;