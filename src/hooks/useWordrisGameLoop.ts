
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

        // Handle landed letters with improved synchronization
        if (landedLetters.length > 0) {
          // Update grid with landed letters in a single operation
          gameState.setGrid((oldGrid: any) => {
            const newGrid = oldGrid.map((row: any) => [...row]);
            landedLetters.forEach((l: any) => {
              if (l.row >= 0 && l.row < newGrid.length && l.col >= 0 && l.col < newGrid[0].length) {
                newGrid[l.row][l.col] = l.letter;
              }
            });

            // Improved game over detection with better state checking
            const hasActiveMovement = updatedLetters.length > 0;
            const canPlaceNewLetters = newGrid[0].some((cell: any) => cell === null);
            
            // Only check for game over if grid is actually full and no movement possible
            if (isGridFull(newGrid) && !hasActiveMovement && !canPlaceNewLetters) {
              // Final verification: check if any letters can actually move
              let hasMovableLetter = false;
              for (let row = 0; row < newGrid.length - 1 && !hasMovableLetter; row++) {
                for (let col = 0; col < newGrid[0].length && !hasMovableLetter; col++) {
                  if (newGrid[row][col] !== null && newGrid[row + 1][col] === null) {
                    hasMovableLetter = true;
                  }
                }
              }
              
              if (!hasMovableLetter) {
                // Use setTimeout to prevent state update conflicts
                setTimeout(() => gameState.endGame(), 0);
              }
            }

            return newGrid;
          });
        }

        // Update selected cells positions for falling letters with better synchronization
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

    // Improved spawning logic with better collision detection and state validation
    if (gameState.fallingLetters.length < 3 && Math.random() < 0.03 && gameLogic.availableColumns.length > 0) {
      // Enhanced space checking that considers current falling letters
      const hasSpaceForNewLetter = gameLogic.availableColumns.some((col: number) => {
        const hasExistingFallingLetter = gameState.fallingLetters.some((fl: any) => 
          fl.col === col && fl.row === 0
        );
        const hasGridLetter = gameState.grid[0][col] !== null;
        return !hasExistingFallingLetter && !hasGridLetter;
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
