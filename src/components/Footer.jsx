import React from 'react';

function Footer() {
  return (
    <footer className="bg-[#250902] text-white text-sm text-center py-4">
      <p>
        © {new Date().getFullYear()} Academic Affairs Office, VJTI Mumbai.
        Designed & Developed by Academic Affairs Office
      </p>
    </footer>
  );
}

export default Footer;
