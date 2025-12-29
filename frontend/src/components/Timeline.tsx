import { useState } from 'react';
import { Team, Song } from '../types';
import { ChevronRight, Music, Check } from 'lucide-react';

interface TimelineProps {
  team: Team;
  currentSong: Song;
  onCheckTimeline: (position: number) => void;
}

export default function Timeline({ team, currentSong, onCheckTimeline }: TimelineProps) {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  // Build timeline slots: [before start] [start year] [after each song] [end]
  const timelineItems = [
    { type: 'year' as const, year: team.startingYear, isStart: true },
    ...team.timeline.map((entry) => ({
      type: 'song' as const,
      song: entry.song,
    })),
  ];

  const handlePlacement = () => {
    if (selectedPosition !== null) {
      onCheckTimeline(selectedPosition);
      setSelectedPosition(null);
    }
  };

  return (
    <div className="bg-playit-purple/30 backdrop-blur-sm rounded-2xl p-6 border border-playit-pink/20">
      <h3 className="text-xl font-semibold mb-2">Place Your Song 🎯</h3>
      <p className="text-gray-300 text-sm mb-6">
        Where does <span className="text-playit-yellow font-semibold">{currentSong.title}</span> belong in the timeline?
      </p>

      {/* Current Song Card - year hidden */}
      <div className="bg-gradient-to-r from-playit-pink/20 to-playit-orange/20 border border-playit-pink/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-playit-pink to-playit-orange rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold">{currentSong.title}</div>
            <div className="text-sm text-gray-400">{currentSong.artist}</div>
          </div>
        </div>
      </div>

      {/* Timeline with Drop Zones */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Drop zone before start */}
        <button
          onClick={() => setSelectedPosition(0)}
          className={`px-4 py-3 rounded-lg border-2 border-dashed transition-all ${
            selectedPosition === 0
              ? 'border-playit-cyan bg-playit-cyan/20 text-white'
              : 'border-white/30 hover:border-white/50 text-gray-400 hover:text-white'
          }`}
        >
          Before {team.startingYear}
        </button>

        {timelineItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Year/Song Card */}
            {item.type === 'year' ? (
              <div className="px-4 py-3 bg-playit-cyan/20 border border-playit-cyan/50 rounded-lg">
                <div className="font-bold">{item.year}</div>
                <div className="text-xs text-gray-400">Start</div>
              </div>
            ) : (
              <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg">
                <div className="font-bold">{item.song.year}</div>
                <div className="text-xs text-gray-400 truncate max-w-[80px]">{item.song.title}</div>
              </div>
            )}

            <ChevronRight className="w-4 h-4 text-gray-500" />

            {/* Drop zone after this item */}
            <button
              onClick={() => setSelectedPosition(index + 1)}
              className={`px-4 py-3 rounded-lg border-2 border-dashed transition-all ${
                selectedPosition === index + 1
                  ? 'border-playit-cyan bg-playit-cyan/20 text-white'
                  : 'border-white/30 hover:border-white/50 text-gray-400 hover:text-white'
              }`}
            >
              After {item.type === 'year' ? item.year : item.song.year}
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Button */}
      <button
        onClick={handlePlacement}
        disabled={selectedPosition === null}
        className="w-full py-3 bg-gradient-to-r from-playit-cyan to-playit-pink hover:from-playit-pink hover:to-playit-cyan disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
      >
        <Check className="w-5 h-5" />
        Is it right?
      </button>
    </div>
  );
}
