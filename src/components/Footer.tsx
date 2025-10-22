// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 text-center text-gray-400 text-sm">
      <p>&copy; {new Date().getFullYear()} Unspoken Chronicles. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;