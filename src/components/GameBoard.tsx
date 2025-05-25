
import React, { memo, useMemo } from 'react';
import { GameGrid, FallingLetter, SelectedCell } from '@/types/game';
import GridCell from './GridCell';

interface GameBoardProps {
  grid: GameGrid;
  fallingLetters: FallingLetter[];
  selectedCells: SelectedCell[];
  onCellClick: (row: number, col: number, letter: string) => void;
  pointMultiplier: number;
  gridRef: React.RefObject<HTMLDivElement>;
}

const GameBoard = ({ 
  grid, 
  fallingLetters, 
  selectedCells, 
  onCellClick, 
  pointMultiplier,
  gridRef 
}: GameBoardProps) => {
  
  // Render the combined grid (static letters plus falling letters)
  const renderGrid = useMemo(() => {
    const renderGrid = grid.map(row => [...row]);
    
    // Add falling letters to the render grid
    fallingLetters.forEach(l => {
      renderGrid[l.row][l.col] = l.letter;
    });

    return renderGrid.flat().map((cell, index) => {
      const row = Math.floor(index / 8);
      const col = index % 8;
      
      const fallingLetter = fallingLetters.find(l => l.row === row && l.col === col);
      const isFalling = !!fallingLetter;
      const letter = cell || (fallingLetter ? fallingLetter.letter : null);
      
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
          onClick={onCellClick}
        />
      );
    });
  }, [grid, fallingLetters, selectedCells, onCellClick]);

  // Point multiplier indicator
  const renderPointMultiplierIndicator = () => {
    if (pointMultiplier <= 1) return null;
    
    return (
      <div className="absolute top-2 right-2 bg-purple-800 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
        {pointMultiplier}x Points
      </div>
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center relative">
      {renderPointMultiplierIndicator()}
      <div 
        ref={gridRef}
        className="grid grid-cols-8 gap-1 aspect-square w-full h-full max-w-[min(80vw,80vh,650px)] max-h-[min(80vw,80vh,650px)] min-w-[240px] min-h-[240px]"
      >
        {renderGrid}
      </div>
    </div>
  );
};

export default memo(GameBoard);
