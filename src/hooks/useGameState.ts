
import { useState, useRef, useCallback } from 'react';
import { GameGrid, FallingLetter, SelectedCell } from '@/types/game';
import { toast } from '@/hooks/use-toast';
import { clearWordCache } from '@/utils/dictionaryService';

// Create an empty 8x8 grid
const createEmptyGrid = (): GameGrid => {
  return Array(8).fill(null).map(() => Array(8).fill(null));
};

export const useGameState = () => {
  // Core game state
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

  // Special effects state
  const [timeFreeze, setTimeFreeze] = useState<boolean>(false);
  const [timeFreezeTimer, setTimeFreezeTimer] = useState<number | null>(null);
  const [pointMultiplier, setPointMultiplier] = useState<number>(1);
  
  // Game over and stats state
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [wordsFormed, setWordsFormed] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timeSinceLastWord, setTimeSinceLastWord] = useState<number>(0);
  const [lettersPlaced, setLettersPlaced] = useState<number>(0);
  const [bestWord, setBestWord] = useState<{word: string, score: number} | null>(null);
  
  // Modal state
  const [showSpecialLettersModal, setShowSpecialLettersModal] = useState<boolean>(false);

  // Refs
  const lastDropTime = useRef<number>(0);
  const dropInterval = useRef<number>(1000);

  // Reset game function
  const resetGame = useCallback(() => {
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
    
    clearWordCache();
  }, [timeFreezeTimer]);

  // Clear current word
  const clearWord = useCallback(() => {
    setCurrentWord("");
    setSelectedCells([]);
  }, []);

  // End game function
  const endGame = useCallback(() => {
    setGameActive(false);
    setIsGameOver(true);
    setTimeElapsed(Math.floor((Date.now() - gameStartTime) / 1000));
  }, [gameStartTime]);

  return {
    // State
    grid, setGrid,
    currentWord, setCurrentWord,
    score, setScore,
    level, setLevel,
    gameActive, setGameActive,
    highScore, setHighScore,
    consecutiveWords, setConsecutiveWords,
    selectedCells, setSelectedCells,
    fallingLetters, setFallingLetters,
    timeFreeze, setTimeFreeze,
    timeFreezeTimer, setTimeFreezeTimer,
    pointMultiplier, setPointMultiplier,
    isGameOver, setIsGameOver,
    wordsFormed, setWordsFormed,
    gameStartTime, setGameStartTime,
    timeElapsed, setTimeElapsed,
    timeSinceLastWord, setTimeSinceLastWord,
    lettersPlaced, setLettersPlaced,
    bestWord, setBestWord,
    showSpecialLettersModal, setShowSpecialLettersModal,
    
    // Refs
    lastDropTime,
    dropInterval,
    
    // Actions
    resetGame,
    clearWord,
    endGame,
    createEmptyGrid
  };
};
