
import { Position } from "@/types/game";

// Get cells that will drop after removing selected cells
export const getCellsToUpdate = (grid: string[][], selectedPositions: Position[]): Position[] => {
  const cellsToUpdate: Position[] = [];
  const positionsSet = new Set(selectedPositions.map(p => `${p.row},${p.col}`));

  // For each column
  for (let col = 0; col < grid[0].length; col++) {
    let newRow = grid.length - 1;
    
    // Start from bottom, move upwards
    for (let row = grid.length - 1; row >= 0; row--) {
      const posKey = `${row},${col}`;
      
      // If this position is not being removed, it needs to be moved down
      if (!positionsSet.has(posKey) && grid[row][col] !== null) {
        if (newRow !== row) {
          cellsToUpdate.push({ row, col });
        }
        newRow--;
      }
    }
  }

  return cellsToUpdate;
};

// Update the grid after removing selected cells with improved validation
export const getUpdatedGrid = (
  grid: string[][], 
  selectedPositions: Position[]
): string[][] => {
  if (!grid || !selectedPositions || selectedPositions.length === 0) {
    return grid;
  }

  const newGrid = grid.map(row => [...row]);
  const selectedPosSet = new Set(selectedPositions.map(p => `${p.row},${p.col}`));
  
  // First mark selected positions as null with bounds checking
  selectedPositions.forEach(pos => {
    if (pos.row >= 0 && pos.row < newGrid.length && 
        pos.col >= 0 && pos.col < newGrid[0].length) {
      newGrid[pos.row][pos.col] = null;
    }
  });
  
  // For each column, shift cells down
  for (let col = 0; col < newGrid[0].length; col++) {
    const letters: string[] = [];
    
    // Collect all letters in this column that aren't removed
    for (let row = 0; row < newGrid.length; row++) {
      const posKey = `${row},${col}`;
      if (!selectedPosSet.has(posKey) && newGrid[row][col] !== null) {
        letters.push(newGrid[row][col] as string);
      }
    }
    
    // Fill the column from bottom up
    let currentRow = newGrid.length - 1;
    while (letters.length > 0) {
      newGrid[currentRow][col] = letters.pop() as string;
      currentRow--;
    }
    
    // Fill the rest with null
    while (currentRow >= 0) {
      newGrid[currentRow][col] = null;
      currentRow--;
    }
  }
  
  return newGrid;
};

// Define the type for our canLetterFall function that includes the cache property
interface CanLetterFallFunction {
  (grid: string[][], row: number, col: number, fallingLetters: { row: number; col: number; id: string }[], currentLetterId: string): boolean;
  cache?: Map<string, boolean>;
}

// Determine if a letter can move down, dealing with proper stacking
// Now with more efficient caching and validation
export const canLetterFall: CanLetterFallFunction = (
  grid: string[][], 
  row: number, 
  col: number, 
  fallingLetters: { row: number; col: number; id: string }[],
  currentLetterId: string
): boolean => {
  // Enhanced bounds checking
  if (!grid || row < 0 || col < 0 || row >= grid.length - 1 || col >= grid[0].length) {
    return false;
  }

  // Create a cache key for the current call
  const cacheKey = `${row},${col},${currentLetterId}`;
  
  // Check if we've already computed this result
  if (!canLetterFall.cache) {
    canLetterFall.cache = new Map();
  }
  
  if (canLetterFall.cache.has(cacheKey)) {
    return canLetterFall.cache.get(cacheKey) as boolean;
  }
  
  // Check if cell below is empty on the grid
  if (grid[row + 1][col] !== null) {
    canLetterFall.cache.set(cacheKey, false);
    return false;
  }
  
  // Check for other falling letters in the position below
  const letterBelow = fallingLetters.find(l => l.col === col && l.row === row + 1);
  
  if (!letterBelow) {
    canLetterFall.cache.set(cacheKey, true);
    return true;
  }
  
  // If there's a letter below, check if it's also going to fall this frame
  const result = canLetterFall(grid, row + 1, col, fallingLetters.filter(l => l.id !== letterBelow.id), currentLetterId);
  canLetterFall.cache.set(cacheKey, result);
  return result;
};

// Clear the cache for canLetterFall - optimized to prevent memory leaks
export const clearCanLetterFallCache = (): void => {
  if (canLetterFall.cache) {
    canLetterFall.cache.clear();
  }
};

// Improved game over detection with enhanced validation
export const isGridFull = (grid: string[][]): boolean => {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return false;
  }

  // Game is over when the entire top row has content (no null cells)
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === null) {
      return false; // Found an empty space in top row
    }
  }
  
  // Additional validation: check if any movement is possible
  for (let row = 0; row < grid.length - 1; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] !== null && grid[row + 1][col] === null) {
        return false; // Letters can still move down
      }
    }
  }
  
  return true; // Top row is completely full and no movement possible
};

// Get all available columns for spawning new letters with enhanced validation
export const getAvailableColumns = (grid: string[][]): number[] => {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return [];
  }

  const available = [];
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === null) {
      available.push(col);
    }
  }
  return available;
};
