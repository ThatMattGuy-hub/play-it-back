import { Music, UserCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface SpotifyPlayerProps {
  spotifyId: string;
  hidden: boolean;
}

export default function SpotifyPlayer({ spotifyId, hidden }: SpotifyPlayerProps) {
  const spotifyUrl = `https://open.spotify.com/track/${spotifyId}`;

  // When song is revealed, show song info
  if (!hidden) {
    return (
      <div className="rounded-xl bg-gradient-to-br from-playit-cyan/20 to-playit-purple/40 border border-playit-cyan/30 p-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-playit-pink to-playit-orange rounded-full flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <p className="text-white font-bold text-lg">Song Revealed! 🎉</p>
          <p className="text-gray-300 text-sm mt-2">Check the details below</p>
        </div>
      </div>
    );
  }

  // When hidden, show QR code immediately
  return (
    <div className="rounded-xl bg-gradient-to-br from-playit-navy via-playit-purple to-playit-navy border border-playit-pink/20 p-6">
      <div className="flex flex-col items-center">
        {/* Host warning banner */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-playit-orange/20 rounded-full mb-4">
          <UserCircle className="w-4 h-4 text-playit-orange" />
          <span className="text-playit-orange text-xs font-medium">Host only - keep phone hidden! 🤫</span>
        </div>
        
        {/* QR Code */}
        <div className="bg-white p-4 rounded-xl mb-4 shadow-lg shadow-playit-pink/20">
          <QRCodeSVG 
            value={spotifyUrl} 
            size={180}
            level="M"
            includeMargin={false}
          />
        </div>
        
        <p className="text-white font-bold text-lg">Scan to Play 🎵</p>
        <p className="text-gray-400 text-xs mt-1">Host scans, then hides phone</p>
      </div>
    </div>
  );
}
