
import React from "react";
import { Trophy, RotateCw, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameStats {
  score: number;
  level: number;
  highScore: number;
  wordsFormed: number;
  timeElapsed: number;
}

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  stats: GameStats;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  stats,
}) => {
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  
  // Handle share functionality
  const handleShare = () => {
    const shareText = `I scored ${stats.score} points and reached level ${stats.level} in Wordris! Can you beat my score?`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Wordris Score',
        text: shareText,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Score copied to clipboard!");
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white w-[90%] max-w-md mx-auto p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-br from-purple-800/80 to-gray-900 pt-8 pb-6 px-6">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-purple-500/30 blur-sm animate-pulse"></div>
              <div className="relative bg-gray-900 p-3 rounded-full">
                <Trophy className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-3xl font-bold text-center text-white mb-1">Game Over</DialogTitle>
          <p className="text-center text-gray-300">Well played!</p>
        </DialogHeader>
        
        {/* Score display with animation */}
        <div className="py-4 px-6 flex justify-center items-center">
          <div className="text-center">
            <p className="text-gray-400 text-sm uppercase tracking-wider">Final Score</p>
            <p className="text-4xl font-bold mb-0 animate-fade-in">{stats.score}</p>
          </div>
        </div>
        
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 px-6 py-3">
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Level Reached</p>
            <p className="text-xl font-semibold">{stats.level}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">High Score</p>
            <p className="text-xl font-semibold">{stats.highScore}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Words Formed</p>
            <p className="text-xl font-semibold">{stats.wordsFormed}</p>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg">
            <p className="text-xs text-gray-400">Time Played</p>
            <p className="text-xl font-semibold">{formatTime(stats.timeElapsed)}</p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 p-6">
          <Button 
            onClick={onRestart} 
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Play Again
          </Button>
          <Button 
            onClick={handleShare} 
            variant="outline" 
            className="flex-1 border-gray-700 text-white hover:bg-gray-800"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Score
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverModal;
