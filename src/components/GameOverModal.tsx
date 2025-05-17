
import React from "react";
import { Trophy, RotateCw, Share2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GameStats } from "@/types/game";

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

  // Determine which achievements to show
  const getAchievements = () => {
    const achievements = [];
    
    if ((stats.wordsFormed || 0) >= 5) {
      achievements.push("Word Wizard");
    }
    
    if ((stats.lettersPlaced || 0) >= 50) {
      achievements.push("Word Factory");
    }
    
    if (stats.score >= 300) {
      achievements.push("Score Master");
    }
    
    return stats.achievements || achievements;
  };

  // Render grid visualization based on words formed
  const renderGridVisualization = () => {
    // Simple grid visualization based on score
    const cellCount = Math.min(9, Math.ceil(stats.score / 50));
    const cells = [];
    
    for (let i = 0; i < cellCount; i++) {
      const isTopRow = i < 3;
      const color = isTopRow ? "bg-orange-400" : "bg-green-500";
      cells.push(
        <div 
          key={i} 
          className={`${color} w-8 h-8 rounded-md`}
        />
      );
    }
    
    return (
      <div className="grid grid-cols-3 gap-1 w-max mx-auto">
        {cells}
      </div>
    );
  };

  const achievements = getAchievements();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black w-[90%] max-w-md mx-auto p-0 overflow-hidden rounded-xl">
        <DialogHeader className="pt-8 pb-2 px-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
          >
            <X size={20} />
          </button>
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-8 w-8 text-yellow-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center text-black mb-1">Game Over!</DialogTitle>
          <p className="text-center text-gray-600">
            Your final score is <span className="font-bold text-gray-700">{stats.score}</span> points at level <span className="font-bold text-gray-700">{stats.level}</span>
          </p>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Statistics Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-bold mb-3">Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Final Score:</span>
                <span className="font-bold">{stats.score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Level Reached:</span>
                <span className="font-bold">{stats.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Letters Placed:</span>
                <span className="font-bold">{stats.lettersPlaced || 0}</span>
              </div>
              {stats.signatureWord && (
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">Signature Word:</span>
                  <span className="font-bold text-green-600">
                    {stats.signatureWord.word.toUpperCase()} ({stats.signatureWord.score}pts)
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Grid Visualization */}
          <div className="py-2">
            {renderGridVisualization()}
          </div>
          
          {/* Achievements Section */}
          {achievements.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Achievements</h3>
              <div className="flex flex-wrap gap-2">
                {achievements.map((achievement, idx) => (
                  <span 
                    key={idx} 
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center"
                  >
                    <span className="mr-1">⭐</span> {achievement}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={handleShare} 
              className="border-gray-300"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Score
            </Button>
            <Button 
              onClick={onRestart} 
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverModal;
