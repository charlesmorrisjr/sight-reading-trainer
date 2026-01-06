import { useState, useEffect, useRef, useCallback } from 'react'

import abcjs from "abcjs";

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
      minSpacing: 1.8, 
      maxSpacing: 2.7,
      preferredMeasuresPerLine: 4 
    }
  });

  const calculateResponsiveOptions = useCallback(() => {
    // Get window width
    const windowWidth = window.innerWidth;
    const maxContentWidth = 1280;

    // Calculate available width accounting for #root's max-width and padding
    const availableWidth = Math.min(windowWidth, maxContentWidth);

    // Calculate staffwidth with additional safety margin (20px each side)
    const calculatedStaffwidth = Math.max(280, availableWidth - 40);
    
    // Default measures per line is 4 for large displays
    let measuresPerLine = 4;
    
    // Determine how many measures to render per line based on window/screen size
    if (availableWidth < 400) {
      measuresPerLine = 1; // Very small
    } else if (availableWidth < 640) {
      measuresPerLine = 2; // Small
    } else if (availableWidth < 1024) {
      measuresPerLine = 3; // Medium
    }

    // Debug
    // console.log('Available width:', availableWidth, 'Staff width:', calculatedStaffwidth, 'Measures per line:', measuresPerLine);
        
    setRenderOptions({
      staffwidth: calculatedStaffwidth,
      wrap: {
        minSpacing: 1.8,
        maxSpacing: 2.7,
        preferredMeasuresPerLine: measuresPerLine
      }
    });
  }, []);

  // Set up debouncing function with delay
  const debouncedResize = useDebounce(calculateResponsiveOptions, 150);

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
    <>
      <div ref={sheetMusicRenderRef}></div>
    </>
  )
}
