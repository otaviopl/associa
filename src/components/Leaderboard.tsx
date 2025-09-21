'use client';

import { useState, useEffect } from 'react';
import { leaderboardService, type ScoreEntry } from '@/services/leaderboardService';

export const Leaderboard = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    const loadScores = async () => {
      const scores = await leaderboardService.getScores();
      setScores(scores);
    };

    loadScores();

    // Verificar a cada minuto se mudou o dia e recarregar scores
    const interval = setInterval(loadScores, 60000);
    
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
      <div className="rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur">
        {/* Cabeçalho do placar */}
        <div className="px-5 py-4 border-b border-white/10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-white/50 font-semibold text-center">
            PLACAR DE HOJE
          </h2>
        </div>
        
        {/* Estado vazio */}
        <div className="px-5 py-8 text-center">
          <div className="text-4xl mb-3 opacity-40 filter grayscale">🎯</div>
          <div className="text-sm text-white/90 leading-tight mb-1">Nenhum score ainda</div>
          <div className="text-xs text-white/50">seja o primeiro a jogar!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur">
      {/* Cabeçalho do placar */}
      <div className="px-5 py-4 border-b border-white/10">
        <h2 className="text-xs uppercase tracking-[0.2em] text-white/50 font-semibold text-center">
          PLACAR DE HOJE
        </h2>
      </div>
      
      {/* Lista de scores */}
      <div className="divide-y divide-white/10">
        {scores.map((entry, index) => (
          <div
            key={`${entry.nickname}-${entry.date}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors duration-150"
          >
            {/* Rank e nome */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="font-mono tabular-nums w-6 text-center text-white/60 text-sm">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white/90 leading-tight truncate">{entry.nickname}</div>
                <div className="text-xs text-white/50">{formatDate(entry.date)}</div>
              </div>
            </div>
            
            {/* Pontuação */}
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-mono tabular-nums text-white/90 leading-tight">{entry.score}</div>
              <div className="text-xs text-white/50">pts</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};