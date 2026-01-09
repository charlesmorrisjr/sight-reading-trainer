import { useState, useEffect } from 'react'
import './App.css'

import generateAbc from './musicGenerator';

import SheetMusic from './components/SheetMusic';
import HamburgerButton from './components/HamburgerButton';
import SettingsDrawer from './components/SettingsDrawer';

function App() {
  // Settings state with localStorage initialization
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('sheetMusicSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        // Validate that all required keys exist
        if (parsed.measures && parsed.keySignature && parsed.createNote) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }

    // Return default settings if loading failed or data invalid
    return {
      measures: 16,
      keySignature: "C",
      timeSignature: "4/4",
      minRange: "C4",
      maxRange: "F5",
      createNote: {
        whole: true,
        half: true,
        quarter: true,
        eighth: true,
      }
    };
  });

  // Drawer open/close state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // ABC notation state
  const [abcNotation, setAbcNotation] = useState(() => generateAbc(settings));

  // Save settings to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('sheetMusicSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  // Auto-regenerate sheet music when settings change
  useEffect(() => {
    setAbcNotation(generateAbc(settings));
  }, [settings]);

  // Handler functions
  const handleToggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const handleCloseDrawer = () => setIsDrawerOpen(false);
  const handleSettingsChange = (newSettings) => setSettings(newSettings);
  const handleGenerateNew = () => setAbcNotation(generateAbc(settings));

  return (
    <>
      <div className='header-menu'>
        <HamburgerButton
          isOpen={isDrawerOpen}
          onToggle={handleToggleDrawer}
        />
      </div>

      <h1>Sight Reading Trainer</h1>
      <SheetMusic abcNotation={abcNotation} />
      <button className="button" onClick={handleGenerateNew}>
        Generate New Exercise
      </button>

      <SettingsDrawer
        isOpen={isDrawerOpen}
        settings={settings}
        onClose={handleCloseDrawer}
        onSettingsChange={handleSettingsChange}
      />
    </>
  )
}

export default App;
