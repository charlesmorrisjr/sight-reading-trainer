const UPPERCASE_ASCII_START = 65;

const sheetMusicSettings = {
  measures: 4,
  keySignature: "C",
  timeSignature: "4/4",
  minRange: "C4",
  maxRange: "G5",
}

function determineNotesPerMeasure() {
  // Convert time signature to determine number of notes per measure
  return parseInt(sheetMusicSettings.timeSignature.split("/")[0]);
}

function generateRandomNote() {
  // Generate a random note from A to G
  let randomNoteIndex = Math.floor(Math.random() * 7);

  return String.fromCharCode(UPPERCASE_ASCII_START + randomNoteIndex);
}

function generateAbc() {
  // Generate a new ABC notation for the sheet music
  
  // Get notes per measure and total notes in music
  let notesPerMeasure = determineNotesPerMeasure();
  let totalNotes = notesPerMeasure * sheetMusicSettings.measures;
  
  // Set staff designation, key signature, and time signature
  let newAbcNotation = `X:1\nK:${sheetMusicSettings.keySignature}\n`;
  newAbcNotation += `M:${sheetMusicSettings.timeSignature}\n`;
  
  for (let i = 0; i < totalNotes; i++) {
    // Add a measure bar every [notesPerMeasure] notes
    if (i > 0 && i % notesPerMeasure === 0) newAbcNotation += "|"; 

    newAbcNotation += generateRandomNote();
  }

  newAbcNotation += "|";  // Add ending bar

  return newAbcNotation;
}

export default generateAbc;