
import React, { memo } from 'react';
import { isSpecialLetter, getSpecialLetterStyle } from "@/utils/specialLetters";

interface GridCellProps {
  letter: string | null;
  row: number;
  col: number;
  isSelected: boolean;
  isFalling: boolean;
  onClick: (row: number, col: number, letter: string) => void;
}

const GridCell = ({ letter, row, col, isSelected, isFalling, onClick }: GridCellProps) => {
  // Don't render empty cells with the same styling as occupied cells
  if (!letter) {
    return (
      <div className="grid-cell aspect-square w-full h-full rounded flex items-center justify-center text-3xl font-bold bg-gray-500" />
    );
  }

  const isSpecial = isSpecialLetter(letter);
  const specialStyle = isSpecial ? getSpecialLetterStyle(letter) : undefined;
  
  return (
    <div
      className={`grid-cell aspect-square w-full h-full rounded flex items-center justify-center text-3xl font-bold
        ${letter ? 'bg-white text-black' : 'bg-white/50'}
        ${isSelected ? 'bg-blue-200' : ''}
        ${!isSelected && letter && !isSpecial ? 'hover:bg-gray-100' : ''}`}
      style={{
        ...specialStyle,
        boxSizing: 'border-box',
        transform: isSelected ? 'scale(1.02)' : 'none',
        transition: 'transform 0.15s ease-out, background-color 0.15s ease-out',
        position: 'relative',
        zIndex: isSelected ? '5' : 'auto'
      }}
      onClick={() => letter && onClick(row, col, letter)}
    >
      {letter}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(GridCell);
