import type { VercelRequest, VercelResponse } from '@vercel/node';
import { gameState, getRandomSong } from '../_lib/state';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

  return res.json({ 
    spotifyId: song.spotifyId,
    songId: song.id,
  });
}
