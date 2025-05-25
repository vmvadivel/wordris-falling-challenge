
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">How to Play Wordris</DialogTitle>
          <DialogDescription className="text-gray-300">
            Form words by clicking falling letters!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-gray-200">
          <section>
            <h3 className="text-base font-semibold text-white mb-1">🎯 Goal</h3>
            <p className="text-sm">Click letter tiles to form valid English words and score points.</p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-1">🎮 Controls</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Click letters to select them</li>
              <li>Submit with ✓ button or Enter key</li>
              <li>Clear with ✗ button or Escape key</li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-1">⚡ Special Letters</h3>
            <p className="text-sm">Use multipliers (2x, 3x), wildcards (★), and time bonuses (+T) for higher scores.</p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-1">⏰ Time Challenge</h3>
            <p className="text-sm">Starting at level 3, form words before time runs out!</p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-1">💡 Tips</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Longer words = more points</li>
              <li>Save special letters for big words</li>
              <li>Look for common endings (-ING, -ED)</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
