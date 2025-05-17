
import React from "react";
import { X, Clock, Columns, Square, CircleDollarSign } from "lucide-react";
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Special Letters</DialogTitle>
          <DialogDescription className="text-gray-400">
            Special letters activate powerful effects when used in words
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-3">
          {specialLetters.map((item) => (
            <div
              key={item.letter}
              className="flex items-center gap-3 p-3 rounded-md"
              style={{ backgroundColor: item.backgroundColor }}
            >
              <div
                className="h-12 w-12 rounded-md flex items-center justify-center text-xl font-bold border-2 shadow-md"
                style={{
                  backgroundColor: item.color,
                  borderColor: item.borderColor,
                  color: "#000000", // Making text black for better contrast
                }}
              >
                {item.letter}
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
