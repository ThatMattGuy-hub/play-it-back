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

  const { correct } = req.body;
  
  if (!gameState.game || !gameState.currentSong) {
    return res.status(400).json({ error: 'No active turn' });
  }

  if (!correct) {
    gameState.game.currentTeamIndex = 
      (gameState.game.currentTeamIndex + 1) % gameState.game.teams.length;
    gameState.currentSong = null;
    gameState.songRevealed = false;
    
    return res.json({ 
      message: 'Incorrect guess, next team\'s turn',
      nextTeam: gameState.game.teams[gameState.game.currentTeamIndex],
    });
  }

  return res.json({ 
    message: 'Correct! Place the song in your timeline',
    song: gameState.currentSong,
  });
}
