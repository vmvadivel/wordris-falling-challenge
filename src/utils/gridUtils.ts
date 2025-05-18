
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
export const canLetterFall = (
  grid: string[][], 
  row: number, 
  col: number, 
  fallingLetters: { row: number; col: number; id: string }[],
  currentLetterId: string
): boolean => {
  // Check grid bounds
  if (row >= grid.length - 1) {
    return false; // At bottom of grid
  }
  
  // Check if cell below is empty on the grid
  if (grid[row + 1][col] !== null) {
    return false; // Cell below is occupied on the grid
  }
  
  // Check for other falling letters in the position below
  const letterBelow = fallingLetters.find(l => l.col === col && l.row === row + 1);
  
  if (!letterBelow) {
    return true; // No letter below, free to fall
  }
  
  // If there's a letter below, check if it's also going to fall this frame
  // This prevents letters from getting stuck because they see another falling letter below
  return canLetterFall(grid, row + 1, col, fallingLetters.filter(l => l.id !== letterBelow.id), currentLetterId);
};

// Check if a game over should occur due to grid overflow
// Fixed to better detect when the top row is actually full
export const isGridFull = (grid: string[][]): boolean => {
  // Game is over only when the entire top row is filled or has falling letters
  console.log("Checking if grid is full - top row:", grid[0]);
  
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === null) {
      console.log("Empty space found in top row at column:", col);
      return false; // Found at least one empty space in the top row
    }
  }
  console.log("Grid top row is completely full - should trigger game over!");
  return true; // Top row is completely full
}
