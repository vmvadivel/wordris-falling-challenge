
import React, { useState, useEffect, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RotateCw, Shuffle, X, Zap } from "lucide-react";

// Types for our grid
type Cell = string | null;
type GameGrid = Cell[][];

// Generate a random letter A-Z
const getRandomLetter = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
};

// Create an empty 8x8 grid
const createEmptyGrid = (): GameGrid => {
  return Array(8).fill(null).map(() => Array(8).fill(null));
};

const Index = () => {
  // Game state
  const [grid, setGrid] = useState<GameGrid>(createEmptyGrid());
  const [currentWord, setCurrentWord] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [gameActive, setGameActive] = useState<boolean>(true);
  
  // Falling letter state
  const [fallingLetter, setFallingLetter] = useState<{letter: string, col: number, row: number} | null>(null);
  
  // Refs for animation control
  const animationRef = useRef<number | null>(null);
  const lastDropTime = useRef<number>(0);
  const dropInterval = useRef<number>(800); // Drop speed in milliseconds
  
  // Function to check if a column is available for spawning
  const isColumnAvailable = (col: number): boolean => {
    return grid[0][col] === null;
  };
  
  // Find all available columns for spawning
  const getAvailableColumns = (): number[] => {
    const available = [];
    for (let col = 0; col < 8; col++) {
      if (isColumnAvailable(col)) {
        available.push(col);
      }
    }
    return available;
  };
  
  // Spawn a new letter in a random available column
const spawnNewLetter = () => {
  setFallingLetter(prev => {
    if (prev) return prev; // Do nothing if one is already falling

    const availableColumns = getAvailableColumns();
    if (availableColumns.length === 0) return null;

    const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
    return {
      letter: getRandomLetter(),
      col: randomCol,
      row: 0
    };
  });
};
  
  // Game loop with requestAnimationFrame for smooth animation
  const gameLoop = (timestamp: number) => {
    if (!gameActive) return;
    
    const elapsed = timestamp - lastDropTime.current;
    
    // Time to move the letter down
if (elapsed > dropInterval.current) {
  lastDropTime.current = timestamp;

  setFallingLetter(prev => {
    if (!prev) return null;

    const nextRow = prev.row + 1;

    if (nextRow < 8 && grid[nextRow][prev.col] === null) {
      return { ...prev, row: nextRow };
    } else {
      setGrid(oldGrid => {
        const newGrid = [...oldGrid.map(row => [...row])];
        newGrid[prev.row][prev.col] = prev.letter;
        return newGrid;
      });
      return null;
    }
  });
}
    
    // Random chance to spawn a new letter if none is falling
    if (!fallingLetter && Math.random() < 0.02) { // Small chance each frame
      spawnNewLetter();
    }
    
    // Continue the animation loop
    animationRef.current = requestAnimationFrame(gameLoop);
  };
  
  // Start/stop game
  useEffect(() => {
    if (gameActive) {
      lastDropTime.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameActive, grid]);
  
  // Update drop speed based on level
  useEffect(() => {
    dropInterval.current = Math.max(200, 800 - (level - 1) * 100);
  }, [level]);
  
  // Reset the game
  const resetGame = () => {
    setGrid(createEmptyGrid());
    setCurrentWord("");
    setScore(0);
    setLevel(1);
    setFallingLetter(null);
    setGameActive(true);
  };
  
  // Clear current word
  const clearWord = () => {
    setCurrentWord("");
  };
  
  // Handle clicking on a cell (not implemented yet)
  const handleCellClick = (row: number, col: number) => {
    // Ensure we can only click on cells that have letters
    if (grid[row][col]) {
      // Add the letter to current word
      setCurrentWord(prev => prev + grid[row][col]);
      
      // For future implementation: letter selection, word validation, etc.
    }
  };
  
  // Render the combined grid (static letters plus falling letter)
  const renderGrid = () => {
    // Create a copy of the grid for rendering
    const renderGrid = grid.map(row => [...row]);
    
    // Add falling letter to the render grid if it exists
    if (fallingLetter) {
      renderGrid[fallingLetter.row][fallingLetter.col] = fallingLetter.letter;
    }
    
    // Render each cell with its styling
    return renderGrid.flat().map((cell, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      
      // Check if this is the falling letter for styling
      const isFallingLetter = fallingLetter && 
                             fallingLetter.row === row && 
                             fallingLetter.col === col;
      
      return (
        <div 
          key={index} 
          className={`aspect-square border border-gray-700 rounded flex items-center justify-center shadow-sm text-xl font-semibold transition-colors duration-200
            ${cell ? 'bg-gray-800' : 'bg-gray-800/50'}
            ${isFallingLetter ? 'bg-purple-900/80 border-purple-500' : ''}`}
          onClick={() => handleCellClick(row, col)}
        >
          {cell}
        </div>
      );
    });
  };
  
  return (
    <div className="min-h-screen h-screen bg-gray-950 flex flex-col items-center p-4 md:py-6 overflow-hidden">
      {/* Title Section - Responsive padding and margin */}
      <div className="text-center mb-4 md:mb-8 w-full max-w-6xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Wordris</h1>
        <h2 className="text-sm md:text-lg text-gray-300">A falling letter challenge for your vocabulary!</h2>
      </div>

      {/* Game Container - Full height with flex grow */}
      <div className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row gap-4 justify-center items-center pb-4">
        {/* Game Grid - Fluid responsive sizing with min/max constraints and adjusted height */}
        <div className="w-full lg:w-3/4 xl:w-auto flex items-center justify-center">
          <div className="grid grid-cols-8 gap-1 aspect-square w-full max-w-[min(calc(100vh_-_14rem),650px)] min-h-[min(350px,65vh)] md:min-h-[min(450px,70vh)]">
            {renderGrid()}
          </div>
        </div>

        {/* Control Panel - Adaptive height and width */}
        <Card className="w-full lg:w-1/4 xl:w-72 bg-gray-900 border-gray-800 flex flex-col self-stretch lg:self-center max-h-[min(450px,65vh)] lg:max-h-[min(calc(100vh_-_14rem),650px)]">
          <CardHeader className="py-2 md:py-3">
            <CardTitle className="text-white text-xl">Game Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 flex-1 py-2 flex flex-col justify-between">
            {/* Current Word with Clear and Submit buttons */}
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Current Word</p>
              <div className="flex gap-2 items-center">
                <div className="p-2 bg-gray-800 rounded-md text-white font-medium text-center flex-1">
                  {currentWord || "-"}
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border-gray-700"
                  onClick={clearWord}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-gray-800 hover:bg-gray-700 border-gray-700"
                >
                  <Check className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
            
            {/* Score and Level in individual rounded boxes */}
            <div className="flex justify-between gap-4">
              <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
                <p className="text-xs text-gray-400">Score</p>
                <p className="text-xl font-semibold text-white">{score}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
                <p className="text-xs text-gray-400">Level</p>
                <p className="text-xl font-semibold text-white">{level}</p>
              </div>
            </div>

            {/* Action buttons moved up and horizontally aligned */}
            <div className="flex justify-center gap-3 pb-1 md:pb-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 md:h-10 md:w-10 bg-gray-800 hover:bg-purple-900 border-gray-700 shadow-md"
              >
                <Shuffle className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 md:h-10 md:w-10 bg-gray-800 hover:bg-blue-900 border-gray-700 shadow-md"
                onClick={resetGame}
              >
                <RotateCw className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 md:h-10 md:w-10 bg-gray-800 hover:bg-orange-900 border-gray-700 shadow-md"
                onClick={() => setGameActive(!gameActive)}
              >
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-orange-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
