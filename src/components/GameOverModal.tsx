
import React, { useEffect } from "react";
import { Trophy, RotateCw, Share2, X, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GameStats } from "@/types/game";

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  stats: GameStats;
  onOpenChange?: (open: boolean) => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  stats,
  onOpenChange,
}) => {
  // Log when props change to track modal visibility
  useEffect(() => {
    console.log("### GameOverModal received isOpen:", isOpen);
  }, [isOpen]);

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

  // Determine which achievements to show (commented out for now)
  /*
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
  */

  // Handle dialog close and restart game
  const handleDialogChange = (open: boolean) => {
    console.log("### GameOverModal handleDialogChange called with open:", open);
    
    // Only restart the game when intentionally closing the dialog
    if (!open) {
      onClose();
    }
    
    // Call the parent's onOpenChange handler if provided
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  console.log("### GameOverModal rendering with isOpen:", isOpen);

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="bg-white text-black w-[90%] max-w-md mx-auto p-0 overflow-hidden rounded-xl">
          <DialogHeader className="pt-8 pb-2 px-6 relative">
            <DialogDescription className="sr-only">
              Game over details and statistics
            </DialogDescription>
            
            {/* Animated Trophy Icon */}
            <div className="flex items-center justify-center mb-4 relative">
              <div className="trophy-container relative">
                <Trophy className="h-12 w-12 text-yellow-400 trophy-icon" />
                {/* Sparkle animations */}
                <div className="sparkle sparkle-1"></div>
                <div className="sparkle sparkle-2"></div>
                <div className="sparkle sparkle-3"></div>
                <div className="sparkle sparkle-4"></div>
              </div>
            </div>
            
            <DialogTitle className="text-2xl font-bold text-center text-black mb-1">Game Over!</DialogTitle>
            <p className="text-center text-gray-600">
              Your final score is <span className="font-bold text-gray-700">{stats.score}</span> points at level <span className="font-bold text-gray-700">{stats.level}</span>
            </p>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {/* Statistics Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3">Game Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Final Score:</span>
                  <span className="font-bold">{stats.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Level Reached:</span>
                  <span className="font-bold">{stats.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Time Played:</span>
                  <span className="font-bold">{formatTime(stats.timeElapsed)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Words Formed:</span>
                  <span className="font-bold">{stats.wordsFormed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Letters Placed:</span>
                  <span className="font-bold">{stats.lettersPlaced || 0}</span>
                </div>
                
                {/* Signature Word with Tooltip */}
                {stats.signatureWord && (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-green-600 font-medium">Signature Word:</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-3 w-3 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">
                            Your highest-scoring single word during this game session. 
                            This includes base letter points, rarity bonuses, and any special effects.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="font-bold text-green-600">
                      {stats.signatureWord.word.toUpperCase()} ({stats.signatureWord.score}pts)
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Achievements Section - Commented out but easy to re-enable */}
            {/*
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
            */}
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              <Button 
                onClick={onRestart} 
                className="bg-gray-900 hover:bg-gray-800 text-white py-3"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </div>
          </div>
          
          {/* CSS for trophy animation */}
          <style jsx>{`
            .trophy-container {
              position: relative;
              animation: trophy-bounce 2s ease-in-out infinite;
            }
            
            .trophy-icon {
              filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.3));
            }
            
            .sparkle {
              position: absolute;
              width: 4px;
              height: 4px;
              background: linear-gradient(45deg, #fbbf24, #f59e0b);
              border-radius: 50%;
              animation: sparkle 2s linear infinite;
            }
            
            .sparkle-1 {
              top: -8px;
              left: -8px;
              animation-delay: 0s;
            }
            
            .sparkle-2 {
              top: -8px;
              right: -8px;
              animation-delay: 0.5s;
            }
            
            .sparkle-3 {
              bottom: -8px;
              left: -8px;
              animation-delay: 1s;
            }
            
            .sparkle-4 {
              bottom: -8px;
              right: -8px;
              animation-delay: 1.5s;
            }
            
            @keyframes trophy-bounce {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-4px) scale(1.05); }
            }
            
            @keyframes sparkle {
              0%, 100% { 
                opacity: 0; 
                transform: scale(0) rotate(0deg);
              }
              50% { 
                opacity: 1; 
                transform: scale(1) rotate(180deg);
              }
            }
            
            /* Respect reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
              .trophy-container {
                animation: none;
              }
              .sparkle {
                animation: none;
                opacity: 0.3;
              }
            }
          `}</style>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default GameOverModal;
