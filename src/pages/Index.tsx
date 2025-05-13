
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RotateCw, Shuffle, X } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-8 px-4">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Wordris</h1>
        <h2 className="text-lg text-gray-300">A falling letter challenge for your vocabulary!</h2>
      </div>

      {/* Game Container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 justify-center">
        {/* Game Grid - Larger cells with responsive sizing */}
        <div className="w-full lg:max-w-[640px]">
          <div className="grid grid-cols-8 gap-1 aspect-square w-full">
            {Array(64).fill(0).map((_, index) => (
              <div 
                key={index} 
                className="aspect-square bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center shadow-sm text-xl font-semibold text-white"
              ></div>
            ))}
          </div>
        </div>

        {/* Control Panel */}
        <Card className="w-full lg:w-80 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Game Controls</CardTitle>
            <CardDescription className="text-gray-400">Control your game</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Word with Clear and Submit buttons */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Current Word</p>
              <div className="flex gap-2 items-center">
                <div className="p-3 bg-gray-800 rounded-md text-white font-medium text-center flex-1">
                  -
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <X className="h-4 w-4 text-gray-300" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Check className="h-4 w-4 text-gray-300" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">Score</p>
                <p className="text-xl font-semibold text-white">0</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Level</p>
                <p className="text-xl font-semibold text-white">1</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-3">
            {/* Icon-only buttons arranged horizontally */}
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <RotateCw className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <span className="text-lg">⚡</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
