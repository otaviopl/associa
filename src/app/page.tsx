
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-6xl mb-6">🧠</div>
          <h1 className="text-6xl font-bold mb-6 text-white">
            Associação Rápida
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Teste sua criatividade! Digite o máximo de associações possíveis em <span className="font-bold text-blue-400">30 segundos</span>
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 bg-opacity-50 rounded-3xl p-8 mb-8 border border-gray-700">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 bg-opacity-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-white mb-1">Rápido</h3>
              <p className="text-gray-400 text-sm">30 segundos intensos</p>
            </div>
            <div className="bg-gray-700 bg-opacity-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-white mb-1">Dinâmico</h3>
              <p className="text-gray-400 text-sm">Uma palavra por vez</p>
            </div>
            <div className="bg-gray-700 bg-opacity-50 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold text-white mb-1">Desafiante</h3>
              <p className="text-gray-400 text-sm">Quantas consegue?</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={startGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🚀 Começar Jogo
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-gray-800 bg-opacity-30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Como Jogar:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">1.</span>
              <p className="text-gray-300 text-sm">Uma palavra aparecerá na tela</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">2.</span>
              <p className="text-gray-300 text-sm">Digite palavras relacionadas rapidamente</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">3.</span>
              <p className="text-gray-300 text-sm">Cada associação válida vale 1 ponto</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-400 font-bold">4.</span>
              <p className="text-gray-300 text-sm">Tente fazer o máximo em 30 segundos!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}