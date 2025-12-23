import { useState } from 'react'
import './App.css'

import abcjs from "abcjs";

function App() {
  abcjs.renderAbc("paper", "X:1\nK:D\nDD AA|BBA2|\n");

  return (
    <>
      <h1>Sight Reading Trainer</h1>
      <div id="paper"></div>
    </>
  )
}

export default App
