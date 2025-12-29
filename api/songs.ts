import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getActiveSongPool, setCustomSongPool, clearCustomSongPool } from './_lib/state';
import { songPool } from './_lib/songPool';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const pool = getActiveSongPool();
    return res.json({ songs: pool, total: pool.length, isCustom: pool !== songPool });
  }

  if (req.method === 'POST') {
    const { songs } = req.body;
    if (!Array.isArray(songs)) {
      return res.status(400).json({ error: 'Songs must be an array' });
    }
    setCustomSongPool(songs);
    return res.json({ message: 'Song pool updated', total: songs.length });
  }

  if (req.method === 'DELETE') {
    clearCustomSongPool();
    return res.json({ message: 'Custom songs cleared, using default pool', total: songPool.length });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
