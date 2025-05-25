
import React, { memo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, RotateCw, X, Zap, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MIN_LEVEL_FOR_TIME_CHALLENGE } from '@/types/game';
import HelpModal from '@/components/HelpModal';

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
            <TooltipProvider>
              <div className="flex justify-center gap-3 pb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-purple-900 border-gray-700 shadow-md"
                      onClick={props.onShowSpecialLetters}
                    >
                      <Zap className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Special Letters</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-blue-900 border-gray-700 shadow-md"
                      onClick={props.onResetGame}
                    >
                      <RotateCw className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset Game</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-green-900 border-gray-700 shadow-md"
                      onClick={() => setShowHelpModal(true)}
                    >
                      <HelpCircle className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>How to Play</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      {/* Help Modal */}
      <HelpModal 
        open={showHelpModal} 
        onOpenChange={setShowHelpModal}
      />
    </>
  );
};

export default memo(ControlPanel);
