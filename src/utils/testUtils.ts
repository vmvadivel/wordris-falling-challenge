
/**
 * Test Utilities for ensuring cross-device compatibility
 * and proper game state management
 */

// Test if the application is being viewed on a mobile device
export const isMobileDevice = (): boolean => {
  return window.innerWidth < 768;
};

// Test if the device supports touch events
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Debug helper to log game state transitions
export const logGameStateTransition = (
  prevState: { gameActive: boolean; isGameOver: boolean },
  newState: { gameActive: boolean; isGameOver: boolean }
): void => {
  console.log(
    `Game state transition: [${prevState.gameActive ? 'active' : 'inactive'}, ${
      prevState.isGameOver ? 'over' : 'not over'
    }] → [${newState.gameActive ? 'active' : 'inactive'}, ${
      newState.isGameOver ? 'over' : 'not over'
    }]`
  );
};

// Validate game consistency
export const validateGameConsistency = (
  grid: (string | null)[][],
  fallingLetters: any[],
  gameActive: boolean,
  isGameOver: boolean
): { isConsistent: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Check for game over conditions
  if (isGameOver && gameActive) {
    issues.push('Inconsistent state: Game is marked as both over and active');
  }

  // Check for falling letters in an inactive game
  if (!gameActive && fallingLetters.length > 0) {
    issues.push('Inconsistent state: Game is inactive but letters are still falling');
  }

  // Check for grid overflow not triggering game over
  const topRowFull = grid[0].every(cell => cell !== null);
  if (topRowFull && !isGameOver) {
    issues.push('Inconsistent state: Top row is full but game over is not triggered');
  }

  return {
    isConsistent: issues.length === 0,
    issues
  };
};

// Function to ensure responsive layout is working
export const checkResponsiveness = (): { isResponsive: boolean; issues: string[] } => {
  const issues: string[] = [];
  const isMobile = isMobileDevice();
  
  // Check for appropriate viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta || !viewportMeta.getAttribute('content')?.includes('width=device-width')) {
    issues.push('Missing or incorrect viewport meta tag for responsive design');
  }
  
  // Check for overflowing elements
  const bodyWidth = document.body.clientWidth;
  const overflowingElements = Array.from(document.querySelectorAll('*')).filter(
    el => el instanceof HTMLElement && el.offsetWidth > bodyWidth
  );
  
  if (overflowingElements.length > 0) {
    issues.push(`Found ${overflowingElements.length} elements that overflow the viewport width`);
  }
  
  return {
    isResponsive: issues.length === 0,
    issues
  };
};
