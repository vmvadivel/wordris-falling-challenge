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
      <Card className="w-full bg-gray-900 border-gray-800">
        <CardContent className="py-4 px-4 flex flex-col gap-4">
          {/* Current Word Section */}
          <div>
            <p className="text-sm text-gray-400 mb-1">Current Word</p>
            <div ref={props.wordBoxRef} className="flex gap-2 items-center">
              <div className="p-2 bg-gray-800 rounded-md text-white font-medium text-center flex-1 min-w-0">
                {props.currentWord || "-"}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border-gray-700 flex-shrink-0"
                onClick={props.onClearWord}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border-gray-700 flex-shrink-0"
                onClick={props.onSubmitWord}
              >
                <Check className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex gap-2">
            <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
              <p className="text-xs text-gray-400">Score</p>
              <p className="text-xl font-semibold text-white">{props.score}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
              <p className="text-xs text-gray-400">Level</p>
              <p className="text-xl font-semibold text-white">{props.level}</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
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
                    width: `${Math.min(
                      100,
                      (props.timeSinceLastWord / props.getMaxTimeBetweenWords()) * 100
                    )}%`
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
            <div className="flex justify-center gap-2 pt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-gray-800 hover:bg-purple-900 border-gray-700 shadow-md flex-shrink-0"
                    onClick={props.onShowSpecialLetters}
                  >
                    <Zap className="h-4 w-4 text-purple-400" />
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
                    className="h-10 w-10 bg-gray-800 hover:bg-blue-900 border-gray-700 shadow-md flex-shrink-0"
                    onClick={props.onResetGame}
                  >
                    <RotateCw className="h-4 w-4 text-blue-400" />
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
                    className="h-10 w-10 bg-gray-800 hover:bg-green-900 border-gray-700 shadow-md flex-shrink-0"
                    onClick={() => setShowHelpModal(true)}
                  >
                    <HelpCircle className="h-4 w-4 text-green-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How to Play</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      <HelpModal open={showHelpModal} onOpenChange={setShowHelpModal} />
    </>
  );
};

export default memo(ControlPanel);
