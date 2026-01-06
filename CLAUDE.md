# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A sight reading trainer for pianists built with React + Vite. Users generate randomized sheet music exercises of varying difficulty to practice sight reading. Uses ABC notation (via abcjs library) to render sheet music on grand staff (treble + bass clef).

## Development Commands

```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

### Music Generation Flow

1. **musicGenerator.js** - Core music generation algorithm
   - Exports `generateAbc()` which returns ABC notation string
   - Settings object (`sheetMusicSettings`) controls all generation parameters
   - Algorithm fills measures beat-by-beat (eighth note = 1 beat) until complete
   - Currently generates treble clef melody + bass clef block chords (C major placeholder)

2. **App.jsx** - Main application component
   - Manages ABC notation state
   - Triggers new exercise generation on button click

3. **SheetMusic.jsx** - Sheet music rendering component
   - Uses abcjs library to render ABC notation to SVG
   - Responsive rendering with wrapping configured (4 measures per line preferred)

### Key Concepts

**ABC Notation**: Text-based music notation format. Example:
```
X:1
K:C
M:4/4
%%score { 1 | 2 }
V:1 clef=treble
V:2 clef=bass
[V:1] C4 E4 G4 c4 ||
[V:2] [C,8 E,8 G,8]||
```

**Beat Calculation**: Time signature 4/4 = 8 beats per measure (eighth note basis)
- Whole note = 8 beats (ABC: "8")
- Half note = 4 beats (ABC: "4")
- Quarter note = 2 beats (ABC: "2")
- Eighth note = 1 beat (ABC: "")

**Note Lookup Tables**:
- `pianoNoteToAbc.json` - Maps scientific pitch notation (C4, D5) to ABC notation (C, d)
- `pianoNoteToAbc_88.json` - Full 88-key piano with sharps/flats (future use)

### Current Limitations

- Only supports 4/4 time signature (beatsPerMeasure === 8)
- Bass clef generates placeholder C major block chords only
- No accidentals (sharps/flats) in melody generation yet
- Debug console.logs still present in SheetMusic.jsx and musicGenerator.js

## Portfolio Project Context

This is a junior developer portfolio project intended for production release. Code should be:
- Professional quality suitable for paying customers
- Well-architected and maintainable
- Impressive to interviewers at junior/mid/senior levels

When reviewing code or suggesting improvements, act as a senior developer reviewer focusing on code quality, architecture, and best practices.
