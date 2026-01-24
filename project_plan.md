I want to make my sheet music rendering. Responsive when the user changes the size of the display. Here is the relevant documentation: https://docs.abcjs.net/visual/render-abc-options.html. I already have wrapping working, but I think i need responsiveness as well. What is the best way to achieve this? Walk me through implementing this step by step. I'm thinking using useEffect to detect window size changes. This will allow us to change the staffwidth and the preferred measures per line.

# Settings
- Key Signatures
- Time Signatures
  - 4/4
  - 3/4
  - 2/4
  - 5/4
  - 6/4
  - 3/8
  - 6/8
  - 12/8
  - 2/2
  - 3/2
  - 4/2
- Note Durations (multiple can be selected)
- Intervals
  - 2nd
  - 3rd
  - 4th
  - 5th
  - 6th
  - 7th
  - 8th
  - 9th
  - 10th
- Chord Progressions
- Left Hand Patterns
  - Single Notes
  - Octaves
  - Block Chords
  - Alberti Bass
  - Broken Chords
  - Arpeggios (1-3-5-8-5-3-1)
    (Note: This is only for 4/4 time signature)
  - Arpeggios (1-3-5-3-1)
    (Note: This is only for 3/4 time signature)
- Right Hand Patterns
  - Single Notes
  - Octaves
  - Block Chords
- Number of Measures
  - 4
  - 8
  - 12
  - 16
  - 20
  - 24
- Swap Hand Patterns (Toggle to swap left and right hand patterns)

- Zoom Level
  (Plus and minus buttons to adjust zoom level of the sheet music rendering between 100% and 150%)


## Header Bar
- Application Logo and Title that redirects to the home page
- Tempo selector BPM
  - Open a modal to set the tempo in BPM
- Metronome Toggle
- Dark Mode Toggle
- Play/Pause Button for audio playback of the sheet music


## Patterns
- Patterns for left and right hands that can be blocked together or practice individually
  - Take popular patterns from piano music, including rhythms. These can be developed into exercises
-