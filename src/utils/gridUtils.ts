
import { Position } from "@/types/game";

// Check if two cells are adjacent (horizontally, vertically, or diagonally)
export const areAdjacent = (pos1: Position, pos2: Position): boolean => {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  
  // Adjacent if they're at most one cell away in any direction
  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
};

// Check if a position exists on the grid (within bounds)
export const isValidPosition = (pos: Position, gridSize: number): boolean => {
  return pos.row >= 0 && pos.row < gridSize && pos.col >= 0 && pos.col < gridSize;
};

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

// Update the grid after removing selected cells
export const getUpdatedGrid = (
  grid: string[][], 
  selectedPositions: Position[]
): string[][] => {
  const newGrid = grid.map(row => [...row]);
  const selectedPosSet = new Set(selectedPositions.map(p => `${p.row},${p.col}`));
  
  // First mark selected positions as null
  selectedPositions.forEach(pos => {
    newGrid[pos.row][pos.col] = null;
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

// Determine if a letter can move down, dealing with proper stacking
// Now with efficient caching within the function itself (not using React's useMemo)
export const canLetterFall = (
  grid: string[][], 
  row: number, 
  col: number, 
  fallingLetters: { row: number; col: number; id: string }[],
  currentLetterId: string
): boolean => {
  // Create a cache key for the current call
  const cacheKey = `${row},${col},${currentLetterId}`;
  
  // Check if we've already computed this result in our current function call's context
  // This uses a function closure for caching rather than React's useMemo
  if (!canLetterFall.cache) {
    canLetterFall.cache = new Map();
  }
  
  if (canLetterFall.cache.has(cacheKey)) {
    return canLetterFall.cache.get(cacheKey);
  }
  
  // Check grid bounds
  if (row >= grid.length - 1) {
    canLetterFall.cache.set(cacheKey, false);
    return false; // At bottom of grid
  }
  
  // Check if cell below is empty on the grid
  if (grid[row + 1][col] !== null) {
    canLetterFall.cache.set(cacheKey, false);
    return false; // Cell below is occupied on the grid
  }
  
  // Check for other falling letters in the position below
  const letterBelow = fallingLetters.find(l => l.col === col && l.row === row + 1);
  
  if (!letterBelow) {
    canLetterFall.cache.set(cacheKey, true);
    return true; // No letter below, free to fall
  }
  
  // If there's a letter below, check if it's also going to fall this frame
  // This prevents letters from getting stuck because they see another falling letter below
  const result = canLetterFall(grid, row + 1, col, fallingLetters.filter(l => l.id !== letterBelow.id), currentLetterId);
  canLetterFall.cache.set(cacheKey, result);
  return result;
};

// Add type definition for the cache property
declare module "@/utils/gridUtils" {
  interface CanLetterFallFunction {
    (grid: string[][], row: number, col: number, fallingLetters: { row: number; col: number; id: string }[], currentLetterId: string): boolean;
    cache?: Map<string, boolean>;
  }
}

// Clear the cache for canLetterFall - should be called at the start of each game loop cycle
export const clearCanLetterFallCache = (): void => {
  if (canLetterFall.cache) {
    canLetterFall.cache.clear();
  }
};

// Check if a game over should occur due to grid overflow
export const isGridFull = (grid: string[][]): boolean => {
  console.log("### isGridFull check - Examining top row contents:", JSON.stringify(grid[0]));
  
  // Game is over when the entire top row has content (no null cells)
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === null) {
      console.log("### isGridFull: Found empty cell at column", col);
      return false; // Found an empty space in top row
    }
  }
  
  console.log("### isGridFull: TOP ROW IS COMPLETELY FULL - GAME OVER!");
  return true; // Top row is completely full
};

// Memoization key generators - these help create unique cache keys based on inputs
export const generateGridKey = (grid: string[][]): string => {
  // Create a string representation of the grid's top row (which is what matters for isGridFull)
  return grid[0].map(cell => cell === null ? '_' : cell).join('');
};

export const generateFallingLettersKey = (fallingLetters: { row: number; col: number; id: string }[]): string => {
  // Create a string representation of all falling letters' positions
  return fallingLetters.map(l => `${l.id}:${l.row},${l.col}`).sort().join('|');
};

// Get all available columns for spawning new letters (columns with null in top row)
export const getAvailableColumns = (grid: string[][]): number[] => {
  const available = [];
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === null) {
      available.push(col);
    }
  }
  return available;
};
