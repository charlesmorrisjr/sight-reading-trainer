const UPPERCASE_ASCII_START = 65;

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

  newAbcNotation += "|";  // Add ending bar

  return newAbcNotation;
}

export default generateAbc;