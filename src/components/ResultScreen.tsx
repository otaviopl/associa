'use client';

import { useState } from 'react';
import { leaderboardService, type ScoreEntry } from '@/services/leaderboardService';

// Total de combinações possíveis (mesmo valor do GameScreen)
const TOTAL_POSSIBLE_COMBINATIONS = 100;

interface ResultScreenProps {
  score: number;
  onPlayAgain: () => void;
}

export const ResultScreen = ({ score, onPlayAgain }: ResultScreenProps) => {
  const [nickname, setNickname] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const saveScore = async () => {
    if (!nickname.trim() || nickname.trim().length < 2) {
      setError('Nome deve ter pelo menos 2 caracteres');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setIsLoading(true);
    
    const newEntry: Omit<ScoreEntry, 'id'> = {
      nickname: nickname.trim(),
      score,
      date: new Date().toISOString()
    };

    try {
      const success = await leaderboardService.saveScore(newEntry);
      
      if (success) {
        setIsLoading(false);
        setScoreSaved(true);
        
        // Reset after showing success
        setTimeout(() => {
          setScoreSaved(false);
        }, 1500);
      } else {
        throw new Error('Falha ao salvar score');
      }
    } catch (error) {
      console.error('Erro ao salvar score:', error);
      setError('Erro ao salvar. Tente novamente.');
      setIsLoading(false);
      setTimeout(() => setError(''), 3000);
    }
  };

  const shareResult = async () => {
    const text = `🧠 ASSOCIA RÁPIDA\n\nFiz ${score} associações em 45 segundos!\nVelocidade: ${Math.round((score / 45) * 60)} palavras/min\n\nTeste sua velocidade mental!`;
    
    if (navigator.share && 'share' in navigator) {
      try {
        await navigator.share({ title: 'Associa Rápida', text });
      } catch {
        navigator.clipboard?.writeText(text);
      }
    } else {
      navigator.clipboard?.writeText(text);
    }
  };


  const getFeedbackMessage = (score: number) => {
    if (score >= 20) return {
      title: 'EXTRAORDINÁRIO! 🏆',
      message: `Você conseguiu ${score} pontos! Você pode fazer até ${TOTAL_POSSIBLE_COMBINATIONS} pontos.`
    };
    if (score >= 15) return {
      title: 'INCRÍVEL!',
      message: `Você é um mestre das associações! Você pode fazer até ${TOTAL_POSSIBLE_COMBINATIONS} pontos.`
    };
    if (score >= 10) return {
      title: 'MUITO BOM!',
      message: `Excelente capacidade de associação! Você pode fazer até ${TOTAL_POSSIBLE_COMBINATIONS} pontos.`
    };
    if (score >= 5) return {
      title: 'BOM TRABALHO!',
      message: `Continue praticando! Você pode fazer até ${TOTAL_POSSIBLE_COMBINATIONS} pontos.`
    };
    return {
      title: 'CONTINUE TENTANDO!',
      message: `A prática leva à perfeição! Você pode fazer até ${TOTAL_POSSIBLE_COMBINATIONS} pontos.`
    };
  };

  const feedback = getFeedbackMessage(score);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-150">
      {/* Speed lines background effect */}
      <div className="speed-lines"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          
          {/* 1) Score principal responsivo */}
          <div>
            <div className="text-[22vw] md:text-[14vw] font-black leading-none font-mono tabular-nums">
              {score.toString().padStart(2, '0')}
            </div>
            {/* Linha fina decorativa */}
            <div className="h-[2px] w-28 bg-white/20 rounded-full mx-auto mt-4 mb-3"></div>
            {/* Legenda */}
            <div className="text-xs uppercase tracking-[0.3em] text-white/60 font-semibold">
              ASSOCIAÇÕES VÁLIDAS
            </div>
          </div>

          {/* 2) Métricas em grid 2 colunas */}
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-mono tabular-nums text-white/90 leading-none">45</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold mt-2">SEGUNDOS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-mono tabular-nums text-white/90 leading-none">
                {Math.round((score / 45) * 60)}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold mt-2">PALAVRAS/MIN</div>
            </div>
          </div>

          {/* 2.5) Informações sobre combinações */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-5 shadow-xl shadow-black/30">
            <div className="text-center mb-4">
              <div className="text-sm uppercase tracking-[0.25em] text-white/60 font-bold">📊 PROGRESSO NO DICIONÁRIO</div>
            </div>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-2xl font-black tabular-nums text-white leading-none">{score}/{TOTAL_POSSIBLE_COMBINATIONS}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold mt-1">PALAVRAS ENCONTRADAS</div>
              </div>
              <div>
                <div className="text-2xl font-black tabular-nums text-white leading-none">{Math.round((score / TOTAL_POSSIBLE_COMBINATIONS) * 100)}%</div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold mt-1">DICIONÁRIO EXPLORADO</div>
              </div>
            </div>
            
            {/* Barra de progresso visual */}
            <div className="mt-4">
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((score / TOTAL_POSSIBLE_COMBINATIONS) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 3) Mensagem de feedback */}
          <div>
            <div className="text-lg md:text-xl font-semibold text-white/90">
              {feedback.title}
            </div>
            <div className="text-sm text-white/60 leading-relaxed mt-2 max-w-[48ch] mx-auto">
              {feedback.message}
            </div>
          </div>

          {/* 4) Card "Salvar no placar" */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur px-5 py-5">
            <div className="text-center mb-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold mb-1">SALVAR NO PLACAR</div>
              <div className="text-xs text-white/50">Digite seu nickname para aparecer no ranking</div>
            </div>
            
            {error && (
              <div className="text-red-300/80 text-xs text-center mb-3">{error}</div>
            )}
            
            <div className="flex gap-3">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="nickname"
                maxLength={12}
                className="flex-1 bg-transparent border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-white/40 text-center"
                onKeyPress={(e) => e.key === 'Enter' && saveScore()}
                disabled={isLoading || scoreSaved}
              />
              <button
                onClick={saveScore}
                disabled={!nickname.trim() || nickname.trim().length < 2 || isLoading || scoreSaved}
                className="px-6 py-3 rounded-xl border border-white/10 text-xs uppercase tracking-widest text-white hover:bg-white/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : scoreSaved ? (
                  '✓'
                ) : (
                  'SALVAR'
                )}
              </button>
            </div>
          </div>

          {/* 5) Botões de ação principais */}
          <div className="space-y-4">
            {/* Botão Principal - Jogar novamente */}
            <button
              onClick={onPlayAgain}
              className="w-full rounded-full border border-white/10 bg-white text-black py-3 text-xs uppercase tracking-widest font-medium hover:shadow-lg hover:shadow-white/20 active:scale-[0.98] transition-all duration-150"
            >
              JOGAR NOVAMENTE
            </button>
            
            {/* Botão Secundário - Compartilhar */}
            <button
              onClick={shareResult}
              className="w-full rounded-full border border-white/10 bg-transparent text-white py-3 text-xs uppercase tracking-widest font-medium hover:bg-white/10 active:scale-[0.98] transition-all duration-150"
            >
              COMPARTILHAR RESULTADO
            </button>
          </div>

          {/* 6) Linha decorativa final */}
          <div className="h-[1px] w-32 bg-white/10 rounded-full mx-auto"></div>
          
        </div>
      </div>
    </div>
  );
};