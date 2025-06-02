
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

        // Handle landed letters with improved game over detection
        if (landedLetters.length > 0) {
          gameState.setGrid((oldGrid: any) => {
            const newGrid = oldGrid.map((row: any) => [...row]);
            landedLetters.forEach((l: any) => {
              newGrid[l.row][l.col] = l.letter;
            });

            // Improved game over check - ensure we actually can't place new letters
            const canPlaceNewLetters = newGrid[0].some((cell: any) => cell === null);
            const hasRoomForFalling = updatedLetters.length < 3 && canPlaceNewLetters;
            
            if (isGridFull(newGrid) && !hasRoomForFalling) {
              // Double-check by verifying no movement is possible
              let canAnyLetterMove = false;
              for (let row = 0; row < newGrid.length - 1; row++) {
                for (let col = 0; col < newGrid[0].length; col++) {
                  if (newGrid[row][col] !== null && newGrid[row + 1][col] === null) {
                    canAnyLetterMove = true;
                    break;
                  }
                }
                if (canAnyLetterMove) break;
              }
              
              if (!canAnyLetterMove && isGridFull(newGrid)) {
                gameState.endGame();
              }
            }

            return newGrid;
          });
        }

        // Update selected cells positions for falling letters
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

    // Improved spawning logic with better collision detection
    if (gameState.fallingLetters.length < 3 && Math.random() < 0.03 && gameLogic.availableColumns.length > 0) {
      // Check if there's actually room for a new letter
      const hasSpaceForNewLetter = gameLogic.availableColumns.some((col: number) => {
        return !gameState.fallingLetters.some((fl: any) => fl.col === col && fl.row === 0);
      });
      
      if (hasSpaceForNewLetter) {
        gameLogic.spawnNewLetter();
      }
    }
  }, [gameState, gameLogic]);

  const animationRef = useGameLoop({
    onTick: gameLoopFn,
    isActive: gameState.gameActive && !gameState.timeFreeze,
    frameSkip: 1
  });

  return animationRef;
};
