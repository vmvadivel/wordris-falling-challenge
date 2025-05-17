
export type Cell = string | null;
export type GameGrid = Cell[][];

export type Position = {
  row: number;
  col: number;
};

export type SelectedCell = {
  letter: string;
  position: Position;
};

export type FallingLetter = {
  letter: string;
  col: number;
  row: number;
  id: string;
};

export type WordValidationResult = {
  isValid: boolean;
  score?: number;
  baseScore?: number;
  rarityBonus?: number;
};

export type SpecialLetterEffect = {
  letter: string;
  name: string;
  description: string;
  color: string;
  borderColor: string;
  backgroundColor: string;
  icon: string;
};

export type GameStats = {
  score: number;
  level: number;
  highScore: number;
  wordsFormed: number;
  timeElapsed: number;
  lettersPlaced?: number;
  signatureWord?: {
    word: string;
    score: number;
  };
  achievements?: string[];
};

// Game configuration constants
export const POINTS_PER_LEVEL = 250;
export const MIN_LEVEL_FOR_TIME_CHALLENGE = 4;
