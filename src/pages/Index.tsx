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
  const gridRef = useRef<HTMLDivElement>(null);
  const wordBoxRef = useRef<HTMLDivElement>(null);

  const gameState = useGameState();
  const gameLogic = useGameLogic(gameState, gridRef, wordBoxRef);

  useWordrisGameLoop(gameState, gameLogic);

  const handleGameOverClose = useCallback((open: boolean) => {
    gameState.setIsGameOver(open);
    if (!open) {
      gameState.resetGame();
    }
  }, [gameState]);

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-950"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      {/* Title Section */}
      <div className="text-center py-2 md:py-4 w-full flex-shrink-0 px-4">
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white">Wordris</h1>
      </div>

      {/* Game Container - Responsive Layout */}
      <div className="flex flex-col lg:flex-row flex-1 w-full max-w-6xl mx-auto gap-4 px-2 md:px-4 min-h-0 lg:items-center">
        {/* Game Grid */}
        <div className="flex-1 flex items-center justify-center min-h-0">
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
        <div className="w-full lg:w-80 max-w-full lg:max-w-xs flex-shrink-0 mt-4 lg:mt-0 overflow-y-auto pb-safe">
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

      {/* Footer */}
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
