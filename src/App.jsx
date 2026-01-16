import { useState, useEffect } from 'react'

import generateAbc from './musicGenerator';

import SheetMusic from './components/SheetMusic';
import Header from './components/Header';
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
      {/* Header component - sticky at top */}
      <Header
        isDrawerOpen={isDrawerOpen}
        onToggle={handleToggleDrawer}
      />

      {/* Main content container */}
      <div className="w-full max-w-container mx-auto px-8 py-12 text-center">
        <h1>Sight Reading Trainer</h1>

        {/* Sheet music display */}
        <div className="mt-12 mb-24">
          <SheetMusic abcNotation={abcNotation} />
        </div>

        {/* Generate button */}
        <button
          className="btn btn-primary shadow-lg hover:shadow-xl transition-shadow duration-200"
          onClick={handleGenerateNew}
        >
          Generate New Exercise
        </button>
      </div>

      {/* Settings drawer */}
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
