
import { SpecialLetterEffect } from "@/types/game";

export const SPECIAL_LETTERS: SpecialLetterEffect[] = [
  {
    letter: "Q",
    name: "Time Freeze",
    description: "Freezes falling letters for 5 seconds",
    color: "#e0f2fe", // Light blue
    borderColor: "#7dd3fc", // Blue-400
    backgroundColor: "#e0f7fe", // Light blue bg
    icon: "clock",
  },
  {
    letter: "Z",
    name: "Column Clear",
    description: "Clears all letters in the same column",
    color: "#fee2e2", // Light red
    borderColor: "#fca5a5", // Red-400
    backgroundColor: "#fee2e2", // Light red bg
    icon: "column",
  },
  {
    letter: "X",
    name: "Area Clear",
    description: "Clears all 8 adjacent tiles",
    color: "#fef9c3", // Light yellow
    borderColor: "#fde047", // Yellow-400
    backgroundColor: "#fef9c3", // Light yellow bg
    icon: "square",
  },
  {
    letter: "J",
    name: "Double Score",
    description: "Doubles the score for this word",
    color: "#dcfce7", // Light green
    borderColor: "#86efac", // Green-400
    backgroundColor: "#dcfce7", // Light green bg
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
