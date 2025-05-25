
import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ScoreBoard from './ScoreBoard';
import GameControls from './GameControls';

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
  return (
    <Card className="w-full lg:w-1/4 xl:w-72 bg-gray-900 border-gray-800 flex flex-col self-stretch lg:self-center max-h-[min(450px,65vh)] lg:max-h-[min(calc(100vh_-_14rem),650px)]">
      <CardContent className="space-y-3 flex-1 py-2 flex flex-col justify-between">
        <GameControls 
          currentWord={props.currentWord}
          onClearWord={props.onClearWord}
          onSubmitWord={props.onSubmitWord}
          onResetGame={props.onResetGame}
          onShowSpecialLetters={props.onShowSpecialLetters}
          wordBoxRef={props.wordBoxRef}
        />
        
        <ScoreBoard 
          score={props.score}
          level={props.level}
          highScore={props.highScore}
          timeSinceLastWord={props.timeSinceLastWord}
          getMaxTimeBetweenWords={props.getMaxTimeBetweenWords}
        />
      </CardContent>
    </Card>
  );
};

export default memo(ControlPanel);
