
import React, { useRef, useCallback } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useWordrisGameLoop } from "@/hooks/useWordrisGameLoop";
import GameBoard from "@/components/GameBoard";
import ControlPanel from "@/components/ControlPanel";
import SpecialLettersModal from "@/components/SpecialLettersModal";
import GameOverModal from "@/components/GameOverModal";
import HelpModal from "@/components/HelpModal";
import Footer from "@/components/Footer";
import { SPECIAL_LETTERS } from "@/utils/specialLetters";

const Index = () => {
  // Refs for animation control
  const gridRef = useRef<HTMLDivElement>(null);
  const wordBoxRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks for state and logic
  const gameState = useGameState();
  const gameLogic = useGameLogic(gameState, gridRef, wordBoxRef);
  
  // Game loop
  useWordrisGameLoop(gameState, gameLogic);

  // Handle game over modal closing and game restart
  const handleGameOverClose = useCallback((open: boolean) => {
    gameState.setIsGameOver(open);
    if (!open) {
      gameState.resetGame();
    }
  }, [gameState]);
  
  return (
    <div className="min-h-screen h-screen bg-gray-950 flex flex-col overflow-hidden" style={{ paddingTop: 'var(--safe-area-inset-top)', paddingLeft: 'var(--safe-area-inset-left)', paddingRight: 'var(--safe-area-inset-right)' }}>
      {/* Title Section */}
      <div className="text-center py-2 md:py-4 w-full flex-shrink-0 px-4">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white">Wordris</h1>    
      </div>

      {/* Game Container - Responsive Layout */}
      <div className="flex-1 flex flex-col lg:flex-row mobile-landscape-row gap-2 md:gap-4 justify-center items-stretch px-2 md:px-4 min-h-0">
        {/* Game Grid */}
        <div className="flex-1 mobile-landscape-game-area flex items-center justify-center min-h-0">
          <GameBoard 
            grid={gameState.grid}
            fallingLetters={gameState.fallingLetters}
            selectedCells={gameState.selectedCells}
            onCellClick={gameLogic.handleCellClick}
            pointMultiplier={gameState.pointMultiplier}
            gridRef={gridRef}
          />
        </div>

        {/* Control Panel */}
        <div className="w-full lg:w-1/4 xl:w-72 mobile-landscape-controls flex-shrink-0">
          <ControlPanel 
            score={gameState.score}
            level={gameState.level}
            highScore={gameState.highScore}
            timeSinceLastWord={gameState.timeSinceLastWord}
            getMaxTimeBetweenWords={gameLogic.getMaxTimeBetweenWords}
            currentWord={gameState.currentWord}
            onClearWord={gameState.clearWord}
            onSubmitWord={gameLogic.submitWord}
            onResetGame={gameState.resetGame}
            onShowSpecialLetters={() => gameState.setShowSpecialLettersModal(true)}
            wordBoxRef={wordBoxRef}
          />
        </div>
      </div>
      
      {/* Footer - Always visible */}
      <Footer />
      
      {/* Modals */}
      <SpecialLettersModal
        open={gameState.showSpecialLettersModal}
        onOpenChange={gameState.setShowSpecialLettersModal}
        specialLetters={SPECIAL_LETTERS}
      />
      
      <GameOverModal 
        isOpen={gameState.isGameOver} 
        onOpenChange={handleGameOverClose}
        onClose={() => gameState.setIsGameOver(false)}
        onRestart={gameState.resetGame}
        stats={{
          score: gameState.score,
          level: gameState.level,
          highScore: gameState.highScore,
          wordsFormed: gameState.wordsFormed,
          timeElapsed: gameState.timeElapsed,
          lettersPlaced: gameState.lettersPlaced,
          signatureWord: gameState.bestWord,
          achievements: [
            ...(gameState.wordsFormed >= 5 ? ["Word Wizard"] : []),
            ...(gameState.lettersPlaced >= 50 ? ["Word Factory"] : []),
            ...(gameState.score >= 300 ? ["Score Master"] : [])
          ]
        }}
      />
    </div>
  );
};

export default Index;
