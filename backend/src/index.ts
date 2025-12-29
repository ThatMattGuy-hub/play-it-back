import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Song, Team, Game, GameState } from './types';
import { songPool as defaultSongPool } from './songPool';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Custom song pool (can be updated via API)
let customSongPool: Song[] = [];

// In-memory game state (single game for V1)
let gameState: GameState = {
  game: null,
  currentSong: null,
  songRevealed: false,
};

// Helper functions
function generateGameId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function getRandomYear(): number {
  const decades = [1960, 1970, 1980, 1990, 2000, 2010];
  const decade = decades[Math.floor(Math.random() * decades.length)];
  return decade + Math.floor(Math.random() * 10);
}

function getActiveSongPool(): Song[] {
  return customSongPool.length > 0 ? customSongPool : defaultSongPool;
}

function getRandomSong(usedIds: Set<string>): Song | null {
  const pool = getActiveSongPool();
  const availableSongs = pool.filter((song: Song) => !usedIds.has(song.id));
  if (availableSongs.length === 0) return null;
  return availableSongs[Math.floor(Math.random() * availableSongs.length)];
}

// API Routes

// Create a new game
app.post('/api/game/create', (req, res) => {
  const { teamCount, timelineGoal, teamNames } = req.body;
  
  if (!teamCount || teamCount < 1 || teamCount > 9) {
    return res.status(400).json({ error: 'Team count must be between 1 and 9' });
  }

  const teams: Team[] = [];
  for (let i = 0; i < teamCount; i++) {
    teams.push({
      id: i + 1,
      name: teamNames?.[i] || `Team ${i + 1}`,
      startingYear: getRandomYear(),
      timeline: [],
      score: 0,
    });
  }

  const game: Game = {
    id: generateGameId(),
    teams,
    currentTeamIndex: 0,
    timelineGoal: timelineGoal || 10,
    usedSongIds: new Set(),
    status: 'playing',
    winnerId: null,
  };

  gameState = {
    game,
    currentSong: null,
    songRevealed: false,
  };

  res.json({ 
    game: {
      ...game,
      usedSongIds: Array.from(game.usedSongIds),
    }
  });
});

// Get current game state
app.get('/api/game', (req, res) => {
  if (!gameState.game) {
    return res.status(404).json({ error: 'No active game' });
  }
  
  res.json({
    game: {
      ...gameState.game,
      usedSongIds: Array.from(gameState.game.usedSongIds),
    },
    currentSong: gameState.songRevealed ? gameState.currentSong : 
      (gameState.currentSong ? { id: gameState.currentSong.id, spotifyId: gameState.currentSong.spotifyId } : null),
    songRevealed: gameState.songRevealed,
  });
});

// Get a new song for current turn
app.post('/api/game/play-song', (req, res) => {
  if (!gameState.game) {
    return res.status(404).json({ error: 'No active game' });
  }

  const song = getRandomSong(gameState.game.usedSongIds);
  if (!song) {
    return res.status(400).json({ error: 'No more songs available' });
  }

  gameState.game.usedSongIds.add(song.id);
  gameState.currentSong = song;
  gameState.songRevealed = false;

  // Return only spotifyId for playback, hide metadata
  res.json({ 
    spotifyId: song.spotifyId,
    songId: song.id,
  });
});

// Reveal current song
app.post('/api/game/reveal', (req, res) => {
  if (!gameState.game || !gameState.currentSong) {
    return res.status(400).json({ error: 'No song to reveal' });
  }

  gameState.songRevealed = true;
  res.json({ song: gameState.currentSong });
});

// Mark guess result and handle timeline placement
app.post('/api/game/guess-result', (req, res) => {
  const { correct } = req.body;
  
  if (!gameState.game || !gameState.currentSong) {
    return res.status(400).json({ error: 'No active turn' });
  }

  if (!correct) {
    // Wrong guess - move to next team
    gameState.game.currentTeamIndex = 
      (gameState.game.currentTeamIndex + 1) % gameState.game.teams.length;
    gameState.currentSong = null;
    gameState.songRevealed = false;
    
    return res.json({ 
      message: 'Incorrect guess, next team\'s turn',
      nextTeam: gameState.game.teams[gameState.game.currentTeamIndex],
    });
  }

  // Correct guess - return song for timeline placement
  res.json({ 
    message: 'Correct! Place the song in your timeline',
    song: gameState.currentSong,
  });
});

// Validate timeline placement
app.post('/api/game/check-timeline', (req, res) => {
  const { position } = req.body; // Position where song is placed (0-indexed)
  
  if (!gameState.game || !gameState.currentSong) {
    return res.status(400).json({ error: 'No active turn' });
  }

  const currentTeam = gameState.game.teams[gameState.game.currentTeamIndex];
  const song = gameState.currentSong;
  const timeline = currentTeam.timeline;
  
  // Build the year sequence including starting year
  const years = [currentTeam.startingYear, ...timeline.map(e => e.song.year)];
  
  // Check if placement is valid
  let isValid = true;
  
  if (position === 0) {
    // Placing before starting year
    isValid = song.year <= years[0];
  } else if (position >= years.length) {
    // Placing at the end
    isValid = song.year >= years[years.length - 1];
  } else {
    // Placing in the middle
    isValid = song.year >= years[position - 1] && song.year <= years[position];
  }

  if (isValid) {
    // Add to timeline at correct position
    currentTeam.timeline.splice(position > 0 ? position - 1 : 0, 0, {
      song,
      position,
    });
    currentTeam.score++;

    // Check win condition
    if (currentTeam.score >= gameState.game.timelineGoal) {
      gameState.game.status = 'finished';
      gameState.game.winnerId = currentTeam.id;
      
      return res.json({
        valid: true,
        winner: currentTeam,
        message: `${currentTeam.name} wins!`,
      });
    }
  }

  // Move to next team
  gameState.game.currentTeamIndex = 
    (gameState.game.currentTeamIndex + 1) % gameState.game.teams.length;
  gameState.currentSong = null;
  gameState.songRevealed = false;

  res.json({
    valid: isValid,
    message: isValid ? 'Correct placement!' : 'Wrong position, song discarded',
    song: song, // Include full song data for the result modal
    nextTeam: gameState.game.teams[gameState.game.currentTeamIndex],
    team: currentTeam,
  });
});

// Reset game
app.post('/api/game/reset', (req, res) => {
  gameState = {
    game: null,
    currentSong: null,
    songRevealed: false,
  };
  res.json({ message: 'Game reset' });
});

// Get all available songs
app.get('/api/songs', (req, res) => {
  const pool = getActiveSongPool();
  res.json({ songs: pool, total: pool.length, isCustom: customSongPool.length > 0 });
});

// Update song pool with custom songs
app.post('/api/songs', (req, res) => {
  const { songs } = req.body;
  if (!Array.isArray(songs)) {
    return res.status(400).json({ error: 'Songs must be an array' });
  }
  customSongPool = songs;
  res.json({ message: 'Song pool updated', total: customSongPool.length });
});

// Clear custom songs (revert to default)
app.delete('/api/songs', (req, res) => {
  customSongPool = [];
  res.json({ message: 'Custom songs cleared, using default pool', total: defaultSongPool.length });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
