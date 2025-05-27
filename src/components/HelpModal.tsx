
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-lg help-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">How to Play Wordris</DialogTitle>
          <DialogDescription className="text-gray-300">
            Form words by clicking falling letters!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-gray-200 modal-content">
          <section>
            <h3 className="text-base font-semibold text-white mb-1">Rules</h3>
            <p className="text-sm">Letters continuously fall from the top of the screen, filling the grid. Your objective is to select letters from the grid to form valid words. Each word you create must be at least three letters long.

Once you've formed a valid word, hit the ✓ (submit) button to clear those letters. They'll disappear, and letters from above will fall to fill the gaps. If you make a mistake or want to try a different word, simply press the ✗ (clear) button to deselect your current letters.

The game continues until the letter stack reaches the top of the screen.
              </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-1">⚡ Special Letters</h3>
            <p className="text-sm">Keep an eye out for special characters like Q, Z, X, J, and P! Forming words that include these letters will grant you additional benefits and strategic advantages. For a detailed explanation of these power-ups and how they can help you, click on the Power-Up button located in the game control area.
            </p>
          </section>

          <section>
            <h3 className="text-base font-semibold text-white mb-1">💡Tips</h3>
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
