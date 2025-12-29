import { useState, useEffect } from 'react';
import { Users, Target, Play, Plus, Minus, Music } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (teamCount: number, teamNames: string[], timelineGoal: number) => void;
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState<string[]>(['Team 1', 'Team 2']);
  const [timelineGoal, setTimelineGoal] = useState(10);
  const [songCount, setSongCount] = useState(0);

  useEffect(() => {
    fetchSongCount();
  }, []);

  const fetchSongCount = async () => {
    try {
      const res = await fetch('/api/songs');
      const data = await res.json();
      setSongCount(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch songs:', err);
    }
  };

  const handleTeamCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(9, teamCount + delta));
    setTeamCount(newCount);
    
    // Adjust team names array
    if (newCount > teamNames.length) {
      setTeamNames([...teamNames, ...Array(newCount - teamNames.length).fill(0).map((_, i) => `Team ${teamNames.length + i + 1}`)]);
    } else {
      setTeamNames(teamNames.slice(0, newCount));
    }
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const handleStart = () => {
    onStartGame(teamCount, teamNames, timelineGoal);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-playit-yellow via-playit-orange to-playit-pink bg-clip-text text-transparent">
          New Game
        </h2>
        <p className="text-gray-300 text-lg">
          Set up your teams and start playing! 🎵
        </p>
      </div>

      {/* Team Count */}
      <div className="bg-playit-purple/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-playit-cyan/20">
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-6 h-6 text-playit-cyan" />
          <h3 className="text-xl font-semibold">Number of Teams</h3>
        </div>
        
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => handleTeamCountChange(-1)}
            disabled={teamCount <= 1}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Minus className="w-6 h-6" />
          </button>
          
          <span className="text-5xl font-bold w-20 text-center">{teamCount}</span>
          
          <button
            onClick={() => handleTeamCountChange(1)}
            disabled={teamCount >= 9}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Team Names */}
      <div className="bg-playit-purple/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-playit-pink/20">
        <h3 className="text-xl font-semibold mb-4">Team Names</h3>
        <div className="grid gap-3">
          {teamNames.map((name, index) => (
            <input
              key={index}
              type="text"
              value={name}
              onChange={(e) => handleTeamNameChange(index, e.target.value)}
              className="w-full px-4 py-3 bg-playit-navy/50 border border-playit-cyan/30 rounded-xl focus:outline-none focus:border-playit-cyan focus:ring-1 focus:ring-playit-cyan transition-colors"
              placeholder={`Team ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Song Pool */}
      <div className="bg-playit-purple/30 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-playit-yellow/20">
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-6 h-6 text-playit-yellow" />
          <h3 className="text-xl font-semibold">Song Pool</h3>
        </div>
        
        <div className="flex items-center gap-2 text-playit-yellow">
          <span className="text-2xl font-bold">{songCount.toLocaleString()}</span>
          <span className="text-gray-300">songs available</span>
        </div>
      </div>

      {/* Timeline Goal */}
      <div className="bg-playit-purple/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-playit-orange/20">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-playit-orange" />
          <h3 className="text-xl font-semibold">Timeline Goal</h3>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          First team to reach this many songs wins!
        </p>
        
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setTimelineGoal(Math.max(1, timelineGoal - 1))}
            disabled={timelineGoal <= 1}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Minus className="w-6 h-6" />
          </button>
          
          <span className="text-5xl font-bold w-20 text-center">{timelineGoal}</span>
          
          <button
            onClick={() => setTimelineGoal(timelineGoal + 1)}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full py-4 bg-gradient-to-r from-playit-pink via-playit-orange to-playit-yellow hover:from-playit-yellow hover:via-playit-orange hover:to-playit-pink rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-playit-navy"
      >
        <Play className="w-6 h-6" fill="currentColor" />
        Start Game
      </button>
    </div>
  );
}
