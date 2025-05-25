
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MIN_LEVEL_FOR_TIME_CHALLENGE } from '@/types/game';

interface ScoreBoardProps {
  score: number;
  level: number;
  highScore: number;
  timeSinceLastWord: number;
  getMaxTimeBetweenWords: () => number;
}

const ScoreBoard = ({ 
  score, 
  level, 
  highScore, 
  timeSinceLastWord, 
  getMaxTimeBetweenWords 
}: ScoreBoardProps) => {
  return (
    <div className="space-y-3">
      {/* Score and Level */}
      <div className="flex justify-between gap-4">
        <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
          <p className="text-xs text-gray-400">Score</p>
          <p className="text-xl font-semibold text-white">{score}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
          <p className="text-xs text-gray-400">Level</p>
          <p className="text-xl font-semibold text-white">{level}</p>
        </div>
      </div>

      {/* High Score */}
      <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
        <p className="text-xs text-gray-400">High Score</p>
        <p className="text-xl font-semibold text-white">{highScore}</p>
      </div>
      
      {/* Time Challenge */}
      {level >= MIN_LEVEL_FOR_TIME_CHALLENGE && (
        <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
          <p className="text-xs text-gray-400">Time to form word</p>
          <div className="w-full bg-gray-700 h-2 rounded-full mt-1 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-linear ${
                timeSinceLastWord > getMaxTimeBetweenWords() * 0.7 
                  ? "bg-red-500" 
                  : timeSinceLastWord > getMaxTimeBetweenWords() * 0.4 
                  ? "bg-yellow-500" 
                  : "bg-green-500"
              }`}
              style={{ 
                width: `${Math.min(100, (timeSinceLastWord / getMaxTimeBetweenWords()) * 100)}%` 
              }}
            ></div>
          </div>
          <p className="text-xs mt-1 text-gray-300">
            {Math.max(0, Math.ceil(getMaxTimeBetweenWords() - timeSinceLastWord))}s left
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(ScoreBoard);
