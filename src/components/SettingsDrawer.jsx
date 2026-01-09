import { useState, useEffect, useRef } from 'react';
import pianoNoteData from '../data/pianoNoteToAbc.json';
import './SettingsDrawer.css';

const KEY_SIGNATURES = [
  'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
  'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'
];

const TIME_SIGNATURES = ['4/4'];

export default function SettingsDrawer({ isOpen, settings, onClose, onSettingsChange }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const drawerRef = useRef(null);

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

  // Handle measures input with validation
  const handleMeasuresChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 32) {
      handleChange('measures', value);
    }
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

  // Focus management - focus first input when drawer opens
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector('select, input, button');
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Generate note options for dropdowns
  const noteOptions = pianoNoteData.map((note, index) => (
    <option key={index} value={note.name}>
      {note.name}
    </option>
  ));

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
          <section className="settings-section">
            <h3>Note Range</h3>
            <div className="form-group">
              <label htmlFor="minRange">Minimum Note</label>
              <select
                id="minRange"
                value={localSettings.minRange}
                onChange={(e) => handleChange('minRange', e.target.value)}
                aria-label="Minimum note range"
              >
                {noteOptions}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="maxRange">Maximum Note</label>
              <select
                id="maxRange"
                value={localSettings.maxRange}
                onChange={(e) => handleChange('maxRange', e.target.value)}
                aria-label="Maximum note range"
              >
                {noteOptions}
              </select>
            </div>
          </section>

          <section className="settings-section">
            <h3>Rhythm</h3>
            <fieldset className="checkbox-group">
              <legend>Note Types</legend>

              <label>
                <input
                  type="checkbox"
                  checked={localSettings.createNote.whole}
                  onChange={(e) => handleNoteTypeChange('whole', e.target.checked)}
                />
                <span>Whole notes</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={localSettings.createNote.half}
                  onChange={(e) => handleNoteTypeChange('half', e.target.checked)}
                />
                <span>Half notes</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={localSettings.createNote.quarter}
                  onChange={(e) => handleNoteTypeChange('quarter', e.target.checked)}
                />
                <span>Quarter notes</span>
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={localSettings.createNote.eighth}
                  onChange={(e) => handleNoteTypeChange('eighth', e.target.checked)}
                />
                <span>Eighth notes</span>
              </label>
            </fieldset>
          </section>

          <section className="settings-section">
            <h3>Exercise Settings</h3>
            <div className="form-group">
              <label htmlFor="measures">Number of Measures</label>
              <input
                id="measures"
                type="number"
                min="1"
                max="32"
                value={localSettings.measures}
                onChange={handleMeasuresChange}
                aria-label="Number of measures"
              />
            </div>
          </section>

          <section className="settings-section">
            <h3>Key & Time</h3>
            <div className="form-group">
              <label htmlFor="keySignature">Key Signature</label>
              <select
                id="keySignature"
                value={localSettings.keySignature}
                onChange={(e) => handleChange('keySignature', e.target.value)}
                aria-label="Key signature"
              >
                {KEY_SIGNATURES.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="timeSignature">Time Signature</label>
              <select
                id="timeSignature"
                value={localSettings.timeSignature}
                onChange={(e) => handleChange('timeSignature', e.target.value)}
                disabled
                aria-label="Time signature"
              >
                {TIME_SIGNATURES.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <p className="helper-text">Currently only 4/4 time signature is supported</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
