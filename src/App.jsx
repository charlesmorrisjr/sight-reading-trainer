import { useEffect, useState } from 'react'
import './App.css'

import abcjs from "abcjs";

const UPPERCASE_ASCII_START = 65;
const ABC_NOTATION_TEMPLATE = "X:1\nK:D\nDD AA|BBA2|\n";

function App() {
  const [abcNotation, setAbcNotation] = useState(ABC_NOTATION_TEMPLATE);
  
  function generateRandomNote() {
    // Generate a random note from A to G
    
    let randomNoteIndex = Math.floor(Math.random() * 7);

    return String.fromCharCode(UPPERCASE_ASCII_START + randomNoteIndex);
  }
  
  function generateAbc() {
    // Generate a new ABC notation for the sheet music
    
    // Set staff designation and key
    let newAbcNotation = "X:1\nK:D\n";
    
    for (let i = 0; i < 12; i++) {
      // Add a measure bar every 4 notes
      if (i > 0 && i % 4 === 0) newAbcNotation += "|"; 

      newAbcNotation += generateRandomNote();
    }
    
    setAbcNotation(newAbcNotation);
    
    console.log(abcNotation); // Debug
  }
  
  // Update the rendered sheet music every time the ABC notation changes
  useEffect(() => {
    abcjs.renderAbc("paper", abcNotation);
  }, [abcNotation]);

  return (
    <>
      <h1>Sight Reading Trainer</h1>
      <div id="paper"></div>
      <button className="button" onClick={generateAbc}>Generate New Exercise</button>
    </>
  )
}

export default App;
