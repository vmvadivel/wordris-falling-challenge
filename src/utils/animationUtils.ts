
import { Position } from "@/types/game";

// Add a shake animation to an element
export const addShakeAnimation = (element: HTMLElement | null) => {
  if (!element) return;
  
  // Remove any existing animation
  element.classList.remove("animate-shake");
  
  // Force a reflow to restart the animation
  void element.offsetWidth;
  
  // Add the shake animation class
  element.classList.add("animate-shake");
  
  // Remove the class after animation completes
  setTimeout(() => {
    element.classList.remove("animate-shake");
  }, 500); // Animation duration
};

// Highlight cells with a specific animation
export const highlightCells = (
  positions: Position[], 
  isValid: boolean,
  gridRef: HTMLDivElement | null
) => {
  if (!gridRef) return;

  const cells = gridRef.querySelectorAll(".grid-cell");
  const gridSize = Math.sqrt(cells.length);
  
  positions.forEach(pos => {
    const index = pos.row * gridSize + pos.col;
    const cell = cells[index] as HTMLElement;
    
    if (cell) {
      // Apply appropriate highlight class
      const highlightClass = isValid ? "cell-highlight-valid" : "cell-highlight-invalid";
      cell.classList.add(highlightClass);
      
      // Remove class after animation
      setTimeout(() => {
        cell.classList.remove(highlightClass);
      }, isValid ? 500 : 800);
    }
  });
};

// Get the order indicator element for a cell
export const getOrderIndicator = (index: number): string => {
  return `<span class="order-indicator">${index + 1}</span>`;
};
