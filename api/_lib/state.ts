import { Song, Team, Game, GameState } from './types';
import { songPool as defaultSongPool } from './songPool';

// Custom song pool (can be updated via API)
let customSongPool: Song[] = [];

// In-memory game state (single game for V1)
// Note: In serverless, this resets between cold starts
export let gameState: GameState = {
  game: null,
  currentSong: null,
  songRevealed: false,
};

export function resetGameState() {
  gameState = {
    game: null,
    currentSong: null,
    songRevealed: false,
  };
}

export function setGameState(newState: Partial<GameState>) {
  gameState = { ...gameState, ...newState };
}

export function generateGameId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getRandomYear(): number {
  const decades = [1960, 1970, 1980, 1990, 2000, 2010];
  const decade = decades[Math.floor(Math.random() * decades.length)];
  return decade + Math.floor(Math.random() * 10);
}

export function getActiveSongPool(): Song[] {
  return customSongPool.length > 0 ? customSongPool : defaultSongPool;
}

export function setCustomSongPool(songs: Song[]) {
  customSongPool = songs;
}

export function clearCustomSongPool() {
  customSongPool = [];
}

export function getRandomSong(usedIds: Set<string>): Song | null {
  const pool = getActiveSongPool();
  const availableSongs = pool.filter((song: Song) => !usedIds.has(song.id));
  if (availableSongs.length === 0) return null;
  return availableSongs[Math.floor(Math.random() * availableSongs.length)];
}

export function getGameResponse() {
  if (!gameState.game) return null;
  
  return {
    game: {
      ...gameState.game,
      usedSongIds: Array.from(gameState.game.usedSongIds),
    },
    currentSong: gameState.songRevealed ? gameState.currentSong : 
      (gameState.currentSong ? { id: gameState.currentSong.id, spotifyId: gameState.currentSong.spotifyId } : null),
    songRevealed: gameState.songRevealed,
  };
}
