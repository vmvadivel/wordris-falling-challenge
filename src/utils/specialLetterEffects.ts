
import { Position } from "@/types/game";

interface SpecialLetterEffectResult {
  hasAppliedEffect: boolean;
  scoreMultiplier: number;
}

/**
 * Process special letter effects more efficiently using a Map for O(1) lookups
 */
export const processSpecialLetterEffects = (
  word: string,
  positions: Position[],
  grid: string[][],
  callbacks: {
    setTimeFreeze: (value: boolean) => void;
    setTimeFreezeTimer: (value: number | null) => void;
    setGrid: (updater: (prevGrid: string[][]) => string[][]) => void;
    setPointMultiplier: (value: number) => void;
  }
): SpecialLetterEffectResult => {
  // Use a Map for fast lookups of special letter effects
  const specialLetters = new Map([
    ['Q', handleTimeFreezeEffect],
    ['Z', handleColumnClearEffect],
    ['X', handleRowClearEffect],
    ['J', handleDoubleScoreEffect],
    ['P', handlePointMultiplierEffect],
    ['V', handleVowelSwapEffect],
    ['Y', handleWildcardEffect],
  ]);
  
  let scoreMultiplier = 1;
  let hasAppliedEffect = false;
  const wordLength = word.length;
  
  // Process each letter in the word
  for (const char of word.split('')) {
    const effect = specialLetters.get(char);
    if (!effect) continue;
    
    // Find position of this letter in the grid
    const position = positions.find(pos => grid[pos.row][pos.col] === char);
    if (!position && char !== 'J' && char !== 'P' && char !== 'V' && char !== 'Y') continue;
    
    const result = effect(position, callbacks, wordLength, grid);
    
    if (result.scoreMultiplier > 1) {
      scoreMultiplier *= result.scoreMultiplier;
    }
    
    if (result.hasAppliedEffect) {
      hasAppliedEffect = true;
    }
  }
  
  return { hasAppliedEffect, scoreMultiplier };
};

// Individual effect handlers
function handleTimeFreezeEffect(_position: Position | undefined, callbacks: any): SpecialLetterEffectResult {
  const { setTimeFreeze, setTimeFreezeTimer } = callbacks;
  
  setTimeFreeze(true);
  
  // Clear any existing timer
  const timer = window.setTimeout(() => {
    setTimeFreeze(false);
    setTimeFreezeTimer(null);
  }, 5000);
  
  setTimeFreezeTimer(timer);
  
  return { hasAppliedEffect: true, scoreMultiplier: 1 };
}

function handleColumnClearEffect(position: Position | undefined, callbacks: any, wordLength: number = 3, grid: string[][]): SpecialLetterEffectResult {
  if (!position) return { hasAppliedEffect: false, scoreMultiplier: 1 };
  
  const { setGrid } = callbacks;
  
  setGrid(prevGrid => {
    const newGrid = [...prevGrid];
    
    if (wordLength >= 5) {
      // Clear 4 random columns for words of 5+ letters
      const availableColumns = Array.from({ length: newGrid[0].length }, (_, i) => i);
      const columnsTooClear = [];
      
      // Randomly select 4 columns
      for (let i = 0; i < Math.min(4, availableColumns.length); i++) {
        const randomIndex = Math.floor(Math.random() * availableColumns.length);
        columnsTooClear.push(availableColumns.splice(randomIndex, 1)[0]);
      }
      
      // Clear the selected columns
      columnsTooClear.forEach(col => {
        for (let row = 0; row < newGrid.length; row++) {
          newGrid[row][col] = null;
        }
      });
    } else {
      // Clear the single column for words of 3-4 letters (existing behavior)
      for (let row = 0; row < newGrid.length; row++) {
        newGrid[row][position.col] = null;
      }
    }
    
    return newGrid;
  });
  
  return { hasAppliedEffect: true, scoreMultiplier: 1 };
}

function handleRowClearEffect(position: Position | undefined, callbacks: any, wordLength: number = 3, grid: string[][]): SpecialLetterEffectResult {
  if (!position) return { hasAppliedEffect: false, scoreMultiplier: 1 };
  
  const { setGrid } = callbacks;
  
  setGrid(prevGrid => {
    const newGrid = [...prevGrid];
    
    if (wordLength >= 5) {
      // Clear top 4 rows for words of 5+ letters
      for (let row = 0; row < Math.min(4, newGrid.length); row++) {
        for (let col = 0; col < newGrid[row].length; col++) {
          newGrid[row][col] = null;
        }
      }
    } else {
      // Clear the single row for words of 3-4 letters
      for (let col = 0; col < newGrid[position.row].length; col++) {
        newGrid[position.row][col] = null;
      }
    }
    
    return newGrid;
  });
  
  return { hasAppliedEffect: true, scoreMultiplier: 1 };
}

function handleDoubleScoreEffect(_position: Position | undefined, _callbacks: any): SpecialLetterEffectResult {
  return { hasAppliedEffect: true, scoreMultiplier: 2 };
}

function handlePointMultiplierEffect(_position: Position | undefined, callbacks: any): SpecialLetterEffectResult {
  const { setPointMultiplier } = callbacks;
  setPointMultiplier(3);
  
  return { hasAppliedEffect: true, scoreMultiplier: 1 };
}

function handleVowelSwapEffect(_position: Position | undefined, _callbacks: any): SpecialLetterEffectResult {
  // This would need UI implementation to be effective
  return { hasAppliedEffect: true, scoreMultiplier: 1 };
}

function handleWildcardEffect(_position: Position | undefined, _callbacks: any): SpecialLetterEffectResult {
  // This is applied during word validation
  return { hasAppliedEffect: true, scoreMultiplier: 1 };
}
