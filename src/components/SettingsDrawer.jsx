import { useState, useEffect, useRef } from 'react';
import pianoNoteData from '../data/pianoNoteToAbc.json';

const KEY_SIGNATURES = [
  'C', 'G', 'D', 'A', 'E', 'B',
  'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'
];

// Extracted sub-components for better maintainability

function MenuButton({ label, onClick }) {
  return (
    <button
      className="
        flex justify-between items-center
        w-full min-h-[56px] px-6 py-4
        bg-white dark:bg-neutral-900
        text-neutral-900 dark:text-neutral-100
        text-left text-base
        border-none cursor-pointer
        transition-colors duration-200
        hover:bg-neutral-50 dark:hover:bg-neutral-800
        active:bg-neutral-100 dark:active:bg-neutral-700
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500
      "
      onClick={onClick}
    >
      <span className="font-medium">{label}</span>
      <span className="text-2xl text-neutral-400 dark:text-neutral-600">›</span>
    </button>
  );
}

function Submenu({ title, onBack, children }) {
  return (
    <div className="flex flex-col h-full -m-6">
      {/* Submenu header */}
      <div className="flex items-center gap-4 px-6 py-5 border-b border-neutral-200 dark:border-neutral-700">
        <button
          className="
            btn-icon text-2xl
            text-neutral-900 dark:text-neutral-100
            hover:text-primary-600 dark:hover:text-primary-400
            transition-colors duration-200
          "
          onClick={onBack}
        >
          ‹
        </button>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>

      {/* Submenu content - scrollable */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function SubmenuOption({ label, isSelected, onClick }) {
  return (
    <button
      className={`
        flex justify-between items-center
        min-h-[56px] px-6 py-4
        border-none text-left text-base cursor-pointer
        transition-all duration-200
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500
        ${isSelected
          ? 'bg-primary-600 text-white font-medium'
          : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        }
      `}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function ToggleOption({ label, isActive, onClick }) {
  return (
    <button
      className={`
        flex justify-between items-center
        min-h-[56px] px-6 py-4
        border-none text-left text-base cursor-pointer
        transition-all duration-200
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary-500
        ${isActive
          ? 'bg-success-100 dark:bg-success-900/30 text-neutral-900 dark:text-neutral-100'
          : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        }
      `}
      onClick={onClick}
    >
      <span>{label}</span>
      {isActive && (
        <span className="text-xl text-success-600 dark:text-success-400">✓</span>
      )}
    </button>
  );
}

// Main SettingsDrawer component
export default function SettingsDrawer({ isOpen, settings, onClose, onSettingsChange }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [currentMenu, setCurrentMenu] = useState('main');
  const drawerRef = useRef(null);

  // Navigation functions
  const navigateToSubmenu = (submenu) => setCurrentMenu(submenu);
  const navigateBack = () => setCurrentMenu('main');

  // Sync local state when external settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handle field changes with auto-save
  const handleChange = (field, value) => {
    const newSettings = { ...localSettings, [field]: value };

    // Validate note range if changing min or max
    if (field === 'minRange' || field === 'maxRange') {
      const minIndex = pianoNoteData.findIndex(
        note => note.name === (field === 'minRange' ? value : newSettings.minRange)
      );
      const maxIndex = pianoNoteData.findIndex(
        note => note.name === (field === 'maxRange' ? value : newSettings.maxRange)
      );

      // Reject if invalid range (max must be greater than min)
      if (maxIndex <= minIndex) {
        return;
      }
    }

    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Handle nested createNote checkboxes
  const handleNoteTypeChange = (noteType, checked) => {
    // Prevent unchecking last checkbox
    const currentChecked = Object.values(localSettings.createNote).filter(Boolean).length;
    if (!checked && currentChecked === 1) {
      return;
    }

    const newSettings = {
      ...localSettings,
      createNote: {
        ...localSettings.createNote,
        [noteType]: checked
      }
    };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Close drawer when clicking backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Manage body scroll lock when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus management and menu reset when drawer opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMenu('main'); // Always show main menu when opening
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-black/50 dark:bg-black/70
          transition-opacity duration-300 ease-drawer
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          z-[1000]
        `}
        onClick={handleBackdropClick}
        aria-hidden={!isOpen}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`
          fixed top-0 right-0 bottom-0
          w-full max-w-[400px] sm:max-w-md lg:max-w-lg
          bg-white dark:bg-neutral-900
          shadow-drawer dark:shadow-drawer-dark
          transform transition-transform duration-300 ease-drawer
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          z-[1001]
          flex flex-col overflow-hidden
        `}
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Settings
          </h2>
          <button
            className="
              btn-icon text-3xl leading-none
              text-neutral-700 hover:text-primary-600
              dark:text-neutral-300 dark:hover:text-primary-400
              transition-colors duration-200
            "
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        {/* Drawer Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Main Menu */}
          {currentMenu === 'main' && (
            <div className="flex flex-col gap-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden">
              <MenuButton
                label="Minimum Note"
                onClick={() => navigateToSubmenu('minNote')}
              />
              <MenuButton
                label="Maximum Note"
                onClick={() => navigateToSubmenu('maxNote')}
              />
              <MenuButton
                label="Note Durations"
                onClick={() => navigateToSubmenu('noteDurations')}
              />
              <MenuButton
                label="Key Signature"
                onClick={() => navigateToSubmenu('keySignature')}
              />
              <MenuButton
                label="Number of Measures"
                onClick={() => navigateToSubmenu('measures')}
              />
            </div>
          )}

          {/* Min Note Submenu */}
          {currentMenu === 'minNote' && (
            <Submenu
              title="Minimum Note"
              onBack={navigateBack}
            >
              {pianoNoteData.map(note => (
                <SubmenuOption
                  key={note.name}
                  label={note.name}
                  isSelected={localSettings.minRange === note.name}
                  onClick={() => handleChange('minRange', note.name)}
                />
              ))}
            </Submenu>
          )}

          {/* Max Note Submenu */}
          {currentMenu === 'maxNote' && (
            <Submenu
              title="Maximum Note"
              onBack={navigateBack}
            >
              {pianoNoteData.map(note => (
                <SubmenuOption
                  key={note.name}
                  label={note.name}
                  isSelected={localSettings.maxRange === note.name}
                  onClick={() => handleChange('maxRange', note.name)}
                />
              ))}
            </Submenu>
          )}

          {/* Note Durations Submenu */}
          {currentMenu === 'noteDurations' && (
            <Submenu
              title="Note Durations"
              onBack={navigateBack}
            >
              <ToggleOption
                label="Whole notes"
                isActive={localSettings.createNote.whole}
                onClick={() => handleNoteTypeChange('whole', !localSettings.createNote.whole)}
              />
              <ToggleOption
                label="Half notes"
                isActive={localSettings.createNote.half}
                onClick={() => handleNoteTypeChange('half', !localSettings.createNote.half)}
              />
              <ToggleOption
                label="Quarter notes"
                isActive={localSettings.createNote.quarter}
                onClick={() => handleNoteTypeChange('quarter', !localSettings.createNote.quarter)}
              />
              <ToggleOption
                label="Eighth notes"
                isActive={localSettings.createNote.eighth}
                onClick={() => handleNoteTypeChange('eighth', !localSettings.createNote.eighth)}
              />
            </Submenu>
          )}

          {/* Key Signature Submenu */}
          {currentMenu === 'keySignature' && (
            <Submenu
              title="Key Signature"
              onBack={navigateBack}
            >
              {KEY_SIGNATURES.map(key => (
                <SubmenuOption
                  key={key}
                  label={key}
                  isSelected={localSettings.keySignature === key}
                  onClick={() => handleChange('keySignature', key)}
                />
              ))}
            </Submenu>
          )}

          {/* Measures Submenu */}
          {currentMenu === 'measures' && (
            <Submenu
              title="Number of Measures"
              onBack={navigateBack}
            >
              {[4, 8, 12, 16, 20, 24, 28, 32].map(num => (
                <SubmenuOption
                  key={num}
                  label={`${num} measures`}
                  isSelected={localSettings.measures === num}
                  onClick={() => handleChange('measures', num)}
                />
              ))}
            </Submenu>
          )}
        </div>
      </div>
    </>
  );
}
