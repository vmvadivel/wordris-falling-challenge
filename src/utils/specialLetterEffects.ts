
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
    ['X', handleAreaClearEffect],
    ['J', handleDoubleScoreEffect],
    ['P', handlePointMultiplierEffect],
    ['V', handleVowelSwapEffect],
    ['Y', handleWildcardEffect],
  ]);
  
  let scoreMultiplier = 1;
  let hasAppliedEffect = false;
  
  // Process each letter in the word
  for (const char of word.split('')) {
    const effect = specialLetters.get(char);
    if (!effect) continue;
    
    // Find position of this letter in the grid
    const position = positions.find(pos => grid[pos.row][pos.col] === char);
    if (!position && char !== 'J' && char !== 'P' && char !== 'V' && char !== 'Y') continue;
    
    const result = effect(position, callbacks);
    
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

function handleColumnClearEffect(position: Position | undefined, callbacks: any): SpecialLetterEffectResult {
  if (!position) return { hasAppliedEffect: false, scoreMultiplier: 1 };
  
  const { setGrid } = callbacks;
  
  setGrid(prevGrid => {
    const newGrid = [...prevGrid];
    // Clear the entire column
    for (let row = 0; row < newGrid.length; row++) {
      newGrid[row][position.col] = null;
    }
    return newGrid;
  });
  
  return { hasAppliedEffect: true, scoreMultiplier: 1 };
}

function handleAreaClearEffect(position: Position | undefined, callbacks: any): SpecialLetterEffectResult {
  if (!position) return { hasAppliedEffect: false, scoreMultiplier: 1 };
  
  const { setGrid } = callbacks;
  
  setGrid(prevGrid => {
    const newGrid = [...prevGrid];
    // Clear the 8 adjacent cells (if they exist)
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r === 0 && c === 0) continue; // Skip the center cell (X itself)
        
        const newRow = position.row + r;
        const newCol = position.col + c;
        
        // Check if the position is valid
        if (newRow >= 0 && newRow < newGrid.length && 
            newCol >= 0 && newCol < newGrid[0].length) {
          newGrid[newRow][newCol] = null;
        }
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
