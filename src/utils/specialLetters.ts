
import { SpecialLetterEffect } from "@/types/game";

export const SPECIAL_LETTERS: SpecialLetterEffect[] = [
  {
    letter: "Q",
    name: "Time Freeze",
    description: "Freezes falling letters for 5 seconds",
    color: "#93c5fd", // Brighter blue
    borderColor: "#3b82f6", // Strong blue border
    backgroundColor: "#dbeafe", // Light blue bg with better contrast
    icon: "clock",
  },
  {
    letter: "Z",
    name: "Column Clear",
    description: "Clears all letters in the same column",
    color: "#fca5a5", // Brighter red
    borderColor: "#ef4444", // Strong red border
    backgroundColor: "#fee2e2", // Light red bg with better contrast
    icon: "columns",
  },
  {
    letter: "X",
    name: "Area Clear",
    description: "Clears all 8 adjacent tiles",
    color: "#fcd34d", // Brighter yellow
    borderColor: "#f59e0b", // Strong amber border
    backgroundColor: "#fef3c7", // Light yellow bg with better contrast
    icon: "square",
  },
  {
    letter: "J",
    name: "Double Score",
    description: "Doubles the score for this word",
    color: "#86efac", // Brighter green
    borderColor: "#22c55e", // Strong green border
    backgroundColor: "#dcfce7", // Light green bg with better contrast
    icon: "circle-dollar-sign",
  },
  {
    letter: "V",
    name: "Vowel Swap", 
    description: "Swap any vowel with another",
    color: "#a5b4fc", // Bright indigo
    borderColor: "#4f46e5", // Strong indigo border
    backgroundColor: "#e0e7ff", // Light indigo bg
    icon: "circle-fading-plus",
  },
  {
    letter: "P",
    name: "Point Multiplier",
    description: "Triple points for the next word",
    color: "#c4b5fd", // Bright purple
    borderColor: "#8b5cf6", // Strong purple border
    backgroundColor: "#ede9fe", // Light purple bg
    icon: "circle-dollar-sign",
  },
];

// Check if a letter is special
export const isSpecialLetter = (letter: string): boolean => {
  return SPECIAL_LETTERS.some((sl) => sl.letter === letter);
};

// Get special letter effect by letter
export const getSpecialLetterEffect = (letter: string): SpecialLetterEffect | undefined => {
  return SPECIAL_LETTERS.find((sl) => sl.letter === letter);
};

// Get special letter style
export const getSpecialLetterStyle = (letter: string): { backgroundColor: string; borderColor: string } | undefined => {
  const specialLetter = getSpecialLetterEffect(letter);
  if (!specialLetter) return undefined;
  
  return {
    backgroundColor: specialLetter.color,
    borderColor: specialLetter.borderColor,
  };
};
