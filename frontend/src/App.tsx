import { useState, useCallback, useEffect } from 'react';
import { Game, Song, GamePhase, Team } from './types';
import { RotateCcw } from 'lucide-react';
import GameSetup from './components/GameSetup';
import GamePlay from './components/GamePlay';
import WinnerScreen from './components/WinnerScreen';

const API_BASE = '/api';

function App() {
  const [game, setGame] = useState<Game | null>(null);
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [songRevealed, setSongRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<Team | null>(null);

  // Auto-load song when game starts or new turn begins
  const loadNextSong = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/game/play-song`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const songData = { ...data, title: '???', artist: '???', year: 0 } as Song;
      setCurrentSong(songData);
      setSongRevealed(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load song');
    }
  }, []);

  // Auto-load song when phase is 'playing' and no current song
  useEffect(() => {
    if (phase === 'playing' && !currentSong && game) {
      loadNextSong();
    }
  }, [phase, currentSong, game, loadNextSong]);

  const createGame = useCallback(async (teamCount: number, teamNames: string[], timelineGoal: number) => {
    try {
      const response = await fetch(`${API_BASE}/game/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamCount, teamNames, timelineGoal }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGame(data.game);
      setCurrentSong(null); // Reset song so useEffect triggers
      setPhase('playing');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    }
  }, []);


  const revealSong = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/game/reveal`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setCurrentSong(data.song);
      setSongRevealed(true);
      setPhase('guessing');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reveal song');
    }
  }, []);

  const submitGuess = useCallback(async (correct: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/game/guess-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correct }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      if (correct) {
        setPhase('placing');
      } else {
        // Refresh game state for next team
        const gameResponse = await fetch(`${API_BASE}/game`);
        const gameData = await gameResponse.json();
        setGame(gameData.game);
        setCurrentSong(null);
        setSongRevealed(false);
        setPhase('playing');
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit guess');
    }
  }, []);

  const checkTimeline = useCallback(async (position: number): Promise<{ valid: boolean; song: Song | null }> => {
    try {
      const response = await fetch(`${API_BASE}/game/check-timeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const revealedSong = data.song as Song;
      
      if (data.winner) {
        setWinner(data.winner);
        setPhase('finished');
      } else {
        // Refresh game state
        const gameResponse = await fetch(`${API_BASE}/game`);
        const gameData = await gameResponse.json();
        setGame(gameData.game);
        setCurrentSong(null);
        setSongRevealed(false);
        setPhase('playing');
      }
      setError(null);
      return { valid: data.valid, song: revealedSong };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check timeline');
      return { valid: false, song: null };
    }
  }, []);

  const resetGame = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/game/reset`, { method: 'POST' });
      setGame(null);
      setPhase('setup');
      setCurrentSong(null);
      setSongRevealed(false);
      setWinner(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset game');
    }
  }, []);

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-playit-navy via-playit-purple to-indigo-900">
      {/* Header */}
      <header className="bg-playit-navy/50 backdrop-blur-sm border-b border-playit-cyan/20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Play It Back" className="h-14" />
          </div>
          {game && (
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-playit-pink/20 hover:bg-playit-pink/30 border border-playit-pink/50 rounded-full transition-colors font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </button>
          )}
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/20 border-b border-red-500/50 px-4 py-3">
          <div className="max-w-6xl mx-auto text-red-300 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {phase === 'setup' && (
          <GameSetup onStartGame={createGame} />
        )}
        
        {phase !== 'setup' && phase !== 'finished' && game && (
          <GamePlay
            game={game}
            phase={phase}
            currentSong={currentSong}
            songRevealed={songRevealed}
            onRevealSong={revealSong}
            onSubmitGuess={submitGuess}
            onCheckTimeline={checkTimeline}
          />
        )}
        
        {phase === 'finished' && winner && (
          <WinnerScreen winner={winner} onPlayAgain={resetGame} />
        )}
      </main>
    </div>
  );
}

export default App;
