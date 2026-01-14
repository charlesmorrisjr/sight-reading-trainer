import { useState, useEffect, useRef } from 'react';
import pianoNoteData from '../data/pianoNoteToAbc.json';
import './SettingsDrawer.css';

const KEY_SIGNATURES = [
  'C', 'G', 'D', 'A', 'E', 'B',
  'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'
];

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
    <div
      className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <div
        ref={drawerRef}
        className={`drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
      >
        <div className="drawer-header">
          <h2>Settings</h2>
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </div>

        <div className="drawer-content">
          {/* Main Menu */}
          {currentMenu === 'main' && (
            <div className="menu-list">
              <button className="menu-button" onClick={() => navigateToSubmenu('minNote')}>
                <span className="menu-label">Minimum Note</span>
                <span className="menu-chevron">›</span>
              </button>

              <button className="menu-button" onClick={() => navigateToSubmenu('maxNote')}>
                <span className="menu-label">Maximum Note</span>
                <span className="menu-chevron">›</span>
              </button>

              <button className="menu-button" onClick={() => navigateToSubmenu('noteDurations')}>
                <span className="menu-label">Note Durations</span>
                <span className="menu-chevron">›</span>
              </button>

              <button className="menu-button" onClick={() => navigateToSubmenu('keySignature')}>
                <span className="menu-label">Key Signature</span>
                <span className="menu-chevron">›</span>
              </button>

              <button className="menu-button" onClick={() => navigateToSubmenu('measures')}>
                <span className="menu-label">Number of Measures</span>
                <span className="menu-chevron">›</span>
              </button>
            </div>
          )}

          {/* Min Note Submenu */}
          {currentMenu === 'minNote' && (
            <div className="submenu">
              <div className="submenu-header">
                <button className="back-button" onClick={navigateBack}>
                  ‹ Back
                </button>
              </div>
              <div className="submenu-content">
                {pianoNoteData.map(note => (
                  <button
                    key={note.name}
                    className={`submenu-option ${localSettings.minRange === note.name ? 'selected' : ''}`}
                    onClick={() => {
                      handleChange('minRange', note.name);
                    }}
                  >
                    {note.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Max Note Submenu */}
          {currentMenu === 'maxNote' && (
            <div className="submenu">
              <div className="submenu-header">
                <button className="back-button" onClick={navigateBack}>
                  ‹ Back
                </button>
              </div>
              <div className="submenu-content">
                {pianoNoteData.map(note => (
                  <button
                    key={note.name}
                    className={`submenu-option ${localSettings.maxRange === note.name ? 'selected' : ''}`}
                    onClick={() => {
                      handleChange('maxRange', note.name);
                    }}
                  >
                    {note.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note Durations Submenu */}
          {currentMenu === 'noteDurations' && (
            <div className="submenu">
              <div className="submenu-header">
                <button className="back-button" onClick={navigateBack}>
                  ‹ Back
                </button>
              </div>
              <div className="submenu-content">
                <button
                  className={`submenu-option toggle ${localSettings.createNote.whole ? 'active' : ''}`}
                  onClick={() => handleNoteTypeChange('whole', !localSettings.createNote.whole)}
                >
                  <span>Whole notes</span>
                  {localSettings.createNote.whole && <span className="checkmark">✓</span>}
                </button>

                <button
                  className={`submenu-option toggle ${localSettings.createNote.half ? 'active' : ''}`}
                  onClick={() => handleNoteTypeChange('half', !localSettings.createNote.half)}
                >
                  <span>Half notes</span>
                  {localSettings.createNote.half && <span className="checkmark">✓</span>}
                </button>

                <button
                  className={`submenu-option toggle ${localSettings.createNote.quarter ? 'active' : ''}`}
                  onClick={() => handleNoteTypeChange('quarter', !localSettings.createNote.quarter)}
                >
                  <span>Quarter notes</span>
                  {localSettings.createNote.quarter && <span className="checkmark">✓</span>}
                </button>

                <button
                  className={`submenu-option toggle ${localSettings.createNote.eighth ? 'active' : ''}`}
                  onClick={() => handleNoteTypeChange('eighth', !localSettings.createNote.eighth)}
                >
                  <span>Eighth notes</span>
                  {localSettings.createNote.eighth && <span className="checkmark">✓</span>}
                </button>
              </div>
            </div>
          )}

          {/* Key Signature Submenu */}
          {currentMenu === 'keySignature' && (
            <div className="submenu">
              <div className="submenu-header">
                <button className="back-button" onClick={navigateBack}>
                  ‹ Back
                </button>
              </div>
              <div className="submenu-content">
                {KEY_SIGNATURES.map(key => (
                  <button
                    key={key}
                    className={`submenu-option ${localSettings.keySignature === key ? 'selected' : ''}`}
                    onClick={() => {
                      handleChange('keySignature', key);
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Measures Submenu */}
          {currentMenu === 'measures' && (
            <div className="submenu">
              <div className="submenu-header">
                <button className="back-button" onClick={navigateBack}>
                  ‹ Back
                </button>
              </div>
              <div className="submenu-content">
                {[4, 8, 12, 16, 20, 24, 28, 32].map(num => (
                  <button
                    key={num}
                    className={`submenu-option ${localSettings.measures === num ? 'selected' : ''}`}
                    onClick={() => {
                      handleChange('measures', num);
                    }}
                  >
                    {num} measures
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
