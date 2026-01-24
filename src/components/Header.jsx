import HamburgerButton from './HamburgerButton';
import ThemeToggle from './ThemeToggle';

export default function Header({ isDrawerOpen, onToggleDrawer, isDarkMode, onToggleTheme }) {
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
        gap-2
      ">
        <ThemeToggle
          isDarkMode={isDarkMode}
          onToggle={onToggleTheme}
        />
        <HamburgerButton
          isOpen={isDrawerOpen}
          onToggle={onToggleDrawer}
        />
      </div>
    </header>
  );
}
