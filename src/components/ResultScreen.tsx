'use client';

import { useState } from 'react';

interface ResultScreenProps {
  score: number;
  onPlayAgain: () => void;
}

interface ScoreEntry {
  nickname: string;
  score: number;
  date: string;
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
    
    const newEntry: ScoreEntry = {
      nickname: nickname.trim(),
      score,
      date: new Date().toISOString()
    };

    // Simulate network delay
    setTimeout(() => {
      const existingScores = JSON.parse(localStorage.getItem('associa-scores') || '[]');
      
      const updatedScores = [...existingScores, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      localStorage.setItem('associa-scores', JSON.stringify(updatedScores));
      setIsLoading(false);
      setScoreSaved(true);
      
      // Reset after showing success
      setTimeout(() => {
        setScoreSaved(false);
      }, 1500);
    }, 800);
  };

  const shareResult = async () => {
    const text = `🧠 ASSOCIA RÁPIDA\n\nFiz ${score} associações em 60 segundos!\nVelocidade: ${score} palavras/min\n\nTeste sua velocidade mental!`;
    
    if (navigator.share && 'share' in navigator) {
      try {
        await navigator.share({ title: 'Associa Rápida', text });
      } catch (err) {
        navigator.clipboard?.writeText(text);
      }
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  const getFeedbackMessage = (score: number) => {
    if (score >= 15) return {
      title: 'INCRÍVEL!',
      message: 'Você é um mestre das associações! Velocidade mental excepcional.'
    };
    if (score >= 10) return {
      title: 'MUITO BOM!',
      message: 'Excelente capacidade de associação! Continue assim.'
    };
    if (score >= 5) return {
      title: 'BOM TRABALHO!',
      message: 'Continue praticando para melhorar ainda mais sua velocidade.'
    };
    return {
      title: 'CONTINUE TENTANDO!',
      message: 'A prática leva à perfeição! Tente novamente para melhorar.'
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
              <div className="text-3xl md:text-4xl font-mono tabular-nums text-white/90 leading-none">60</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold mt-2">SEGUNDOS</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-mono tabular-nums text-white/90 leading-none">
                {score}
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/60 font-semibold mt-2">PALAVRAS/MIN</div>
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