import './HamburgerButton.css';

// Hamburger menu button component
export default function HamburgerButton({ isOpen, onToggle }) {
  return (
    <button
      className={`hamburger ${isOpen ? 'open' : ''}`}
      onClick={onToggle}
      aria-label="Toggle settings menu"
      aria-expanded={isOpen}
    >
      <div className="line"></div>
      <div className="line"></div>
      <div className="line"></div>
    </button>
  );
}
