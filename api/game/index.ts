import type { VercelRequest, VercelResponse } from '@vercel/node';
import { gameState, getGameResponse } from '../_lib/state';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!gameState.game) {
    return res.status(404).json({ error: 'No active game' });
  }

  return res.json(getGameResponse());
}
