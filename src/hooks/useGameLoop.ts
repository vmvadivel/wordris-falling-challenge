
import { useRef, useEffect, useCallback } from 'react';

interface GameLoopOptions {
  onTick: (timestamp: number) => void;
  isActive: boolean;
  frameSkip?: number;
}

/**
 * A hook to handle the game loop with requestAnimationFrame
 * Includes frame skipping for performance optimization
 */
const useGameLoop = ({ onTick, isActive, frameSkip = 1 }: GameLoopOptions) => {
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  
  const tick = useCallback((timestamp: number) => {
    // Only process every nth frame based on frameSkip
    frameCountRef.current += 1;
    if (frameCountRef.current >= frameSkip) {
      frameCountRef.current = 0;
      onTick(timestamp);
    }
    
    // Schedule the next frame if still active
    if (isActive) {
      animationRef.current = requestAnimationFrame(tick);
    }
  }, [onTick, isActive, frameSkip]);
  
  useEffect(() => {
    if (isActive) {
      // Start the animation loop
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(tick);
    }
    
    return () => {
      // Clean up on unmount or when isActive changes
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, tick]);
  
  return animationRef;
};

export default useGameLoop;
