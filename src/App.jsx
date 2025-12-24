import { useEffect, useState, useRef } from 'react'
import './App.css'

import abcjs from "abcjs";

import generateAbc from './musicGenerator';

function App() {
  const [abcNotation, setAbcNotation] = useState(generateAbc());
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
      <h1>Sight Reading Trainer</h1>
      <div ref={sheetMusicRenderRef}></div>
      <button className="button" onClick={() => setAbcNotation(generateAbc())}>Generate New Exercise</button>
    </>
  )
}

export default App;
