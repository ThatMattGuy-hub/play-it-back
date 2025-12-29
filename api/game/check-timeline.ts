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

  const { position } = req.body;
  
  if (!gameState.game || !gameState.currentSong) {
    return res.status(400).json({ error: 'No active turn' });
  }

  const currentTeam = gameState.game.teams[gameState.game.currentTeamIndex];
  const song = gameState.currentSong;
  const timeline = currentTeam.timeline;
  
  const years = [currentTeam.startingYear, ...timeline.map(e => e.song.year)];
  
  let isValid = true;
  
  if (position === 0) {
    isValid = song.year <= years[0];
  } else if (position >= years.length) {
    isValid = song.year >= years[years.length - 1];
  } else {
    isValid = song.year >= years[position - 1] && song.year <= years[position];
  }

  if (isValid) {
    currentTeam.timeline.splice(position > 0 ? position - 1 : 0, 0, {
      song,
      position,
    });
    currentTeam.score++;

    if (currentTeam.score >= gameState.game.timelineGoal) {
      gameState.game.status = 'finished';
      gameState.game.winnerId = currentTeam.id;
      
      return res.json({
        valid: true,
        winner: currentTeam,
        message: `${currentTeam.name} wins!`,
        song: song,
      });
    }
  }

  gameState.game.currentTeamIndex = 
    (gameState.game.currentTeamIndex + 1) % gameState.game.teams.length;
  gameState.currentSong = null;
  gameState.songRevealed = false;

  return res.json({
    valid: isValid,
    message: isValid ? 'Correct placement!' : 'Wrong position, song discarded',
    song: song,
    nextTeam: gameState.game.teams[gameState.game.currentTeamIndex],
    team: currentTeam,
  });
}
