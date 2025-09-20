
'use client';

import { useState, useEffect } from 'react';
import { GameScreen } from '@/components/GameScreen';
import { ResultScreen } from '@/components/ResultScreen';
import { Leaderboard } from '@/components/Leaderboard';

export default function Page() {
  const [gameState, setGameState] = useState<'home' | 'game' | 'result'>('home');
  const [finalScore, setFinalScore] = useState(0);
  const [typedText, setTypedText] = useState('');

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

  // Efeito de digitação em loop para o título
  useEffect(() => {
    if (gameState !== 'home') return;
    
    const text = 'associa';
    let currentIndex = 0;
    let isDeleting = false;
    let pauseCount = 0;
    
    const typeInterval = setInterval(() => {
      if (!isDeleting) {
        // Fase de digitação
        if (currentIndex <= text.length) {
          setTypedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          // Pausa antes de começar a apagar
          pauseCount++;
          if (pauseCount >= 13) { // ~2 segundos de pausa (13 * 150ms)
            isDeleting = true;
            pauseCount = 0;
          }
        }
      } else {
        // Fase de apagar
        if (currentIndex > 0) {
          currentIndex--;
          setTypedText(text.slice(0, currentIndex));
        } else {
          // Pausa antes de reiniciar o ciclo
          pauseCount++;
          if (pauseCount >= 5) { // ~500ms de pausa (5 * 100ms)
            isDeleting = false;
            currentIndex = 0;
            pauseCount = 0;
          }
        }
      }
    }, isDeleting ? 100 : 150); // Apagar mais rápido que escrever

    return () => {
      clearInterval(typeInterval);
    };
  }, [gameState]);

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

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8 py-16">
        {/* Logo/Title - Mais espaçado */}
        <div className="text-center mb-32">
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tight text-white leading-none mb-8 font-mono">
            {typedText}
            <span className="typing-cursor">|</span>
          </h1>
          <div className="w-32 h-2 bg-white mx-auto mb-12"></div>
          
          {/* Texto explicativo principal */}
          <div className="max-w-4xl mx-auto mb-70">
            <p className="text-2xl md:text-3xl lg:text-4xl text-gray-200 font-medium leading-relaxed tracking-wide">
              Receba uma palavra, digite associações rápidas e conquiste o maior número de pontos antes que o tempo acabe.
            </p>
          </div>
        </div>
        {/* Botão principal - Design simples e funcional */}
        <button
          onClick={startGame}
          className="bg-white text-black text-4xl md:text-5xl font-black tracking-wider px-20 py-8 rounded-2xl hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl hover:shadow-2xl border-4 border-white mt-20"
        >
          JOGAR AGORA
        </button>

        {/* Leaderboard */}
        <div style={{ marginTop: '120px' }} className="w-full max-w-lg">
          <Leaderboard />
        </div>

       </div>
    </div>
  );
}