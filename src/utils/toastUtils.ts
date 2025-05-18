
import { toast } from "@/hooks/use-toast";
import { WordValidationResult } from "@/types/game";

export const showWordValidationToast = (
  word: string,
  result: WordValidationResult,
  consecutiveWords: number
) => {
  if (!result.isValid) {
    // Invalid word toast
    toast({
      title: `"${word.toUpperCase()}" is not valid`,
      description: "Try another word",
      variant: "destructive",
      duration: 2000,
    });
    return;
  }
  
  // For valid words, only show toasts for special occasions
  
  // Consecutive word bonus (combo) - Commented out as requested
  /*
  if (consecutiveWords > 1) {
    toast({
      title: "Combo Bonus!",
      description: `${consecutiveWords}x combo: +${consecutiveWords * 5} points`,
      variant: "default",
      duration: 2000,
    });
  }
  */
  
  // For exceptionally high scoring words (over 15 points) - Commented out as requested
  /*
  if (result.score > 15) {
    toast({
      title: "Great Word!",
      description: `${result.baseScore} + ${result.rarityBonus} bonus = ${result.score} points`,
      variant: "default", 
      duration: 3000,
    });
  }
  */
};

// Show level up toast - Commented out as requested
/*
export const showLevelUpToast = (level: number) => {
  toast({
    title: `Level ${level}!`,
    description: "Speed has increased! New letters are more challenging!",
    variant: "default",
    duration: 3000,
  });
};
*/

