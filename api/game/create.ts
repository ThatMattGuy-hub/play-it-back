import type { VercelRequest, VercelResponse } from '@vercel/node';
import { gameState, generateGameId, getRandomYear } from '../_lib/state';
import { Game, Team } from '../_lib/types';

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

  gameState.game = game;
  gameState.currentSong = null;
  gameState.songRevealed = false;

  return res.json({ 
    game: {
      ...game,
      usedSongIds: Array.from(game.usedSongIds),
    }
  });
}
