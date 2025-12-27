import pianoNoteToAbc from './data/pianoNoteToAbc.json';

const sheetMusicSettings = {
  measures: 4,
  keySignature: "C",
  timeSignature: "4/4",
  minRange: "C4",
  maxRange: "F5",
}

function getNoteIndex(noteName) {
  // Get index of note in pianoNoteToAbc lookup table
  return pianoNoteToAbc.findIndex(note => note.name === noteName);
}

function determineNotesPerMeasure() {
  // Convert time signature to determine number of notes per measure
  return parseInt(sheetMusicSettings.timeSignature.split("/")[0]);
}

function generateRandomNote() {
  // Determine range between min and max notes
  let noteRange = getNoteIndex(sheetMusicSettings.maxRange) - getNoteIndex(sheetMusicSettings.minRange) + 1;
  
  // Select random note
  let randomNoteIndex = Math.floor(Math.random() * noteRange) + getNoteIndex(sheetMusicSettings.minRange);

  return pianoNoteToAbc[randomNoteIndex].abc;
}

function generateAbc() {
  // Generate a new ABC notation for the sheet music
  
  // Get notes per measure and total notes in music
  let notesPerMeasure = determineNotesPerMeasure();
  let totalNotes = notesPerMeasure * sheetMusicSettings.measures;
  
  // Set staff designation, key signature, and time signature
  let newAbcNotation = `X:1\nK:${sheetMusicSettings.keySignature}\n`;
  newAbcNotation += `M:${sheetMusicSettings.timeSignature}\n`;

  // Directive to assign treble and bass clefs/voices
  newAbcNotation += "%%score { 1 | 2 }\nV:1 clef=treble\nV:2 clef=bass\n";
  
  // Voice 1 (treble)
  newAbcNotation += "[V:1] ";
  
  for (let i = 0; i < totalNotes; i++) {
    // Add a measure bar every [notesPerMeasure] notes
    if (i > 0 && i % notesPerMeasure === 0) newAbcNotation += "|"; 

    newAbcNotation += generateRandomNote();
  }

  newAbcNotation += "|\n";  // Add ending bar

  // Voice 2 (bass)
  newAbcNotation += "[V:2] ";
  
  for (let i = 0; i < totalNotes; i++) {
    // Add a measure bar every [notesPerMeasure] notes
    if (i > 0 && i % notesPerMeasure === 0) newAbcNotation += "|"; 

    newAbcNotation += generateRandomNote() + ',';
  }

  newAbcNotation += "|\n";  // Add ending bar

  return newAbcNotation;
}

export default generateAbc;