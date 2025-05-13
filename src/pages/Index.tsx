
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, RotateCw, Shuffle, X, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen h-screen bg-gray-950 flex flex-col items-center py-6 px-4 overflow-hidden">
      {/* Title Section */}
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Wordris</h1>
        <h2 className="text-sm md:text-lg text-gray-300">A falling letter challenge for your vocabulary!</h2>
      </div>

      {/* Game Container */}
      <div className="w-full max-w-6xl flex-1 flex flex-col lg:flex-row gap-4 justify-center overflow-hidden">
        {/* Game Grid - Responsive sizing */}
        <div className="w-full lg:max-w-[600px] flex items-center justify-center">
          <div className="grid grid-cols-8 gap-1 aspect-square w-full max-h-full">
            {Array(64).fill(0).map((_, index) => (
              <div 
                key={index} 
                className="aspect-square bg-gray-800/50 border border-gray-700 rounded flex items-center justify-center shadow-sm text-xl font-semibold text-white"
              ></div>
            ))}
          </div>
        </div>

        {/* Control Panel - Adjusted width */}
        <Card className="w-full lg:w-72 bg-gray-900 border-gray-800 flex flex-col">
          <CardHeader>
            <CardTitle className="text-white">Game Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            {/* Current Word with Clear and Submit buttons */}
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Current Word</p>
              <div className="flex gap-2 items-center">
                <div className="p-3 bg-gray-800 rounded-md text-white font-medium text-center flex-1">
                  -
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-gray-800 hover:bg-gray-700 border-gray-700">
                  <X className="h-4 w-4 text-white" />
                </Button>
                <Button variant="outline" size="icon" className="h-10 w-10 bg-gray-800 hover:bg-gray-700 border-gray-700">
                  <Check className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
            
            {/* Score and Level in individual rounded boxes */}
            <div className="flex justify-between gap-4">
              <div className="bg-gray-800 rounded-lg p-3 flex-1 flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">Score</p>
                <p className="text-xl font-semibold text-white">0</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 flex-1 flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-1">Level</p>
                <p className="text-xl font-semibold text-white">1</p>
              </div>
            </div>

            {/* Action buttons moved up and horizontally aligned */}
            <div className="flex justify-center gap-3 pt-1">
              <Button variant="outline" size="icon" className="h-12 w-12 bg-gray-800 hover:bg-purple-900 border-gray-700 shadow-md">
                <Shuffle className="h-5 w-5 text-purple-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 bg-gray-800 hover:bg-blue-900 border-gray-700 shadow-md">
                <RotateCw className="h-5 w-5 text-blue-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 bg-gray-800 hover:bg-orange-900 border-gray-700 shadow-md">
                <Zap className="h-5 w-5 text-orange-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
