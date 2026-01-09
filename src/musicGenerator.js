import pianoNoteToAbc from './data/pianoNoteToAbc.json';

// TODO: Write pseudocode and explanation of how music generator works for future reference!

function convertStringNoteLengthToBeat(stringNoteLength) {
  // Convert ABC note length string notation to a number.
  // This is used for calculating the number of beats remaining when generating a measure.

  if (stringNoteLength === "8") return 8;
  if (stringNoteLength === "4") return 4;
  if (stringNoteLength === "2") return 2;
  if (stringNoteLength === "") return 1;
}

function generateAvailableNoteLengths(maxLength, settings) {
  // Generate all possible note lengths that can be inserted at the current beat based on the
  // maximum number of beats still available in the measure

  let availableNoteLengths = [];

  if (settings.createNote.whole === true && maxLength >= 8) availableNoteLengths.push("8");
  if (settings.createNote.half === true && maxLength >= 4) availableNoteLengths.push("4");
  if (settings.createNote.quarter === true && maxLength >= 2) availableNoteLengths.push("2");
  if (settings.createNote.eighth === true && maxLength >= 1) availableNoteLengths.push("");

  return availableNoteLengths;
}

function getNoteIndex(noteName) {
  // Get index of note in pianoNoteToAbc lookup table
  return pianoNoteToAbc.findIndex(note => note.name === noteName);
}

function determineBeatsPerMeasure(settings) {
  // Convert time signature to determine number of beats per measure (eighth note is 1 beat)
  return parseInt(settings.timeSignature.split("/")[0]) * 2;
}

function generateRandomNote(noteLengthOptions, noteRange, settings) {
  // Select random note
  let randomNoteIndex = Math.floor(Math.random() * noteRange) + getNoteIndex(settings.minRange);

  // Select note length
  let newNoteLength = noteLengthOptions[Math.floor(Math.random() * noteLengthOptions.length)];

  return [pianoNoteToAbc[randomNoteIndex].abc + newNoteLength, newNoteLength];
}

function generateAbc(settings) {
  // Generate a new ABC notation for the sheet music

  // Length of note when generating (whole, half, etc.)
  let noteLengthSettings = [];

  // Determine range between min and max notes
  let noteRange = getNoteIndex(settings.maxRange) - getNoteIndex(settings.minRange) + 1;

  // Note length is based on settings
  if (settings.createNote.whole) noteLengthSettings.push("8");
  if (settings.createNote.half) noteLengthSettings.push("4");
  if (settings.createNote.quarter) noteLengthSettings.push("2");
  if (settings.createNote.eighth) noteLengthSettings.push("");

  // If no note length is selected, default to quarter notes
  if (noteLengthSettings.length === 0) noteLengthSettings.push("2");

  // Get notes per measure and total notes in music
  let beatsPerMeasure = determineBeatsPerMeasure(settings);
  let totalBeats = beatsPerMeasure * settings.measures;
  // Get total beats in music
  // Add notes of varying beats until beats are complete

  // Generate random note
  // If total remaining length is less than random note length, set last note beat length to total and exit loop
  // Subtract note beat length from total
  
  // Set staff designation, key signature, and time signature
  let newAbcNotation = `X:1\nK:${settings.keySignature}\n`;
  newAbcNotation += `M:${settings.timeSignature}\n`;

  // Directive to assign treble and bass clefs/voices
  newAbcNotation += "%%score { 1 | 2 }\nV:1 clef=treble\nV:2 clef=bass\n";

  // Voice 1 (treble)
  newAbcNotation += "[V:1] ";

  // Generate notes to fill each measure
  for (let i = 0; i < settings.measures; i++) {
    let remainingBeatsInCurrentMeasure = beatsPerMeasure;
    
    // For each measure, fill with notes to use all required beats per measure
    while (remainingBeatsInCurrentMeasure > 0) {
      // Every iteration before a note is inserted, create an array containing the available
      // note lengths we can use
      let noteLengthOptions = [];

      // If the numerator of the time signature contains 8 eighth notes
      if (beatsPerMeasure === 8) {
        // Check the number of remaining beats for the current measure and generate
        // the possible note lengths we can insert at the current beat
        if (remainingBeatsInCurrentMeasure === 8) {
          noteLengthOptions = generateAvailableNoteLengths(8, settings);
        } else if (remainingBeatsInCurrentMeasure >= 4 && remainingBeatsInCurrentMeasure <= 7) {
          noteLengthOptions = generateAvailableNoteLengths(4, settings);
        } else if (remainingBeatsInCurrentMeasure >= 2 && remainingBeatsInCurrentMeasure <= 3) {
          noteLengthOptions = generateAvailableNoteLengths(2, settings);
        } else if (remainingBeatsInCurrentMeasure === 1) {
          noteLengthOptions = generateAvailableNoteLengths(1, settings);
        }
      // Future beatsPerMeasure settings will be implemented later
      } else {
        return;
      }

      // Generate a random note at the current beat and retrieve the note and its length
      let [newNote, newNoteLength] = generateRandomNote(noteLengthOptions, noteRange, settings);
      
      // Update the remaining beats in the current measure
      remainingBeatsInCurrentMeasure -= convertStringNoteLengthToBeat(newNoteLength);
      
      // Debug
      // console.log(newNote, newNoteLength, remainingBeatsInCurrentMeasure);

      // Add the new note to the ABC notation
      newAbcNotation += newNote + " ";
    }
    
    newAbcNotation += "|";  // Add measure bar
  }

  newAbcNotation += "|\n";  // Add ending bar

  // Voice 2 (bass)
  newAbcNotation += "[V:2] ";

  // Generate notes to fill each measure
  for (let i = 0; i < settings.measures; i++) {
    // Insert C major block chords for now.
    // This will be chord progressions in the future.
    newAbcNotation += "[C,8 E,8 G,8]";

    newAbcNotation += "|";  // Add measure bar
  }

  newAbcNotation += "|\n";  // Add ending bar

  return newAbcNotation;
}

export default generateAbc;