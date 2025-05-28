
import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

const RotateDeviceOverlay = () => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if device is mobile/tablet and in landscape
      const isMobile = window.innerWidth <= 1023; // Mobile/tablet breakpoint
      const isLandscape = window.innerWidth > window.innerHeight;
      
      setShowOverlay(isMobile && isLandscape);
    };

    // Check on mount
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!showOverlay) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm flex items-center justify-center p-4"
      style={{
        paddingTop: 'max(env(safe-area-inset-top), 1rem)',
        paddingLeft: 'max(env(safe-area-inset-left), 1rem)',
        paddingRight: 'max(env(safe-area-inset-right), 1rem)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)'
      }}
    >
      <div className="text-center max-w-sm mx-auto">
        {/* Rotating phone icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <RotateCw 
              className="w-16 h-16 text-white animate-spin" 
              style={{ 
                animation: 'spin 3s linear infinite',
                transformOrigin: 'center'
              }}
            />
          </div>
        </div>
        
        {/* Message */}
        <h2 className="text-2xl font-bold text-white mb-4">
          Please rotate your device
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          Please rotate your device to portrait mode to continue playing.
        </p>
      </div>
    </div>
  );
};

export default RotateDeviceOverlay;
