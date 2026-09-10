import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', marginTop: 'auto' }}>
      <p>&copy; {new Date().getFullYear()} TasteTrack. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
