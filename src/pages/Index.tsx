import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RotateCw, Shuffle, X, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { isValidWord, calculateWordScore, clearWordCache } from "@/utils/dictionaryService";
import { 
  areAdjacent, 
  getUpdatedGrid, 
  isValidPosition, 
  canLetterFall, 
  isGridFull,
  getAvailableColumns,
  generateGridKey,
  generateFallingLettersKey,
  clearCanLetterFallCache
} from "@/utils/gridUtils";
import { addShakeAnimation, highlightCells } from "@/utils/animationUtils";
import { showWordValidationToast } from "@/utils/toastUtils";
import { 
  Cell, 
  GameGrid, 
  Position, 
  FallingLetter, 
  SelectedCell, 
  POINTS_PER_LEVEL, 
  MIN_LEVEL_FOR_TIME_CHALLENGE 
} from "@/types/game";
import SpecialLettersModal from "@/components/SpecialLettersModal";
import GameOverModal from "@/components/GameOverModal";
import Footer from "@/components/Footer";
import { SPECIAL_LETTERS, isSpecialLetter } from "@/utils/specialLetters";
import GridCell from "@/components/GridCell";
import useGameLoop from "@/hooks/useGameLoop";
import { processSpecialLetterEffects } from "@/utils/specialLetterEffects";

// Generate a random letter A-Z
const letterFrequencies: { [letter: string]: number } = {
  E: 12, T: 9, A: 8, O: 8, I: 7, N: 7, S: 6, H: 6, R: 6, D: 4,
  L: 4, C: 3, U: 3, M: 2, W: 2, F: 2, G: 2, Y: 2, P: 2, B: 1,
  V: 1, K: 1, J: 0.5, X: 0.5, Q: 0.3, Z: 0.3,
};

// Create an empty 8x8 grid
const createEmptyGrid = (): GameGrid => {
  return Array(8).fill(null).map(() => Array(8).fill(null));
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

  return "E"; // fallback
};

const Index = () => {
  // Game state
  const [grid, setGrid] = useState<GameGrid>(createEmptyGrid());
  const [currentWord, setCurrentWord] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [highScore, setHighScore] = useState<number>(0);
  const [consecutiveWords, setConsecutiveWords] = useState<number>(0);
  
  // Selection state
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  
  // Falling letter state
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);

  // Special letter effects state
  const [timeFreeze, setTimeFreeze] = useState<boolean>(false);
  const [timeFreezeTimer, setTimeFreezeTimer] = useState<number | null>(null);
  const [showSpecialLettersModal, setShowSpecialLettersModal] = useState<boolean>(false);

  // Point multiplier state
  const [pointMultiplier, setPointMultiplier] = useState<number>(1);
  
  // Game over state
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [wordsFormed, setWordsFormed] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  // Time challenge states
  const [timeSinceLastWord, setTimeSinceLastWord] = useState<number>(0);
  
  // Refs for animation control
  const lastDropTime = useRef<number>(0);
  const dropInterval = useRef<number>(1000); // Drop speed in milliseconds
  const gridRef = useRef<HTMLDivElement>(null);
  const wordBoxRef = useRef<HTMLDivElement>(null);
  
  // Calculate max time between words based on level
  const getMaxTimeBetweenWords = (): number => {
    // Only applicable from level MIN_LEVEL_FOR_TIME_CHALLENGE onwards
    if (level < MIN_LEVEL_FOR_TIME_CHALLENGE) return Infinity;
    return Math.max(10, 30 - ((level - MIN_LEVEL_FOR_TIME_CHALLENGE) * 5));
  };
  
  // Memoize available columns for spawning
  const availableColumns = useMemo(() => {
    return getAvailableColumns(grid);
  }, [grid]);
  
  // Function to check if a column is available for spawning
  const isColumnAvailable = (col: number): boolean => {
    return availableColumns.includes(col);
  };
  
  // Spawn a new letter in a random available column
  const spawnNewLetter = () => {
    setFallingLetters(prev => {
      if (prev.length >= 3) return prev; // Max 3 at once

      // Use memoized availableColumns
      const currentAvailableColumns = availableColumns.filter(
        col => !prev.some(l => l.col === col && l.row === 0)
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
  };
  
  // Apply special letter effects - now using our optimized helper
  const applySpecialLetterEffects = (word: string, positions: Position[]) => {
    return processSpecialLetterEffects(word, positions, grid, {
      setTimeFreeze,
      setTimeFreezeTimer,
      setGrid,
      setPointMultiplier
    });
  };
  
  // Memoize grid fullness check
  const gridIsFull = useMemo(() => {
    return isGridFull(grid);
  }, [grid]);
  
  // Check if game should end due to grid overflow
  const checkGridOverflow = (): boolean => {
    // Use memoized result
    console.log("checkGridOverflow called - result:", gridIsFull, "Current grid top row:", grid[0]);
    return gridIsFull;
  };
  
  // Check if game should end due to time between words
  const checkTimeBetweenWords = (): boolean => {
    // Only apply time challenge after reaching MIN_LEVEL_FOR_TIME_CHALLENGE
    if (level < MIN_LEVEL_FOR_TIME_CHALLENGE) return false;
    return timeSinceLastWord >= getMaxTimeBetweenWords();
  };
  
  // End game and show game over screen
  const endGame = () => {
    console.log("endGame called - ending the game and showing modal");
    setGameActive(false);
    setIsGameOver(true);
    setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
  };
  
  // Game loop using our optimized hook with memoized functions
  const gameLoopFn = (timestamp: number) => {
    if (!gameActive || timeFreeze) return;

    const elapsed = timestamp - lastDropTime.current;

    if (elapsed > dropInterval.current) {
      lastDropTime.current = timestamp;

      // Increment time since last word
      setTimeSinceLastWord(prev => prev + (dropInterval.current / 1000));
      
      // Check if we should end the game due to word timing
      if (checkTimeBetweenWords()) {
        endGame();
        return;
      }

      // Clear the canLetterFall cache at the start of each game loop cycle
      clearCanLetterFallCache();

      setFallingLetters(prevLetters => {
        let updatedLetters: FallingLetter[] = [];
        let landedLetters: FallingLetter[] = [];

        // First, identify which letters can move down
        prevLetters.forEach(l => {
          if (canLetterFall(grid, l.row, l.col, prevLetters, l.id)) {
            updatedLetters.push({ ...l, row: l.row + 1 });
          } else {
            landedLetters.push(l);
          }
        });

        // Place landed letters on the grid
        if (landedLetters.length > 0) {
         // console.log("Letters landed:", landedLetters.length);
          setGrid(oldGrid => {
            const newGrid = oldGrid.map(row => [...row]);
            landedLetters.forEach(l => {
              newGrid[l.row][l.col] = l.letter;
            });

            // Check grid fullness immediately with updated grid
            if (isGridFull(newGrid)) {
           //   console.log("Grid overflow detected inside setGrid! Calling endGame");
              endGame();
            }

            return newGrid;
          });
        }

        // When letters move, update any selections involving falling letters
        if (updatedLetters.length > 0) {
          setSelectedCells(prevSelectedCells => {
            return prevSelectedCells.map(selectedCell => {
              // Find if this selected cell corresponds to a falling letter that just moved
              const matchingFallingLetter = prevLetters.find(
                fl => fl.row === selectedCell.position.row && fl.col === selectedCell.position.col
              );
              
              // If this selected cell is a falling letter that moved
              if (matchingFallingLetter) {
                // Find its new position
                const updatedLetter = updatedLetters.find(ul => ul.id === matchingFallingLetter.id);
                if (updatedLetter) {
                  // Update the position in the selected cell
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

    // Spawn new letter if less than 3 are falling, with a small random chance
    // Only try to spawn if there are available columns
    if (fallingLetters.length < 3 && Math.random() < 0.03 && availableColumns.length > 0) {
      spawnNewLetter();
    }
  };

  // Use our optimized game loop hook instead of raw requestAnimationFrame
  const animationRef = useGameLoop({
    onTick: gameLoopFn,
    isActive: gameActive && !timeFreeze,
    frameSkip: 1 // Can be adjusted for performance
  });
  
  // Update drop speed based on level
  useEffect(() => {
    dropInterval.current = Math.max(300, 950 - (level - 1) * 50);
  }, [level]);
  
  // Check if score triggers a level up
  useEffect(() => {
    // Handle level up
    if (score >= level * POINTS_PER_LEVEL) {
      setLevel(prev => {
        const newLevel = prev + 1;
        // Remove toast notification for level up
        return newLevel;
      });
    }

    // Update high score if needed
    setHighScore(prev => Math.max(prev, score));
  }, [score]);
  
  // Cleanup for time freeze timer
  useEffect(() => {
    return () => {
      if (timeFreezeTimer !== null) {
        clearTimeout(timeFreezeTimer);
      }
    };
  }, [timeFreezeTimer]);

  // Reset the game - now clears dictionary caches too for memory optimization
  const resetGame = () => {
   // console.log("resetGame called - resetting all game state");
    setGrid(createEmptyGrid());
    setCurrentWord("");
    setSelectedCells([]);
    setScore(0);
    setLevel(1);
    setFallingLetters([]);
    setConsecutiveWords(0);
    setGameActive(true);
    setTimeFreeze(false);
    setIsGameOver(false);
    setWordsFormed(0);
    setGameStartTime(Date.now());
    setTimeElapsed(0);
    setTimeSinceLastWord(0);
    setLettersPlaced(0);
    setPointMultiplier(1);
    setBestWord(null);
    
    if (timeFreezeTimer !== null) {
      clearTimeout(timeFreezeTimer);
      setTimeFreezeTimer(null);
    }
    
    // Clear dictionary caches to prevent memory bloat
    clearWordCache();
  };
  
  // Clear current word
  const clearWord = () => {
    setCurrentWord("");
    setSelectedCells([]);
  };
  
  // Submit the current word
  const submitWord = () => {
    if (selectedCells.length < 3) {
      toast({
        title: "Word too short",
        description: "Words must be at least 3 letters long",
        variant: "destructive"
      });
      
      if (wordBoxRef.current) {
        addShakeAnimation(wordBoxRef.current);
      }
      clearWord();
      return;
    }

    const word = currentWord;
    const positions = selectedCells.map(cell => cell.position);
    
    // Check if the word is valid using our new dictionary service
    if (isValidWord(word)) {
      // Calculate score
      const { totalScore, baseScore, rarityBonus } = calculateWordScore(word);
      
      // Check for special letter effects
      const effects = applySpecialLetterEffects(word, positions);
      
      // Add combo bonus for consecutive words
      const newConsecutiveWords = consecutiveWords + 1;
      const comboBonus = newConsecutiveWords > 1 ? newConsecutiveWords * 5 : 0;
      
      // Apply score multiplier from special effects if any and from previous point multiplier if active
      const effectMultiplier = effects.scoreMultiplier || 1;
      const currentPointMultiplier = pointMultiplier;
      const finalScore = (totalScore + comboBonus) * effectMultiplier * currentPointMultiplier;
      
      // Update letter tracking
      setLettersPlaced(prev => prev + positions.length);
      
      // Check if this is the best word so far
      if (!bestWord || finalScore > bestWord.score) {
        setBestWord({
          word: word,
          score: finalScore
        });
      }
      
      // Update score
      setScore(prev => prev + finalScore);
      setConsecutiveWords(newConsecutiveWords);
      setWordsFormed(prev => prev + 1);
      
      // Reset time since last word when a valid word is submitted
      setTimeSinceLastWord(0);
      
      // Show validation feedback
      highlightCells(positions, true, gridRef.current);
      showWordValidationToast(word, { 
        isValid: true, 
        score: finalScore,
        baseScore,
        rarityBonus
      }, newConsecutiveWords);
      
      // Apply multiplier notification if it was used
      if (currentPointMultiplier > 1) {
        // Reset the point multiplier after use
        setPointMultiplier(1);
      }
      
      // Update grid and remove selected cells
      setGrid(prev => getUpdatedGrid(prev, positions));
      
      // Clear selection
      clearWord();
    } else {
      // Invalid word
      if (wordBoxRef.current) {
        addShakeAnimation(wordBoxRef.current);
      }
      clearWord();
      highlightCells(positions, false, gridRef.current);
      showWordValidationToast(word, { isValid: false }, 0);
      
      // Reset consecutive words counter
      setConsecutiveWords(0);
    }
  };
  
  // Handle clicking on a cell - now wrapped in useCallback
  const handleCellClick = useCallback((row: number, col: number, letter: string) => {
    // Only allow selection when the game is active
    if (!gameActive) return;
    
    const clickedPosition = { row, col };
    
    // Check if this cell is already selected
    const cellIndex = selectedCells.findIndex(cell => 
      cell.position.row === row && cell.position.col === col
    );
    
    if (cellIndex !== -1) {
      // If clicking the last selected cell, deselect it
      if (cellIndex === selectedCells.length - 1) {
        setSelectedCells(prev => prev.slice(0, -1));
        setCurrentWord(prev => prev.slice(0, -1));
      }
      // If clicking earlier in the chain, deselect from that point forward
      else if (cellIndex >= 0) {
        setSelectedCells(prev => prev.slice(0, cellIndex + 1));
        setCurrentWord(prev => prev.slice(0, cellIndex + 1));
      }
      return;
    }
    
    // Add the selected cell regardless of position - removed adjacency check
    const newSelectedCell = { letter, position: clickedPosition };
    setSelectedCells(prev => [...prev, newSelectedCell]);
    setCurrentWord(prev => prev + letter);
  }, [gameActive, selectedCells, setSelectedCells, setCurrentWord]);
  
  // Render the combined grid (static letters plus falling letter) with memoized cells
  const renderGrid = () => {
    // Create a copy of the grid for rendering that includes falling letters
    const renderGrid = grid.map(row => [...row]);
    
    // Add falling letters to the render grid
    fallingLetters.forEach(l => {
      renderGrid[l.row][l.col] = l.letter;
    });

    return renderGrid.flat().map((cell, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      
      // Check if this position has a falling letter
      const fallingLetter = fallingLetters.find(l => l.row === row && l.col === col);
      const isFalling = !!fallingLetter;
      const letter = cell || (fallingLetter ? fallingLetter.letter : null);
      
      // Check if this cell is selected
      const selectedIndex = selectedCells.findIndex(
        selected => selected.position.row === row && selected.position.col === col
      );
      
      const isSelected = selectedIndex !== -1;
      
      return (
        <GridCell 
          key={index}
          letter={letter}
          row={row}
          col={col}
          isSelected={isSelected}
          isFalling={isFalling}
          onClick={handleCellClick}
        />
      );
    });
  };
  
  // Add point multiplier indicator in the UI if active
  const renderPointMultiplierIndicator = () => {
    if (pointMultiplier <= 1) return null;
    
    return (
      <div className="absolute top-2 right-2 bg-purple-800 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
        {pointMultiplier}x Points
      </div>
    );
  };
  

  // Handle game over modal closing and game restart
  const handleGameOverClose = (open: boolean) => {
    console.log("handleGameOverClose called with open:", open, "current isGameOver:", isGameOver);
    setIsGameOver(open);
    if (!open) {
      console.log("Modal closed, calling resetGame");
      resetGame();
    }
  };
  
  // Additional tracking stats
  const [lettersPlaced, setLettersPlaced] = useState<number>(0);
  const [bestWord, setBestWord] = useState<{word: string, score: number} | null>(null);
  
  return (
    <div className="min-h-screen h-screen bg-gray-950 flex flex-col items-center p-4 md:py-6 overflow-hidden">
      {/* Title Section - Responsive padding and margin */}
      <div className="text-center mb-4 md:mb-8 w-full max-w-6xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Wordris</h1>    
      </div>

      {/* Game Container - Full height with flex grow */}
      <div className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row gap-4 justify-center items-stretch">
        {/* Game Grid - Fluid responsive sizing with min/max constraints and adjusted height */}
        <div className="flex-1 flex items-center justify-center relative">
          {renderPointMultiplierIndicator()}
          <div 
            ref={gridRef}
            className="grid grid-cols-8 gap-1 aspect-square w-full h-full max-w-[min(80vw,80vh,650px)] max-h-[min(80vw,80vh,650px)] min-w-[240px] min-h-[240px]"
          >
            {renderGrid()}
          </div>
        </div>

        {/* Control Panel - Adaptive height and width */}
        <Card className="w-full lg:w-1/4 xl:w-72 bg-gray-900 border-gray-800 flex flex-col self-stretch lg:self-center max-h-[min(450px,65vh)] lg:max-h-[min(calc(100vh_-_14rem),650px)]">
       
          <CardContent className="space-y-3 flex-1 py-2 flex flex-col justify-between">
            {/* Current Word with Clear and Submit buttons */}
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Current Word</p>
              <div ref={wordBoxRef} className="flex gap-2 items-center">
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
                  onClick={submitWord}
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

            {/* High Score */}
            <div className="bg-gray-800 rounded-lg p-2 flex-1 flex flex-col items-center">
              <p className="text-xs text-gray-400">High Score</p>
              <p className="text-xl font-semibold text-white">{highScore}</p>
            </div>
            
            {/* Time since last word - only show after level MIN_LEVEL_FOR_TIME_CHALLENGE */}
            {level >= MIN_LEVEL_FOR_TIME_CHALLENGE && (
              <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
                <p className="text-xs text-gray-400">Time to form word</p>
                <div className="w-full bg-gray-700 h-2 rounded-full mt-1 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ease-linear ${
                      timeSinceLastWord > getMaxTimeBetweenWords() * 0.7 
                        ? "bg-red-500" 
                        : timeSinceLastWord > getMaxTimeBetweenWords() * 0.4 
                        ? "bg-yellow-500" 
                        : "bg-green-500"
                    }`}
                    style={{ 
                      width: `${Math.min(100, (timeSinceLastWord / getMaxTimeBetweenWords()) * 100)}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-gray-300">
                  {Math.max(0, Math.ceil(getMaxTimeBetweenWords() - timeSinceLastWord))}s left
                </p>
              </div>
            )}

            {/* Action buttons moved up and horizontally aligned */}
            <div className="flex justify-center gap-3 pb-4 md:pb-4 mt-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-purple-900 border-gray-700 shadow-md"
                onClick={() => setShowSpecialLettersModal(true)}
              >
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 md:h-12 md:w-12 bg-gray-800 hover:bg-blue-900 border-gray-700 shadow-md"
                onClick={resetGame}
              >
                <RotateCw className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </Button>
              
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Special Letters Modal */}
      <SpecialLettersModal
        open={showSpecialLettersModal}
        onOpenChange={setShowSpecialLettersModal}
        specialLetters={SPECIAL_LETTERS}
      />
      
      {/* Game Over Modal */}
      <GameOverModal 
        isOpen={isGameOver} 
        onOpenChange={handleGameOverClose}
        onClose={() => {
          console.log("GameOverModal onClose called");
          setIsGameOver(false);
        }}
        onRestart={() => {
          console.log("GameOverModal onRestart called");
          resetGame();
        }}
        stats={{
          score,
          level,
          highScore,
          wordsFormed,
          timeElapsed,
          lettersPlaced,
          signatureWord: bestWord,
          achievements: [
            ...(wordsFormed >= 5 ? ["Word Wizard"] : []),
            ...(lettersPlaced >= 50 ? ["Word Factory"] : []),
            ...(score >= 300 ? ["Score Master"] : [])
          ]
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
