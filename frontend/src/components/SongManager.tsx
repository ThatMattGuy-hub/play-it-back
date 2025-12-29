import { useState } from 'react';
import { Plus, Trash2, Music, Link, Save } from 'lucide-react';

interface Song {
  id: string;
  spotifyId: string;
  title: string;
  artist: string;
  year: number;
}

interface SongManagerProps {
  onSongsUpdate: (songs: Song[]) => void;
  currentSongs: Song[];
}

export default function SongManager({ onSongsUpdate, currentSongs }: SongManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newSong, setNewSong] = useState({
    spotifyUrl: '',
    title: '',
    artist: '',
    year: '',
  });
  const [songs, setSongs] = useState<Song[]>(currentSongs);
  const [error, setError] = useState('');

  const extractSpotifyId = (url: string): string | null => {
    // Handle various Spotify URL formats
    // https://open.spotify.com/track/7JJmb5XwzOO8jgpou264Ml?si=xxx
    // spotify:track:7JJmb5XwzOO8jgpou264Ml
    const patterns = [
      /spotify\.com\/track\/([a-zA-Z0-9]+)/,
      /spotify:track:([a-zA-Z0-9]+)/,
      /^([a-zA-Z0-9]{22})$/, // Direct ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleAddSong = () => {
    setError('');
    
    const spotifyId = extractSpotifyId(newSong.spotifyUrl);
    if (!spotifyId) {
      setError('Invalid Spotify URL. Paste a link like: https://open.spotify.com/track/...');
      return;
    }
    
    if (!newSong.title || !newSong.artist || !newSong.year) {
      setError('Please fill in all fields');
      return;
    }

    const year = parseInt(newSong.year);
    if (isNaN(year) || year < 1900 || year > 2030) {
      setError('Please enter a valid year (1900-2030)');
      return;
    }

    const song: Song = {
      id: `custom-${Date.now()}`,
      spotifyId,
      title: newSong.title,
      artist: newSong.artist,
      year,
    };

    const updatedSongs = [...songs, song];
    setSongs(updatedSongs);
    setNewSong({ spotifyUrl: '', title: '', artist: '', year: '' });
  };

  const handleRemoveSong = (id: string) => {
    const updatedSongs = songs.filter(s => s.id !== id);
    setSongs(updatedSongs);
  };

  const handleSave = () => {
    onSongsUpdate(songs);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors text-sm"
      >
        <Music className="w-4 h-4" />
        Manage Songs ({songs.length})
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Manage Song Pool</h2>
          <p className="text-gray-400 text-sm mt-1">Add songs using Spotify links</p>
        </div>

        {/* Add Song Form */}
        <div className="p-6 border-b border-white/10 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Spotify Link
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={newSong.spotifyUrl}
                  onChange={(e) => setNewSong({ ...newSong, spotifyUrl: e.target.value })}
                  placeholder="https://open.spotify.com/track/..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-spotify-green"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={newSong.title}
                onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                placeholder="Song title"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-spotify-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Artist</label>
              <input
                type="text"
                value={newSong.artist}
                onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                placeholder="Artist name"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-spotify-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Year</label>
              <input
                type="number"
                value={newSong.year}
                onChange={(e) => setNewSong({ ...newSong, year: e.target.value })}
                placeholder="1999"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-spotify-green"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleAddSong}
            className="flex items-center gap-2 px-4 py-2 bg-spotify-green hover:bg-green-500 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Song
          </button>
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Songs ({songs.length})</h3>
          {songs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No songs added yet</p>
          ) : (
            <div className="space-y-2">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-spotify-green/20 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-spotify-green" />
                    </div>
                    <div>
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist} • {song.year}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSong(song.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-spotify-green hover:bg-green-500 rounded-lg font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
