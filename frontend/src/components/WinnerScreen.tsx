import { Team } from '../types';
import { Trophy, RotateCcw, Music, Sparkles } from 'lucide-react';

interface WinnerScreenProps {
  winner: Team;
  onPlayAgain: () => void;
}

export default function WinnerScreen({ winner, onPlayAgain }: WinnerScreenProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Celebration Animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 bg-gradient-to-r from-playit-pink/30 to-playit-yellow/30 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-playit-yellow to-playit-orange rounded-full flex items-center justify-center shadow-2xl shadow-playit-yellow/30">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <Sparkles className="absolute top-0 right-1/3 w-8 h-8 text-playit-yellow animate-bounce" />
          <Sparkles className="absolute bottom-4 left-1/3 w-6 h-6 text-playit-pink animate-bounce delay-100" />
        </div>
      </div>

      {/* Winner Text */}
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-playit-yellow via-playit-orange to-playit-pink bg-clip-text text-transparent">
        🎉 {winner.name} Wins! 🎉
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Completed the timeline with {winner.score} songs!
      </p>

      {/* Winner's Timeline */}
      <div className="bg-playit-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-playit-cyan/20 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
          <Music className="w-5 h-5 text-playit-cyan" />
          Winning Timeline
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          <div className="px-4 py-2 bg-playit-cyan/20 border border-playit-cyan/50 rounded-lg">
            <div className="font-bold">{winner.startingYear}</div>
            <div className="text-xs text-gray-400">Start</div>
          </div>
          {winner.timeline.map((entry, idx) => (
            <div key={idx} className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
              <div className="font-bold">{entry.song.year}</div>
              <div className="text-xs text-gray-400 truncate max-w-[100px]">{entry.song.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Play Again Button */}
      <button
        onClick={onPlayAgain}
        className="px-8 py-4 bg-gradient-to-r from-playit-pink via-playit-orange to-playit-yellow hover:from-playit-yellow hover:via-playit-orange hover:to-playit-pink rounded-xl font-bold text-lg flex items-center justify-center gap-3 mx-auto transition-all transform hover:scale-105 text-playit-navy"
      >
        <RotateCcw className="w-6 h-6" />
        Play Again
      </button>
    </div>
  );
}
