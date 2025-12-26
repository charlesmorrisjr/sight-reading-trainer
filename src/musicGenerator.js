const UPPERCASE_ASCII_START = 65;

const sheetMusicSettings = {
  measures: 4,
  keySignature: "C",
  timeSignature: "4/4",
  minRange: "C4",
  maxRange: "G5",
}

function generateRandomNote() {
  // Generate a random note from A to G
  
  let randomNoteIndex = Math.floor(Math.random() * 7);

  return String.fromCharCode(UPPERCASE_ASCII_START + randomNoteIndex);
}

function generateAbc() {
  // Generate a new ABC notation for the sheet music
  
  // Set staff designation and key
  let newAbcNotation = `X:1\nK:${sheetMusicSettings.keySignature}\n`;
  
  for (let i = 0; i < 12; i++) {
    // Add a measure bar every 4 notes
    if (i > 0 && i % 4 === 0) newAbcNotation += "|"; 

    newAbcNotation += generateRandomNote();
  }

  newAbcNotation += "|";  // Add ending bar

  return newAbcNotation;
}

export default generateAbc;