
import { toast } from "@/hooks/use-toast";
import { WordValidationResult } from "@/types/game";

export const showWordValidationToast = (
  word: string,
  result: WordValidationResult,
  consecutiveWords: number
) => {
  if (result.isValid) {
    // Valid word toast
    toast({
      title: `"${word.toUpperCase()}" is valid!`,
      description: `${result.baseScore} + ${result.rarityBonus} bonus = ${result.score} points`,
      variant: "default",
      duration: 3000,
    });
    
    // Consecutive word bonus
    if (consecutiveWords > 1) {
      toast({
        title: "Combo Bonus!",
        description: `${consecutiveWords}x combo: +${consecutiveWords * 5} points`,
        variant: "default",
        duration: 2000,
      });
    }
  } else {
    // Invalid word toast
    toast({
      title: `"${word.toUpperCase()}" is not valid`,
      description: "Try another word",
      variant: "destructive",
      duration: 2000,
    });
  }
};

// Show level up toast
export const showLevelUpToast = (level: number) => {
  toast({
    title: `Level ${level}!`,
    description: "Speed has increased! New letters are more challenging!",
    variant: "default",
    duration: 3000,
  });
};
