import { useState } from 'react';
import { Game, Song, GamePhase } from '../types';
import { Eye, Check, X, Music } from 'lucide-react';
import TimelinePlacement from './TimelinePlacement';
import SpotifyPlayer from './SpotifyPlayer';
import ResultModal from './ResultModal';

interface GamePlayProps {
  game: Game;
  phase: GamePhase;
  currentSong: Song | null;
  songRevealed: boolean;
  onRevealSong: () => void;
  onSubmitGuess: (correct: boolean) => void;
  onCheckTimeline: (position: number) => Promise<{ valid: boolean; song: Song | null }>;
}

export default function GamePlay({
  game,
  phase,
  currentSong,
  songRevealed,
  onRevealSong,
  onSubmitGuess,
  onCheckTimeline,
}: GamePlayProps) {
  const [showResultModal, setShowResultModal] = useState(false);
  const [placementResult, setPlacementResult] = useState<'correct' | 'incorrect' | null>(null);
  const [revealedSong, setRevealedSong] = useState<Song | null>(null);
  const currentTeam = game.teams[game.currentTeamIndex];

  const handleCheckTimeline = async (position: number) => {
    const result = await onCheckTimeline(position);
    setPlacementResult(result.valid ? 'correct' : 'incorrect');
    setRevealedSong(result.song);
    setShowResultModal(true);
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
    setPlacementResult(null);
    setRevealedSong(null);
  };

  return (
    <div className="space-y-6">
      {/* Team Scores */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {game.teams.map((team, index) => (
          <div
            key={team.id}
            className={`p-4 rounded-xl border transition-all ${
              index === game.currentTeamIndex
                ? 'bg-playit-cyan/20 border-playit-cyan shadow-lg shadow-playit-cyan/20'
                : 'bg-playit-purple/30 border-playit-purple'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold truncate">{team.name}</span>
              {index === game.currentTeamIndex && (
                <span className="text-xs bg-playit-pink px-2 py-1 rounded-full text-white">Playing</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold">{team.score}</div>
              <div className="text-gray-400 text-sm">/ {game.timelineGoal}</div>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-playit-pink via-playit-orange to-playit-yellow transition-all"
                style={{ width: `${(team.score / game.timelineGoal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Current Turn - Unified flat design */}
      <div className="text-center space-y-6">
        {/* Team Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-playit-cyan/20 rounded-full border border-playit-cyan/30">
          <span className="text-3xl">🎤</span>
          <span className="text-playit-cyan font-bold text-xl">{currentTeam.name}'s Turn</span>
          <span className="text-gray-400">•</span>
          <span className="text-playit-yellow font-bold">Starting {currentTeam.startingYear}</span>
        </div>

        {/* Main Content Area */}
        {!currentSong ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-playit-pink/30 to-playit-orange/30 rounded-full flex items-center justify-center animate-pulse">
              <Music className="w-12 h-12 text-playit-pink" />
            </div>
            <span className="text-gray-400 text-xl">Loading your song... 🎵</span>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-6">
            {/* Floating decorations */}
            <div className="relative">
              <div className="absolute -top-6 -right-6 text-4xl animate-bounce">🎵</div>
              <div className="absolute -top-4 -left-4 text-3xl animate-bounce delay-300">🎶</div>
              
              {/* QR Code / Player - No extra container */}
              <SpotifyPlayer 
                spotifyId={currentSong.spotifyId} 
                hidden={!songRevealed} 
              />
            </div>

            {/* Song Info (shown after reveal) - Minimal styling */}
            {songRevealed && (
              <div className="flex items-center gap-5 text-left">
                <div className="w-20 h-20 bg-gradient-to-br from-playit-pink via-playit-orange to-playit-yellow rounded-2xl flex items-center justify-center shadow-lg shadow-playit-orange/30 flex-shrink-0">
                  <Music className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white truncate">{currentSong.title}</h3>
                  <p className="text-playit-cyan text-lg truncate">{currentSong.artist}</p>
                  <p className="text-gray-400 mt-1">
                    {phase !== 'guessing' && phase !== 'placing' 
                      ? <span className="text-playit-yellow font-bold text-xl">{currentSong.year}</span>
                      : <span className="italic">Year: ???</span>
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons - Clean and prominent */}
            {!songRevealed && phase === 'playing' && (
              <button
                onClick={onRevealSong}
                className="w-full py-5 bg-gradient-to-r from-playit-pink via-playit-orange to-playit-yellow hover:from-playit-yellow hover:via-playit-orange hover:to-playit-pink rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-xl shadow-playit-orange/40 text-white"
              >
                <Eye className="w-7 h-7" />
                Reveal Song 🎉
              </button>
            )}

            {songRevealed && phase === 'guessing' && (
              <div className="space-y-4">
                <p className="text-gray-300 text-lg">Did the team guess correctly?</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => onSubmitGuess(true)}
                    className="py-4 bg-green-500/20 hover:bg-green-500/40 border-2 border-green-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Check className="w-6 h-6" />
                    Correct ✓
                  </button>
                  <button
                    onClick={() => onSubmitGuess(false)}
                    className="py-4 bg-red-500/20 hover:bg-red-500/40 border-2 border-red-500 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <X className="w-6 h-6" />
                    Incorrect ✗
                  </button>
                </div>
              </div>
              )}
            </div>
          )}
        </div>

      {/* Result Modal */}
      {showResultModal && revealedSong && (
        <ResultModal
          isOpen={showResultModal}
          isCorrect={placementResult === 'correct'}
          song={revealedSong}
          onClose={handleCloseModal}
        />
      )}

      {/* Fullscreen Timeline Placement - Show when placing */}
      {phase === 'placing' && currentSong && (
        <TimelinePlacement
          team={currentTeam}
          currentSong={currentSong}
          onCheckTimeline={handleCheckTimeline}
        />
      )}

      {/* Team Timelines Overview */}
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-playit-pink/50 to-transparent" />
          <h3 className="text-2xl font-bold bg-gradient-to-r from-playit-cyan to-playit-pink bg-clip-text text-transparent">
            📀 Team Timelines
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-playit-pink/50 to-transparent" />
        </div>
        
        {game.teams.map((team, teamIndex) => (
          <div 
            key={team.id} 
            className={`relative overflow-hidden rounded-2xl p-5 border-2 transition-all ${
              teamIndex === game.currentTeamIndex
                ? 'bg-gradient-to-r from-playit-cyan/20 to-playit-pink/20 border-playit-cyan shadow-lg shadow-playit-cyan/20'
                : 'bg-playit-navy/30 border-playit-purple/30'
            }`}
          >
            {/* Team header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{teamIndex === 0 ? '🎸' : teamIndex === 1 ? '🎹' : teamIndex === 2 ? '🥁' : '🎺'}</span>
                <span className="font-bold text-lg">{team.name}</span>
                {teamIndex === game.currentTeamIndex && (
                  <span className="text-xs bg-playit-pink px-2 py-1 rounded-full animate-pulse">Now Playing</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-playit-yellow">{team.score}/{game.timelineGoal}</div>
                <div className="text-xs text-gray-400">songs placed</div>
              </div>
            </div>
            
            {/* Timeline visualization */}
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-playit-cyan via-playit-pink to-playit-yellow rounded-full -translate-y-1/2 opacity-30" />
              
              <div className="relative flex items-center gap-3 overflow-x-auto pb-2">
                {/* Build sorted timeline with starting year included */}
                {(() => {
                  // Create combined timeline with starting year and songs
                  const timelineItems: Array<{ type: 'start' | 'song'; year: number; song?: typeof team.timeline[0]['song'] }> = [
                    { type: 'start', year: team.startingYear },
                    ...team.timeline.map(entry => ({ type: 'song' as const, year: entry.song.year, song: entry.song }))
                  ];
                  // Sort by year
                  timelineItems.sort((a, b) => a.year - b.year);
                  
                  return timelineItems.map((item, idx) => (
                    item.type === 'start' ? (
                      <div key={`start-${idx}`} className="flex-shrink-0 relative">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-playit-cyan to-playit-cyan/50 flex flex-col items-center justify-center shadow-lg shadow-playit-cyan/30 border-2 border-playit-cyan">
                          <span className="text-xs text-white/70">START</span>
                          <span className="text-lg font-bold text-white">{item.year}</span>
                        </div>
                      </div>
                    ) : (
                      <div key={`song-${idx}`} className="flex-shrink-0 relative group">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-playit-pink/80 to-playit-orange/80 flex flex-col items-center justify-center shadow-lg shadow-playit-pink/30 border-2 border-playit-pink/50 hover:scale-110 transition-transform cursor-default">
                          <span className="text-lg font-bold text-white">{item.year}</span>
                          <span className="text-[10px] text-white/70 truncate w-14 text-center">{item.song?.title}</span>
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-playit-navy rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-playit-pink/30 z-10">
                          <div className="font-bold text-white">{item.song?.title}</div>
                          <div className="text-playit-cyan">{item.song?.artist}</div>
                        </div>
                      </div>
                    )
                  ));
                })()}
                
                {/* Empty slots placeholder */}
                {team.timeline.length === 0 && (
                  <div className="flex items-center gap-2 text-gray-500 italic pl-4">
                    <span className="text-2xl">🎵</span>
                    <span>No songs placed yet - good luck!</span>
                  </div>
                )}
                
                {/* Goal indicator */}
                {team.timeline.length > 0 && team.timeline.length < game.timelineGoal && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-playit-yellow/50 flex flex-col items-center justify-center text-playit-yellow/50">
                    <span className="text-2xl">?</span>
                    <span className="text-[10px]">Next</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
