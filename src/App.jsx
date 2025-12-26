import { useState } from 'react'
import './App.css'

import generateAbc from './musicGenerator';
import SheetMusic from './components/SheetMusic';

function App() {
  const [abcNotation, setAbcNotation] = useState(generateAbc());

  return (
    <>
      <h1>Sight Reading Trainer</h1>
      <SheetMusic abcNotation={abcNotation} />
      <button className="button" onClick={() => setAbcNotation(generateAbc())}>Generate New Exercise</button>
    </>
  )
}

export default App;
