
import React, { memo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, RotateCw, X, Zap, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MIN_LEVEL_FOR_TIME_CHALLENGE } from '@/types/game';

interface ControlPanelProps {
  score: number;
  level: number;
  highScore: number;
  timeSinceLastWord: number;
  getMaxTimeBetweenWords: () => number;
  currentWord: string;
  onClearWord: () => void;
  onSubmitWord: () => void;
  onResetGame: () => void;
  onShowSpecialLetters: () => void;
  wordBoxRef: React.RefObject<HTMLDivElement>;
}

const ControlPanel = (props: ControlPanelProps) => {
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <>
      <Card className="w-full lg:w-1/4 xl:w-72 bg-gray-900 border-gray-800 flex flex-col self-stretch lg:self-center max-h-[min(450px,65vh)] lg:max-h-[min(calc(100vh_-_14rem),650px)]">
        <CardContent className="space-y-3 flex-1 py-2 flex flex-col justify-between">
          {/* Current Word Section */}
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Current Word</p>
              <div ref={props.wordBoxRef} className="flex gap-2 items-center">
                <div className="p-2 bg-gray-800 rounded-md text-white font-medium text-center flex-1">
                  {props.currentWord || "-"}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border-gray-700"
                  onClick={props.onClearWord}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border-gray-700"
                  onClick={props.onSubmitWord}
                >
                  <Check className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          </div>

          {/* Score Section */}
          <div className="space-y-3">
            {/* Score and Level */}
            <div className="flex justify-between gap-4">
              <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
                <p className="text-xs text-gray-400">Score</p>
                <p className="text-xl font-semibold text-white">{props.score}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
                <p className="text-xs text-gray-400">Level</p>
                <p className="text-xl font-semibold text-white">{props.level}</p>
              </div>
            </div>

            {/* High Score */}
            <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
              <p className="text-xs text-gray-400">High Score</p>
              <p className="text-xl font-semibold text-white">{props.highScore}</p>
            </div>
            
            {/* Time Challenge */}
            {props.level >= MIN_LEVEL_FOR_TIME_CHALLENGE && (
              <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
                <p className="text-xs text-gray-400">Time to form word</p>
                <div className="w-full bg-gray-700 h-2 rounded-full mt-1 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-linear ${
                      props.timeSinceLastWord > props.getMaxTimeBetweenWords() * 0.7 
                        ? "bg-red-500" 
                        : props.timeSinceLastWord > props.getMaxTimeBetweenWords() * 0.4 
                        ? "bg-yellow-500" 
                        : "bg-green-500"
                    }`}
                    style={{ 
                      width: `${Math.min(100, (props.timeSinceLastWord / props.getMaxTimeBetweenWords()) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-300">
                  {Math.max(0, Math.ceil(props.getMaxTimeBetweenWords() - props.timeSinceLastWord))}s left
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-center gap-3 pb-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-purple-900 border-gray-700 shadow-md"
                onClick={props.onShowSpecialLetters}
              >
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-blue-900 border-gray-700 shadow-md"
                onClick={props.onResetGame}
              >
                <RotateCw className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-green-900 border-gray-700 shadow-md"
                onClick={() => setShowHelpModal(true)}
              >
                <HelpCircle className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">How to Play Wordris</DialogTitle>
            <DialogDescription className="text-gray-300">
              Learn the basics of this exciting word-building puzzle game!
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 text-gray-200">
            <section>
              <h3 className="text-lg font-semibold text-white mb-2">🎯 Objective</h3>
              <p>Form valid English words by clicking on letter tiles as they fall down the grid. Score points and advance through levels while racing against time!</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-2">🎮 How to Play</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Click letters</strong> to select them and build words</li>
                <li><strong>Submit words</strong> using the checkmark button or press Enter</li>
                <li><strong>Clear selection</strong> using the X button or press Escape</li>
                <li><strong>Form longer words</strong> to earn more points</li>
                <li><strong>Use special letters</strong> (⚡ button) for bonus effects</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-2">⚡ Special Letters</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Double Score (2x):</strong> Doubles your word score</li>
                <li><strong>Triple Score (3x):</strong> Triples your word score</li>
                <li><strong>Wildcard (★):</strong> Can be any letter you need</li>
                <li><strong>Time Bonus (+T):</strong> Adds extra time to the clock</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-2">⏰ Time Challenge</h3>
              <p>Starting at level 3, you'll need to form words within a time limit. The bar at the bottom shows your remaining time - don't let it run out!</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-2">🏆 Scoring</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Longer words = higher scores</li>
                <li>Special letters multiply your points</li>
                <li>Quick word formation earns time bonuses</li>
                <li>Beat your high score and unlock achievements!</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-2">💡 Tips</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Look for common word endings like -ING, -ED, -ER</li>
                <li>Save special letters for longer words</li>
                <li>Don't rush - accuracy is better than speed</li>
                <li>Use the reset button if you get stuck</li>
              </ul>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(ControlPanel);
