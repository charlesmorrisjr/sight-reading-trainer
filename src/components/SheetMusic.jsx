import { useEffect, useRef } from 'react'

import abcjs from "abcjs";

// Render sheet music
export default function SheetMusic({ abcNotation }) {
  const sheetMusicRenderRef = useRef(null);
    
  // Update the rendered sheet music every time the ABC notation changes
  useEffect(() => {
    // Guard clause in case sheetMusicRenderRef is not defined
    if (!sheetMusicRenderRef.current) return;

    abcjs.renderAbc(sheetMusicRenderRef.current, abcNotation);
    
    console.log(abcNotation); // Debug
  }, [abcNotation]);

  return (
    <>
      <div ref={sheetMusicRenderRef}></div>
    </>
  )
}
