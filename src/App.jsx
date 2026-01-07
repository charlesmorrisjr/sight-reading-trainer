import { useState } from 'react'
import './App.css'

import generateAbc from './musicGenerator';

import SheetMusic from './components/SheetMusic';
import HamburgerButton from './components/HamburgerButton';

function App() {
  const [abcNotation, setAbcNotation] = useState(generateAbc());

  return (
    <>
      <div className='header-menu'>
        <HamburgerButton />
      </div>

      <h1>Sight Reading Trainer</h1>
      <SheetMusic abcNotation={abcNotation} />
      <button className="button" onClick={() => setAbcNotation(generateAbc())}>Generate New Exercise</button>
    </>
  )
}

export default App;
