
import React, { useRef, useCallback } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useGameLogic } from "@/hooks/useGameLogic";
import { useWordrisGameLoop } from "@/hooks/useWordrisGameLoop";
import GameBoard from "@/components/GameBoard";
import ControlPanel from "@/components/ControlPanel";
import SpecialLettersModal from "@/components/SpecialLettersModal";
import GameOverModal from "@/components/GameOverModal";
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
    <div className="min-h-screen h-screen bg-gray-950 flex flex-col items-center p-4 md:py-6 overflow-hidden">
      {/* Title Section */}
      <div className="text-center mb-4 md:mb-8 w-full max-w-6xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Wordris</h1>    
      </div>

      {/* Game Container */}
      <div className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row gap-4 justify-center items-stretch">
        {/* Game Grid */}
        <GameBoard 
          grid={gameState.grid}
          fallingLetters={gameState.fallingLetters}
          selectedCells={gameState.selectedCells}
          onCellClick={gameLogic.handleCellClick}
          pointMultiplier={gameState.pointMultiplier}
          gridRef={gridRef}
        />

        {/* Control Panel */}
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

      <Footer />
    </div>
  );
};

export default Index;
