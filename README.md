# Timeline Music Game

A multiplayer party game inspired by *Hitster*, where teams compete to identify songs and place them in chronological order on a timeline.

## Features

- **Multiple Teams**: Support for 1-9 teams with customizable names
- **Turn-based Gameplay**: Teams take turns guessing songs
- **Timeline Mechanics**: Build your timeline by correctly placing songs chronologically
- **Configurable Goals**: Set custom timeline goals for shorter or longer games
- **Modern UI**: Beautiful, party-friendly interface with large buttons and clear visuals

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Lucide React (icons)

### Backend
- Node.js + TypeScript
- Express.js
- RESTful API

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The API will be available at `http://localhost:3001`

2. **Start the frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

## How to Play

1. **Setup**: Create a new game by selecting the number of teams and setting team names
2. **Set Goal**: Choose how many songs a team needs to complete their timeline to win
3. **Take Turns**: 
   - Press "Play Song" to hear a random song
   - Team discusses and guesses the song title and artist
   - Press "Reveal Song" to see the answer
   - Mark whether the guess was correct or incorrect
4. **Build Timeline**: 
   - If correct, place the song in your timeline in chronological order
   - The song must be placed in the correct year position
5. **Win**: First team to reach the timeline goal wins!

## Game Rules

- Each team starts with a random starting year
- Songs must be placed in chronological order (by release year)
- Incorrect guesses end the turn immediately
- Incorrect timeline placements discard the song
- First team to reach the goal wins

## Project Structure

```
hitster/
├── backend/
│   ├── src/
│   │   ├── index.ts        # Express server & API routes
│   │   ├── types.ts        # TypeScript interfaces
│   │   └── songPool.ts     # Curated song database
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameSetup.tsx
│   │   │   ├── GamePlay.tsx
│   │   │   ├── Timeline.tsx
│   │   │   └── WinnerScreen.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── types.ts
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Future Enhancements

- Spotify integration for actual music playback
- Difficulty modes (decade-specific games)
- Online multiplayer
- Leaderboards
- Custom playlist support

## License

MIT
