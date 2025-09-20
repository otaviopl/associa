'use client';

import { useState, useEffect } from 'react';

interface ScoreEntry {
  nickname: string;
  score: number;
  date: string;
}

export const Leaderboard = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    // Verificar se é um novo dia e resetar se necessário
    const checkAndResetDaily = () => {
      const today = new Date().toDateString();
      const lastResetDate = localStorage.getItem('last-reset-date');
      
      if (lastResetDate !== today) {
        // É um novo dia, resetar o placar
        localStorage.setItem('associa-scores', '[]');
        localStorage.setItem('last-reset-date', today);
        setScores([]);
      } else {
        // Mesmo dia, carregar scores normalmente
        const savedScores = JSON.parse(localStorage.getItem('associa-scores') || '[]');
        setScores(savedScores);
      }
    };

    checkAndResetDaily();

    // Verificar a cada minuto se mudou o dia
    const interval = setInterval(checkAndResetDaily, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  };

  if (scores.length === 0) {
    return (
      <div className="border border-white/10 rounded-2xl bg-neutral-950/80 backdrop-blur p-8 md:p-10">
        <h2 className="text-sm tracking-widest uppercase text-white/60 mb-6 text-center">
          Placar de Hoje
        </h2>
        <div className="text-center text-white/60">
          <div className="text-4xl mb-3 opacity-60">🎯</div>
          <div className="text-base text-white/90 leading-tight">Nenhum score ainda</div>
          <div className="text-xs text-white/50">Seja o primeiro a jogar!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-2xl bg-neutral-950/80 backdrop-blur p-8 md:p-10">
      <h2 className="text-sm tracking-widest uppercase text-white/60 mb-6 text-center">
        Placar de Hoje
      </h2>
      
      <div className="divide-y divide-white/10">
        {scores.map((entry, index) => (
          <div
            key={`${entry.nickname}-${entry.date}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="text-base font-mono tabular-nums w-6 text-center text-white/60 opacity-60">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
              </div>
              <div>
                <div className="text-base md:text-lg text-white/90 leading-tight">{entry.nickname}</div>
                <div className="text-xs text-white/50">{formatDate(entry.date)}</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-base md:text-lg font-mono tabular-nums text-white/90 leading-tight">{entry.score}</div>
              <div className="text-xs text-white/50">pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
