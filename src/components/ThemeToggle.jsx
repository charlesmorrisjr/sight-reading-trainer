import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button
      className="
        btn-icon min-w-[44px] min-h-[44px]
        flex items-center justify-center
        text-neutral-900 dark:text-yellow-400
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        transition-colors duration-200
      "
      onClick={onToggle}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <FontAwesomeIcon
        icon={isDarkMode ? faSun : faMoon}
        className="text-xl"
      />
    </button>
  );
}
