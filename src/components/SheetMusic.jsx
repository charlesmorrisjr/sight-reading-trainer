import { useState, useEffect, useRef, useCallback } from 'react'

import abcjs from "abcjs";

// Responsive breakpoints for measures per line
const BREAKPOINTS = {
  VERY_SMALL: 500,
  SMALL: 750,
  MEDIUM: 1024,
};

// Measures per line at different screen sizes
const MEASURES_PER_LINE = {
  VERY_SMALL: 1,
  SMALL: 2,
  MEDIUM: 3,
  LARGE: 4,
};

// Layout constants
const LAYOUT = {
  MAX_CONTENT_WIDTH: 1280, // Matches #root max-width from App.css
  MIN_STAFF_WIDTH: 280,    // Minimum width for readable music notation
  STAFF_MARGIN: 140,       // Safety margin each side of sheet music
  DEBOUNCE_DELAY: 150,     // Milliseconds to wait after resize stops
};

// Music rendering options
const MUSIC_SPACING = {
  MIN: 1.8,
  MAX: 2.7,
};

// Debounce function for window/screen resize
function useDebounce(callback, delay) {
  // Use ref instead of state so rerender is not triggered
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    // If window is resized during countdown, stop current timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start timeout countdown after window is resized
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

// Render sheet music
export default function SheetMusic({ abcNotation }) {  
  const sheetMusicRenderRef = useRef(null);
  const [renderOptions, setRenderOptions] = useState({
    staffwidth: 740,
    wrap: {
      minSpacing: MUSIC_SPACING.MIN,
      maxSpacing: MUSIC_SPACING.MAX,
      preferredMeasuresPerLine: MEASURES_PER_LINE.LARGE
    }
  });

  const calculateResponsiveOptions = useCallback(() => {
    const windowWidth = window.innerWidth;

    // Calculate available width accounting for #root's max-width constraint
    const availableWidth = Math.min(windowWidth, LAYOUT.MAX_CONTENT_WIDTH);

    // Calculate staffwidth with safety margin to prevent music from touching edges
    const calculatedStaffwidth = Math.max(
      LAYOUT.MIN_STAFF_WIDTH,
      availableWidth - LAYOUT.STAFF_MARGIN
    );

    // Determine measures per line based on available width
    let measuresPerLine = MEASURES_PER_LINE.LARGE;

    if (availableWidth < BREAKPOINTS.VERY_SMALL) {
      measuresPerLine = MEASURES_PER_LINE.VERY_SMALL;
    } else if (availableWidth < BREAKPOINTS.SMALL) {
      measuresPerLine = MEASURES_PER_LINE.SMALL;
    } else if (availableWidth < BREAKPOINTS.MEDIUM) {
      measuresPerLine = MEASURES_PER_LINE.MEDIUM;
    }

    setRenderOptions({
      staffwidth: calculatedStaffwidth,
      wrap: {
        minSpacing: MUSIC_SPACING.MIN,
        maxSpacing: MUSIC_SPACING.MAX,
        preferredMeasuresPerLine: measuresPerLine
      }
    });
  }, []);

  // Set up debouncing function with delay
  const debouncedResize = useDebounce(calculateResponsiveOptions, LAYOUT.DEBOUNCE_DELAY);

  // Determine sheet music render options when window size is changed
  useEffect(() => {
    // Calculate initial values on mount
    calculateResponsiveOptions();

    // Add resize listener
    window.addEventListener('resize', debouncedResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [calculateResponsiveOptions, debouncedResize]);

  // Update the rendered sheet music every time the ABC notation changes
  // or the window size is changed
  useEffect(() => {
    // Guard clause in case sheetMusicRenderRef is not defined
    if (!sheetMusicRenderRef.current) return;

    abcjs.renderAbc(sheetMusicRenderRef.current, abcNotation, renderOptions);

    // console.log(abcNotation); // Debug
  }, [abcNotation, renderOptions]);

  return (
    <div ref={sheetMusicRenderRef}/>
  )
}
