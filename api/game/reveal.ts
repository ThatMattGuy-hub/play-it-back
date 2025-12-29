import type { VercelRequest, VercelResponse } from '@vercel/node';
import { gameState } from '../_lib/state';

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

  if (!gameState.game || !gameState.currentSong) {
    return res.status(400).json({ error: 'No song to reveal' });
  }

  gameState.songRevealed = true;
  return res.json({ song: gameState.currentSong });
}
