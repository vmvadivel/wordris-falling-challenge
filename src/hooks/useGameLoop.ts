
import { useRef, useEffect, useCallback } from 'react';

interface UseGameLoopProps {
  onTick: (timestamp: number) => void;
  isActive: boolean;
  frameSkip?: number;
}

const useGameLoop = ({ onTick, isActive, frameSkip = 1 }: UseGameLoopProps) => {
  const animationRef = useRef<number | null>(null);
  const frameCountRef = useRef<number>(0);

  const gameLoop = useCallback((timestamp: number) => {
    if (!isActive) return;

    frameCountRef.current++;
    
    // Skip frames if frameSkip is greater than 1
    if (frameCountRef.current % frameSkip === 0) {
      onTick(timestamp);
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [onTick, isActive, frameSkip]);

  useEffect(() => {
    if (isActive) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, gameLoop]);

  return animationRef;
};

export default useGameLoop;
