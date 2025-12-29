export interface Song {
  id: string;
  spotifyId: string;
  title: string;
  artist: string;
  year: number;
}

export interface Team {
  id: number;
  name: string;
  startingYear: number;
  timeline: TimelineEntry[];
  score: number;
}

export interface TimelineEntry {
  song: Song;
  position: number;
}

export interface Game {
  id: string;
  teams: Team[];
  currentTeamIndex: number;
  timelineGoal: number;
  usedSongIds: string[];
  status: 'setup' | 'playing' | 'finished';
  winnerId: number | null;
}

export type GamePhase = 
  | 'setup'
  | 'playing'
  | 'revealing'
  | 'guessing'
  | 'placing'
  | 'finished';
