
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Check, RotateCw, X, Zap } from 'lucide-react';

interface GameControlsProps {
  currentWord: string;
  onClearWord: () => void;
  onSubmitWord: () => void;
  onResetGame: () => void;
  onShowSpecialLetters: () => void;
  wordBoxRef: React.RefObject<HTMLDivElement>;
}

const GameControls = ({ 
  currentWord, 
  onClearWord, 
  onSubmitWord, 
  onResetGame, 
  onShowSpecialLetters,
  wordBoxRef 
}: GameControlsProps) => {
  return (
    <div className="space-y-3">
      {/* Current Word */}
      <div className="space-y-1">
        <p className="text-sm text-gray-400">Current Word</p>
        <div ref={wordBoxRef} className="flex gap-2 items-center">
          <div className="p-2 bg-gray-800 rounded-md text-white font-medium text-center flex-1">
            {currentWord || "-"}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border-gray-700"
            onClick={onClearWord}
          >
            <X className="h-4 w-4 text-white" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border-gray-700"
            onClick={onSubmitWord}
          >
            <Check className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 pb-4 md:pb-4 mt-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-purple-900 border-gray-700 shadow-md"
          onClick={onShowSpecialLetters}
        >
          <Zap className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-blue-900 border-gray-700 shadow-md"
          onClick={onResetGame}
        >
          <RotateCw className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
        </Button>
      </div>
    </div>
  );
};

export default memo(GameControls);
