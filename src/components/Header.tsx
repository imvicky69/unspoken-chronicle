// src/components/Header.tsx
import React from 'react';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
  return (
    // 1. Changed "justify-between" to "justify-center" to center the nav element
    <header className="py-6 px-10 flex justify-center items-center">
      <nav>
        {/* 2. Increased logo height from "h-10" to "h-14" (40px to 56px) */}
        <img src={logo} alt="Unspoken Chronicles Logo" className="h-20 w-auto" />
      </nav>
      {/* We can add navigation links here later */}
    </header>
  );
};

export default Header;