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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full text-center mx-auto">
        {/* Celebration Animation */}
        <div className="mb-8">
          <div className="text-8xl mb-4">
            {performance.emoji}
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">
            {performance.title}
          </h1>
          <p className="text-gray-300 text-lg">
            {performance.message}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-gray-800 bg-opacity-50 rounded-3xl p-8 border border-gray-700 mb-8">
          <p className="text-gray-300 text-xl mb-4">Suas associações válidas:</p>
          <div className={`text-8xl font-bold ${performance.color} mb-2`}>
            {score}
          </div>
          <div className="flex justify-center items-center gap-2 text-gray-400">
            <span className="text-lg">🎯</span>
            <span>palavra{score !== 1 ? 's' : ''} associada{score !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={onPlayAgain}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🎮 Jogar Novamente
          </button>
          
          <div className="pt-2">
            <p className="text-gray-400 text-sm">
              Desafie-se a superar sua pontuação!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-800 bg-opacity-30 rounded-2xl p-4">
            <div className="text-2xl font-bold text-white">30s</div>
            <div className="text-gray-400 text-sm">Tempo de jogo</div>
          </div>
          <div className="bg-gray-800 bg-opacity-30 rounded-2xl p-4">
            <div className="text-2xl font-bold text-white">{score > 0 ? Math.round(score / 0.5) : 0}</div>
            <div className="text-gray-400 text-sm">Palavras/min</div>
          </div>
        </div>
      </div>
    </div>
  );
};
