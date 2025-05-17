
import React from "react";
import { 
  Clock, 
  Columns, 
  Square, 
  CircleDollarSign, 
  CircleFadingPlus, 
  CircleFadingArrowUp 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SpecialLetterEffect } from "@/types/game";

type SpecialLettersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialLetters: SpecialLetterEffect[];
};

const SpecialLettersModal = ({
  open,
  onOpenChange,
  specialLetters,
}: SpecialLettersModalProps) => {
  // Function to render the appropriate icon for each special letter
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "clock":
        return <Clock className="h-5 w-5 text-black" />;
      case "columns":
        return <Columns className="h-5 w-5 text-black" />;
      case "square":
        return <Square className="h-5 w-5 text-black" />;
      case "circle-dollar-sign":
        return <CircleDollarSign className="h-5 w-5 text-black" />;
      case "circle-fading-plus":
        return <CircleFadingPlus className="h-5 w-5 text-black" />;
      case "circle-fading-arrow-up":
        return <CircleFadingArrowUp className="h-5 w-5 text-black" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Special Letters</DialogTitle>
          <DialogDescription className="text-gray-400">
            Special letters activate powerful effects when used in words
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-3 max-h-[60vh] overflow-y-auto pr-2">
          {specialLetters.map((item) => (
            <div
              key={item.letter}
              className="flex items-center gap-3 p-3 rounded-md"
              style={{ backgroundColor: item.backgroundColor }}
            >
              <div
                className="h-12 w-12 rounded-md flex items-center justify-center text-xl font-bold border-2 shadow-md relative"
                style={{
                  backgroundColor: item.color,
                  borderColor: item.borderColor,
                  color: "#000000", // Making text black for better contrast
                }}
              >
                {item.letter}
                <span className="absolute bottom-0 right-0 bg-black/20 rounded-tl-md p-0.5">
                  {renderIcon(item.icon)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black">{item.name}</h3>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogClose asChild>
          <Button className="w-full bg-gray-800 hover:bg-gray-700">
            Got it
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialLettersModal;
