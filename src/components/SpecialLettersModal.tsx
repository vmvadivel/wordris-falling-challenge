
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <DialogContent className="sm:max-w-md md:max-w-lg bg-gray-900 border-gray-800 text-white p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl md:text-2xl">Special Letters</DialogTitle>
          <DialogDescription className="text-gray-400">
            Special letters activate powerful effects when used in words
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-3">
          <ScrollArea className="pr-4" style={{ height: 'auto', maxHeight: '60vh' }}>
            <div className="flex flex-col gap-3 pb-1">
              {specialLetters.map((item) => (
                <div
                  key={item.letter}
                  className="flex items-center gap-3 p-3 rounded-md"
                  style={{ backgroundColor: item.backgroundColor }}
                >
                  <div
                    className="h-10 w-10 md:h-12 md:w-12 rounded-md flex items-center justify-center text-xl font-bold border-2 shadow-md relative"
                    style={{
                      backgroundColor: item.color,
                      borderColor: item.borderColor,
                      color: "#000000",
                    }}
                  >
                    {item.letter}
                    <span className="absolute bottom-0 right-0 bg-black/20 rounded-tl-md p-0.5">
                      {renderIcon(item.icon)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black text-sm md:text-base">{item.name}</h3>
                    <p className="text-xs md:text-sm text-gray-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="p-6 pt-3">
          <DialogClose asChild>
            <Button className="w-full bg-gray-800 hover:bg-gray-700">
              Got it
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialLettersModal;
