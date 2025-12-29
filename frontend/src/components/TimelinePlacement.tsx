import { useState } from 'react';
import { Team, Song } from '../types';
import { ChevronRight, Check, Disc3, Sparkles } from 'lucide-react';

interface TimelinePlacementProps {
  team: Team;
  currentSong: Song;
  onCheckTimeline: (position: number) => void;
}

export default function TimelinePlacement({ team, currentSong, onCheckTimeline }: TimelinePlacementProps) {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build timeline slots
  const timelineItems = [
    { type: 'year' as const, year: team.startingYear, isStart: true },
    ...team.timeline.map((entry) => ({
      type: 'song' as const,
      song: entry.song,
    })),
  ];

  const handlePlacement = async () => {
    if (selectedPosition !== null) {
      setIsSubmitting(true);
      await onCheckTimeline(selectedPosition);
      setSelectedPosition(null);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-playit-navy via-playit-purple to-indigo-900 overflow-auto">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-playit-pink/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-playit-cyan/10 rounded-full blur-3xl animate-pulse delay-300" />
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-playit-yellow/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-playit-orange/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Floating music notes */}
        <Sparkles className="absolute top-1/4 left-[15%] w-6 h-6 text-playit-yellow/30 animate-bounce" />
        <Sparkles className="absolute top-1/3 right-[20%] w-8 h-8 text-playit-pink/30 animate-bounce delay-200" />
        <Sparkles className="absolute bottom-1/4 left-[25%] w-5 h-5 text-playit-cyan/30 animate-bounce delay-400" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-playit-pink/20 rounded-full mb-4">
            <span className="text-playit-pink font-semibold">{team.name}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-playit-yellow via-playit-orange to-playit-pink bg-clip-text text-transparent">
            Place Your Song! 🎯
          </h1>
          <p className="text-xl text-gray-300">
            Where does this song belong in history?
          </p>
        </div>

        {/* Current Song Card - Big and prominent */}
        <div className="w-full max-w-lg mb-10">
          <div className="bg-gradient-to-br from-playit-purple/60 to-playit-navy/60 backdrop-blur-xl rounded-3xl p-8 border-2 border-playit-pink/30 shadow-2xl shadow-playit-pink/20">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-playit-pink via-playit-orange to-playit-yellow rounded-2xl flex items-center justify-center shadow-lg shadow-playit-orange/30 animate-pulse">
                <Disc3 className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{currentSong.title}</h2>
                <p className="text-lg text-playit-cyan">{currentSong.artist}</p>
                <p className="text-playit-yellow mt-2 text-sm font-medium">📅 Year: ???</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="w-full max-w-4xl mb-10">
          <h3 className="text-center text-xl font-semibold text-gray-300 mb-6">
            Tap where this song belongs on the timeline
          </h3>
          
          {/* Timeline visualization */}
          <div className="bg-playit-navy/50 backdrop-blur-sm rounded-2xl p-6 border border-playit-cyan/20">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Drop zone before start */}
              <button
                onClick={() => setSelectedPosition(0)}
                disabled={isSubmitting}
                className={`px-6 py-4 rounded-xl border-3 border-dashed transition-all transform hover:scale-105 ${
                  selectedPosition === 0
                    ? 'border-playit-yellow bg-playit-yellow/20 text-white scale-105 shadow-lg shadow-playit-yellow/30'
                    : 'border-white/30 hover:border-playit-cyan text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm font-medium">Before</span>
                <div className="text-lg font-bold">{team.startingYear}</div>
              </button>

              {timelineItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {/* Year/Song Card */}
                  {item.type === 'year' ? (
                    <div className="px-6 py-4 bg-playit-cyan/20 border-2 border-playit-cyan rounded-xl">
                      <div className="text-xs text-playit-cyan mb-1">Start</div>
                      <div className="text-xl font-bold text-white">{item.year}</div>
                    </div>
                  ) : (
                    <div className="px-5 py-4 bg-playit-purple/40 border border-white/20 rounded-xl">
                      <div className="text-xl font-bold text-white">{item.song.year}</div>
                      <div className="text-xs text-gray-400 truncate max-w-[100px]">{item.song.title}</div>
                    </div>
                  )}

                  <ChevronRight className="w-5 h-5 text-playit-pink" />

                  {/* Drop zone after this item */}
                  <button
                    onClick={() => setSelectedPosition(index + 1)}
                    disabled={isSubmitting}
                    className={`px-6 py-4 rounded-xl border-3 border-dashed transition-all transform hover:scale-105 ${
                      selectedPosition === index + 1
                        ? 'border-playit-yellow bg-playit-yellow/20 text-white scale-105 shadow-lg shadow-playit-yellow/30'
                        : 'border-white/30 hover:border-playit-cyan text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm font-medium">After</span>
                    <div className="text-lg font-bold">{item.type === 'year' ? item.year : item.song.year}</div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Button - Big and prominent */}
        <button
          onClick={handlePlacement}
          disabled={selectedPosition === null || isSubmitting}
          className={`px-12 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all transform ${
            selectedPosition !== null && !isSubmitting
              ? 'bg-gradient-to-r from-playit-cyan via-playit-pink to-playit-yellow hover:scale-105 shadow-2xl shadow-playit-pink/40 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <Disc3 className="w-7 h-7 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Check className="w-7 h-7" />
              Is it right? 🤔
            </>
          )}
        </button>

        {/* Hint text */}
        {selectedPosition === null && (
          <p className="mt-6 text-gray-500 text-center animate-pulse">
            👆 Select a position on the timeline above
          </p>
        )}
      </div>
    </div>
  );
}
