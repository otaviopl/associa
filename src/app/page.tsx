
'use client';

import { useState } from 'react';
import { GameScreen } from '@/components/GameScreen';
import { ResultScreen } from '@/components/ResultScreen';

export default function Page() {
  const [gameState, setGameState] = useState<'home' | 'game' | 'result'>('home');
  const [finalScore, setFinalScore] = useState(0);

  // Handlers to change game state
  const startGame = () => {
    setFinalScore(0);
    setGameState('game');
  };

  const showResults = (score: number) => {
    setFinalScore(score);
    setGameState('result');
  };

  const playAgain = () => {
    setFinalScore(0);
    setGameState('home');
  };

  if (gameState === 'game') {
    // Pass showResults to the game screen so it can transition
    return <GameScreen showResults={showResults} />;
  }

  if (gameState === 'result') {
    // Pass playAgain to the result screen
    return <ResultScreen score={finalScore} onPlayAgain={playAgain} />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Speed lines background effect */}
      <div className="speed-lines"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo/Title - Minimalista */}
        <div className="text-center mb-16">
          <h1 className="text-7xl md:text-8xl font-black tracking-tight mb-4 text-white">
            RÁPIDA
          </h1>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 font-medium tracking-wide">
            ASSOCIAÇÃO EM 60 SEGUNDOS
          </p>
        </div>

        {/* Single CTA Button - Focal Point */}
        <button
          onClick={startGame}
          className="group relative overflow-hidden bg-white text-black px-12 py-6 text-2xl font-bold tracking-wide hover:bg-gray-100 active:scale-95 transition-all duration-150"
        >
          <div className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-150"></div>
          <span className="relative z-10 group-hover:text-white transition-colors duration-150">
            COMEÇAR
          </span>
        </button>

        {/* Minimal Instructions */}
        <div className="mt-16 text-center max-w-md">
          <div className="grid grid-cols-3 gap-8 text-gray-400 text-sm font-medium">
            <div>
              <div className="text-2xl font-black text-white mb-2">01</div>
              <p>Palavra aparece</p>
            </div>
            <div>
              <div className="text-2xl font-black text-white mb-2">02</div>
              <p>Digite associações</p>
            </div>
            <div>
              <div className="text-2xl font-black text-white mb-2">03</div>
              <p>Tema muda</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}