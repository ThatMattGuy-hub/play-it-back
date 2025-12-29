import { X, PartyPopper, Frown, Music, Calendar, User } from 'lucide-react';
import { Song } from '../types';

interface ResultModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  song: Song;
  onClose: () => void;
}

export default function ResultModal({ isOpen, isCorrect, song, onClose }: ResultModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md mx-4 rounded-2xl p-8 border-2 ${
        isCorrect 
          ? 'bg-gradient-to-br from-playit-purple to-playit-navy border-playit-cyan' 
          : 'bg-gradient-to-br from-playit-purple to-playit-navy border-playit-pink'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Result Icon & Message */}
        <div className="text-center mb-8">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isCorrect ? 'bg-playit-cyan/20' : 'bg-playit-pink/20'
          }`}>
            {isCorrect ? (
              <PartyPopper className="w-12 h-12 text-playit-yellow" />
            ) : (
              <Frown className="w-12 h-12 text-playit-pink" />
            )}
          </div>
          
          <h2 className={`text-3xl font-bold mb-2 ${
            isCorrect ? 'text-playit-yellow' : 'text-playit-pink'
          }`}>
            {isCorrect ? 'Congratulations!' : 'Unlucky!'}
          </h2>
          <p className="text-gray-400">
            {isCorrect 
              ? 'You placed it in the right spot!' 
              : 'That wasn\'t quite right...'}
          </p>
        </div>

        {/* Song Details */}
        <div className="bg-playit-navy/50 rounded-xl p-6 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-playit-pink to-playit-orange rounded-full flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold mb-1">{song.title}</h3>
          
          <p className="text-gray-400 flex items-center justify-center gap-2 mb-4">
            <User className="w-4 h-4" />
            {song.artist}
          </p>
          
          {/* Year in big font */}
          <div className="flex items-center justify-center gap-2 text-playit-yellow">
            <Calendar className="w-8 h-8" />
            <span className="text-6xl font-bold">{song.year}</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={onClose}
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
            isCorrect 
              ? 'bg-gradient-to-r from-playit-cyan to-playit-yellow hover:from-playit-yellow hover:to-playit-cyan text-playit-navy' 
              : 'bg-gradient-to-r from-playit-pink to-playit-orange hover:from-playit-orange hover:to-playit-pink text-white'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
