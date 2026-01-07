import { useState } from 'react';

import './HamburgerButton.css';

// Hamburger menu button component
export default function HamburgerButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle hamburger button open/closed state when clicked
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
    </button>
  );
}
