'use client';

interface ResultScreenProps {
  score: number;
  onPlayAgain: () => void;
}

export const ResultScreen = ({ score, onPlayAgain }: ResultScreenProps) => {
  // Determine performance level and message
  const getPerformanceData = (score: number) => {
    if (score >= 15) return {
      emoji: '🏆',
      title: 'Incrível!',
      message: 'Você é um mestre das associações!',
      color: 'text-yellow-400',
      bgColor: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/30'
    };
    if (score >= 10) return {
      emoji: '🌟',
      title: 'Muito Bom!',
      message: 'Excelente capacidade de associação!',
      color: 'text-blue-400',
      bgColor: 'from-blue-500/20 to-purple-500/20',
      borderColor: 'border-blue-500/30'
    };
    if (score >= 5) return {
      emoji: '👍',
      title: 'Bom trabalho!',
      message: 'Continue praticando para melhorar!',
      color: 'text-green-400',
      bgColor: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    };
    return {
      emoji: '💪',
      title: 'Continue tentando!',
      message: 'A prática leva à perfeição!',
      color: 'text-orange-400',
      bgColor: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30'
    };
  };

  const performance = getPerformanceData(score);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Speed lines background effect */}
      <div className="speed-lines"></div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Cartão limpo, fundo preto, texto branco */}
        <div className="text-center max-w-md w-full">
          
          {/* Score principal - Dominante */}
          <div className="mb-12">
            <div className="text-9xl font-black text-white leading-none mb-4">
              {score.toString().padStart(2, '0')}
            </div>
            <div className="w-32 h-1 bg-white mx-auto mb-6"></div>
            <div className="text-xl text-gray-400 font-medium tracking-wide">
              ASSOCIAÇÕES VÁLIDAS
            </div>
          </div>

          {/* Estatísticas minimalistas */}
          <div className="grid grid-cols-2 gap-8 mb-12 text-center">
            <div>
              <div className="text-3xl font-black text-white mb-2">60</div>
              <div className="text-gray-500 text-sm font-medium tracking-wide">SEGUNDOS</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-2">
                {score > 0 ? Math.round(score * 60 / 60) : 0}
              </div>
              <div className="text-gray-500 text-sm font-medium tracking-wide">PALAVRAS/MIN</div>
            </div>
          </div>

          {/* Performance Level */}
          <div className="mb-12">
            <div className="text-2xl font-bold text-white mb-2 tracking-wide">
              {performance.title.toUpperCase()}
            </div>
            <div className="text-gray-400 font-medium">
              {performance.message}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="space-y-4 mb-8">
            <button
              onClick={() => {
                const text = `🧠 ASSOCIA RÁPIDA\n\nFiz ${score} associações em 60 segundos!\nVelocidade: ${score} palavras/min\n\nTeste sua velocidade mental!`;
                if (navigator.share && 'share' in navigator) {
                  navigator.share({ title: 'Associa Rápida', text });
                } else {
                  navigator.clipboard?.writeText(text);
                }
              }}
              className="group relative overflow-hidden bg-gray-800 text-white px-8 py-4 text-lg font-bold tracking-wide hover:bg-gray-700 active:scale-95 transition-all duration-150 w-full border border-gray-700"
            >
              <span className="relative z-10">
                📤 COMPARTILHAR RESULTADO
              </span>
            </button>
            
            <button
              onClick={onPlayAgain}
              className="group energy-button relative overflow-hidden bg-white text-black px-12 py-6 text-xl font-bold tracking-wide hover:bg-gray-100 active:scale-95 transition-all duration-150 w-full"
            >
              <div className="absolute inset-0 bg-black transform translate-x-full group-hover:translate-x-0 transition-transform duration-150"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-150">
                JOGAR NOVAMENTE
              </span>
            </button>
          </div>

          {/* Barra de progresso sutil */}
          <div className="mt-12 w-full h-1 bg-gray-800 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-1000"
              style={{ width: `${Math.min((score / 20) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
