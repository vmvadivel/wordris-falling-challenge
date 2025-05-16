
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
