
import { useCallback, useEffect, useMemo } from 'react';
import { Position } from '@/types/game';
import { 
  isValidWord, 
  calculateWordScore, 
  clearWordCache 
} from '@/utils/dictionaryService';
import { 
  getUpdatedGrid, 
  isGridFull,
  getAvailableColumns,
  clearCanLetterFallCache,
  canLetterFall
} from '@/utils/gridUtils';
import { addShakeAnimation, highlightCells } from '@/utils/animationUtils';
import { showWordValidationToast } from '@/utils/toastUtils';
import { processSpecialLetterEffects } from '@/utils/specialLetterEffects';
import { toast } from '@/hooks/use-toast';
import { POINTS_PER_LEVEL, MIN_LEVEL_FOR_TIME_CHALLENGE } from '@/types/game';

const letterFrequencies: { [letter: string]: number } = {
  E: 12, T: 9, A: 8, O: 8, I: 7, N: 7, S: 6, H: 6, R: 6, D: 4,
  L: 4, C: 3, U: 3, M: 2, W: 2, F: 2, G: 2, Y: 2, P: 2, B: 1,
  V: 1, K: 1, J: 0.5, X: 0.5, Q: 0.3, Z: 0.3,
};

const getRandomLetter = (): string => {
  const letters = Object.keys(letterFrequencies);
  const weights = letters.map(l => letterFrequencies[l]);
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;

  for (let i = 0; i < letters.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return letters[i];
  }
  return "E";
};

export const useGameLogic = (gameState: any, gridRef: React.RefObject<HTMLDivElement>, wordBoxRef: React.RefObject<HTMLDivElement>) => {
  // Memoize available columns for spawning
  const availableColumns = useMemo(() => {
    return getAvailableColumns(gameState.grid);
  }, [gameState.grid]);
  
  // Improved grid fullness check that considers falling letters
  const gridIsFull = useMemo(() => {
    const currentGrid = gameState.grid.map((row: any) => [...row]);
    
    // Temporarily place falling letters to check true fullness
    gameState.fallingLetters.forEach((letter: any) => {
      if (letter.row >= 0 && letter.row < currentGrid.length && 
          letter.col >= 0 && letter.col < currentGrid[0].length) {
        currentGrid[letter.row][letter.col] = letter.letter;
      }
    });
    
    return isGridFull(currentGrid);
  }, [gameState.grid, gameState.fallingLetters]);

  // Calculate max time between words based on level
  const getMaxTimeBetweenWords = useCallback((): number => {
    if (gameState.level < MIN_LEVEL_FOR_TIME_CHALLENGE) return Infinity;
    return Math.max(10, 30 - ((gameState.level - MIN_LEVEL_FOR_TIME_CHALLENGE) * 5));
  }, [gameState.level]);

  // Spawn a new letter
  const spawnNewLetter = useCallback(() => {
    gameState.setFallingLetters((prev: any) => {
      if (prev.length >= 3) return prev;

      const currentAvailableColumns = availableColumns.filter(
        col => !prev.some((l: any) => l.col === col && l.row === 0)
      );
      if (currentAvailableColumns.length === 0) return prev;

      const randomCol = currentAvailableColumns[Math.floor(Math.random() * currentAvailableColumns.length)];
      return [
        ...prev,
        {
          letter: getRandomLetter(),
          col: randomCol,
          row: 0,
          id: Math.random().toString(36).substr(2, 9),
        }
      ];
    });
  }, [availableColumns, gameState.setFallingLetters]);

  // Apply special letter effects
  const applySpecialLetterEffects = useCallback((word: string, positions: Position[]) => {
    return processSpecialLetterEffects(word, positions, gameState.grid, {
      setTimeFreeze: gameState.setTimeFreeze,
      setTimeFreezeTimer: gameState.setTimeFreezeTimer,
      setGrid: gameState.setGrid,
      setPointMultiplier: gameState.setPointMultiplier
    });
  }, [gameState.grid, gameState.setTimeFreeze, gameState.setTimeFreezeTimer, gameState.setGrid, gameState.setPointMultiplier]);

  // Improved game over checks
  const checkGridOverflow = useCallback((): boolean => {
    return gridIsFull;
  }, [gridIsFull]);

  const checkTimeBetweenWords = useCallback((): boolean => {
    if (gameState.level < MIN_LEVEL_FOR_TIME_CHALLENGE) return false;
    return gameState.timeSinceLastWord >= getMaxTimeBetweenWords();
  }, [gameState.level, gameState.timeSinceLastWord, getMaxTimeBetweenWords]);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number, letter: string) => {
    if (!gameState.gameActive) return;
    
    const clickedPosition = { row, col };
    const cellIndex = gameState.selectedCells.findIndex((cell: any) => 
      cell.position.row === row && cell.position.col === col
    );
    
    if (cellIndex !== -1) {
      if (cellIndex === gameState.selectedCells.length - 1) {
        gameState.setSelectedCells((prev: any) => prev.slice(0, -1));
        gameState.setCurrentWord((prev: string) => prev.slice(0, -1));
      } else if (cellIndex >= 0) {
        gameState.setSelectedCells((prev: any) => prev.slice(0, cellIndex + 1));
        gameState.setCurrentWord((prev: string) => prev.slice(0, cellIndex + 1));
      }
      return;
    }
    
    const newSelectedCell = { letter, position: clickedPosition };
    gameState.setSelectedCells((prev: any) => [...prev, newSelectedCell]);
    gameState.setCurrentWord((prev: string) => prev + letter);
  }, [gameState.gameActive, gameState.selectedCells, gameState.setSelectedCells, gameState.setCurrentWord]);

  // Submit word with improved state synchronization
  const submitWord = useCallback(() => {
    if (gameState.selectedCells.length < 3) {
      toast({
        title: "Word too short",
        description: "Words must be at least 3 letters long",
        variant: "destructive"
      });
      
      if (wordBoxRef.current) {
        addShakeAnimation(wordBoxRef.current);
      }
      gameState.clearWord();
      return;
    }

    const word = gameState.currentWord;
    const positions = gameState.selectedCells.map((cell: any) => cell.position);
    
    if (isValidWord(word)) {
      const { totalScore, baseScore, rarityBonus } = calculateWordScore(word);
      const effects = applySpecialLetterEffects(word, positions);
      const newConsecutiveWords = gameState.consecutiveWords + 1;
      const comboBonus = newConsecutiveWords > 1 ? newConsecutiveWords * 5 : 0;
      const effectMultiplier = effects.scoreMultiplier || 1;
      const currentPointMultiplier = gameState.pointMultiplier;
      const bonusPoints = effects.bonusPoints || 0;
      const finalScore = (totalScore + comboBonus + bonusPoints) * effectMultiplier * currentPointMultiplier;
      
      gameState.setLettersPlaced((prev: number) => prev + positions.length);
      
      if (!gameState.bestWord || finalScore > gameState.bestWord.score) {
        gameState.setBestWord({
          word: word,
          score: finalScore
        });
      }
      
      gameState.setScore((prev: number) => prev + finalScore);
      gameState.setConsecutiveWords(newConsecutiveWords);
      gameState.setWordsFormed((prev: number) => prev + 1);
      gameState.setTimeSinceLastWord(0);
      
      highlightCells(positions, true, gridRef.current);
      showWordValidationToast(word, { 
        isValid: true, 
        score: finalScore,
        baseScore,
        rarityBonus,
        bonusPoints
      }, newConsecutiveWords);
      
      if (currentPointMultiplier > 1) {
        gameState.setPointMultiplier(1);
      }
      
      // Improved grid update with proper synchronization
      gameState.setGrid((prev: any) => {
        const updatedGrid = getUpdatedGrid(prev, positions);
        
        // Remove any falling letters that were part of the submitted word
        gameState.setFallingLetters((currentFallingLetters: any) => {
          return currentFallingLetters.filter((fallingLetter: any) => {
            return !positions.some(pos => 
              pos.row === fallingLetter.row && pos.col === fallingLetter.col
            );
          });
        });
        
        return updatedGrid;
      });
      
      gameState.clearWord();
    } else {
      if (wordBoxRef.current) {
        addShakeAnimation(wordBoxRef.current);
      }
      gameState.clearWord();
      highlightCells(positions, false, gridRef.current);
      showWordValidationToast(word, { isValid: false }, 0);
      gameState.setConsecutiveWords(0);
    }
  }, [gameState, applySpecialLetterEffects, gridRef, wordBoxRef]);

  // Update drop speed based on level
  useEffect(() => {
    gameState.dropInterval.current = Math.max(300, 1000 - (gameState.level - 1) * 20);
  }, [gameState.level, gameState.dropInterval]);

  // Check for level up and high score
  useEffect(() => {
    if (gameState.score >= gameState.level * POINTS_PER_LEVEL) {
      gameState.setLevel((prev: number) => prev + 1);
    }
    gameState.setHighScore((prev: number) => Math.max(prev, gameState.score));
  }, [gameState.score, gameState.level, gameState.setLevel, gameState.setHighScore]);

  return {
    availableColumns,
    gridIsFull,
    getMaxTimeBetweenWords,
    spawnNewLetter,
    handleCellClick,
    submitWord,
    checkGridOverflow,
    checkTimeBetweenWords
  };
};
