// Hamburger menu button component
export default function HamburgerButton({ isOpen, onToggle }) {
  return (
    <button
      className="
        btn-icon min-w-[44px] min-h-[44px]
        flex flex-col justify-around items-center
        relative
      "
      onClick={onToggle}
      aria-label="Toggle settings menu"
      aria-expanded={isOpen}
    >
      {/* Line 1 */}
      <div className={`
        w-7 h-[3px] rounded-full
        bg-neutral-900 dark:bg-primary-400
        transition-all duration-300 ease-out
        ${isOpen ? 'rotate-45 translate-y-[9px]' : ''}
      `} />

      {/* Line 2 */}
      <div className={`
        w-7 h-[3px] rounded-full
        bg-primary-600 dark:bg-primary-400
        transition-all duration-300 ease-out
        ${isOpen ? 'opacity-0' : 'opacity-100'}
      `} />

      {/* Line 3 */}
      <div className={`
        w-7 h-[3px] rounded-full
        bg-primary-600 dark:bg-primary-400
        transition-all duration-300 ease-out
        ${isOpen ? '-rotate-45 -translate-y-[9px]' : ''}
      `} />
    </button>
  );
}
