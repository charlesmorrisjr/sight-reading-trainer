import HamburgerButton from './HamburgerButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function Header({ isDrawerOpen, onToggle }) {
  return (
    <header className="
      sticky top-0 z-50
      w-full
      bg-white dark:bg-neutral-900
      border-b border-neutral-200 dark:border-neutral-700
      shadow-sm
    ">
      <div className="
        max-w-container mx-auto
        px-4 sm:px-8
        py-3 sm:py-4
        flex justify-end items-center
      ">
        <HamburgerButton
          isOpen={isDrawerOpen}
          onToggle={onToggle}
        />
      </div>
    </header>
  );
}
