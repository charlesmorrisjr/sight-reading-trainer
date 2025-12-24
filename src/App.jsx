import { useEffect, useState, useRef } from 'react'
import './App.css'

import abcjs from "abcjs";

import generateAbc from './musicGenerator';

const ABC_NOTATION_TEMPLATE = "X:1\nK:D\nDD AA|BBA2|\n";

function App() {
  const [abcNotation, setAbcNotation] = useState(ABC_NOTATION_TEMPLATE);
  const sheetMusicRenderRef = useRef(null);
    
  // Update the rendered sheet music every time the ABC notation changes
  useEffect(() => {
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
