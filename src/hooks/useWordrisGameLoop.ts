
import { useCallback } from 'react';
import { clearCanLetterFallCache, canLetterFall, isGridFull } from '@/utils/gridUtils';
import useGameLoop from '@/hooks/useGameLoop';

export const useWordrisGameLoop = (gameState: any, gameLogic: any) => {
  const gameLoopFn = useCallback((timestamp: number) => {
    if (!gameState.gameActive || gameState.timeFreeze) return;

    const elapsed = timestamp - gameState.lastDropTime.current;

    if (elapsed > gameState.dropInterval.current) {
      gameState.lastDropTime.current = timestamp;

      gameState.setTimeSinceLastWord((prev: number) => prev + (gameState.dropInterval.current / 1000));
      
      if (gameLogic.checkTimeBetweenWords()) {
        gameState.endGame();
        return;
      }

      clearCanLetterFallCache();

      gameState.setFallingLetters((prevLetters: any) => {
        let updatedLetters: any[] = [];
        let landedLetters: any[] = [];

        prevLetters.forEach((l: any) => {
          if (canLetterFall(gameState.grid, l.row, l.col, prevLetters, l.id)) {
            updatedLetters.push({ ...l, row: l.row + 1 });
          } else {
            landedLetters.push(l);
          }
        });

        if (landedLetters.length > 0) {
          gameState.setGrid((oldGrid: any) => {
            const newGrid = oldGrid.map((row: any) => [...row]);
            landedLetters.forEach((l: any) => {
              newGrid[l.row][l.col] = l.letter;
            });

            if (isGridFull(newGrid)) {
              gameState.endGame();
            }

            return newGrid;
          });
        }

        if (updatedLetters.length > 0) {
          gameState.setSelectedCells((prevSelectedCells: any) => {
            return prevSelectedCells.map((selectedCell: any) => {
              const matchingFallingLetter = prevLetters.find(
                (fl: any) => fl.row === selectedCell.position.row && fl.col === selectedCell.position.col
              );
              
              if (matchingFallingLetter) {
                const updatedLetter = updatedLetters.find((ul: any) => ul.id === matchingFallingLetter.id);
                if (updatedLetter) {
                  return {
                    ...selectedCell,
                    position: { row: updatedLetter.row, col: updatedLetter.col }
                  };
                }
              }
              return selectedCell;
            });
          });
        }

        return updatedLetters;
      });
    }

    if (gameState.fallingLetters.length < 3 && Math.random() < 0.03 && gameLogic.availableColumns.length > 0) {
      gameLogic.spawnNewLetter();
    }
  }, [gameState, gameLogic]);

  const animationRef = useGameLoop({
    onTick: gameLoopFn,
    isActive: gameState.gameActive && !gameState.timeFreeze,
    frameSkip: 1
  });

  return animationRef;
};
