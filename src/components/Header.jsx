import React from 'react';
import vjtiLogo from '@/assets/vjti-logo.gif';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <img
        src={vjtiLogo}
        alt="VJTI Logo"
        className="h-16 sm:h-18 md:h-20 lg:h-24"
      />
      <div className="flex items-center text-sm font-medium text-gray-700">
        <Link to="/suggestions" className="hover:text-black">
          Make a Suggestion
        </Link>
      </div>
    </header>
  );
}

export default Header;
