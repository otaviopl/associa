'use client';

import { useState, useEffect, useRef } from 'react';

// Data for the MVP - expanded vocabulary
const STIMULUS_WORDS = ['FRIO', 'CARRO', 'FLORESTA', 'MÚSICA', 'CIDADE', 'PRAIA', 'FOGO', 'SONHO', 'LIVRO', 'COMIDA'];
const DICTIONARY = new Set([
  // FRIO
  'neve', 'gelo', 'inverno', 'casaco', 'calafrio', 'geada', 'polar', 'tremor', 'aquecedor', 'cobertor',
  // CARRO
  'motor', 'roda', 'volante', 'estrada', 'gasolina', 'freio', 'velocidade', 'pneu', 'garagem', 'viagem',
  // FLORESTA
  'arvore', 'mato', 'trilha', 'passaro', 'folha', 'madeira', 'natureza', 'verde', 'sombra', 'animais',
  // MÚSICA
  'som', 'ritmo', 'banda', 'melodia', 'cantar', 'guitarra', 'piano', 'dança', 'nota', 'audio',
  // CIDADE
  'predio', 'rua', 'ponte', 'pessoas', 'transito', 'semaforo', 'urbano', 'movimento', 'loja', 'centro',
  // PRAIA
  'areia', 'mar', 'onda', 'sol', 'bronzeado', 'surfar', 'concha', 'litoral', 'verao', 'agua',
  // FOGO
  'calor', 'chama', 'fumaca', 'luz', 'queimar', 'fogueira', 'bombeiro', 'cinza', 'brasas', 'incendio',
  // SONHO
  'dormir', 'pesadelo', 'acordar', 'mente', 'imaginacao', 'cama', 'noite', 'fantasia', 'desejo', 'sono',
  // LIVRO
  'ler', 'pagina', 'historia', 'autor', 'biblioteca', 'conhecimento', 'papel', 'texto', 'aprender', 'romance',
  // COMIDA
  'comer', 'sabor', 'cozinha', 'fome', 'prato', 'tempero', 'receita', 'doce', 'salgado', 'nutricao'
]);

interface GameScreenProps {
  showResults: (score: number) => void;
}

export const GameScreen = ({ showResults }: GameScreenProps) => {
  const [time, setTime] = useState(30); // Reduzido para 30 segundos
  const [score, setScore] = useState(0);
  const [currentWord] = useState(STIMULUS_WORDS[Math.floor(Math.random() * STIMULUS_WORDS.length)]);
  const [usedWords, setUsedWords] = useState(new Set<string>());
  const [inputValue, setInputValue] = useState('');
  const [validAssociations, setValidAssociations] = useState<string[]>([]);
  const [lastAnswer, setLastAnswer] = useState<{word: string, isValid: boolean} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Main game loop timer
  useEffect(() => {
    if (time <= 0) {
      showResults(score);
      return;
    }

    const timer = setInterval(() => {
      setTime(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [time, score, showResults]);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = inputValue.trim().toLowerCase();

    if (!answer) return;

    // Validation
    if (DICTIONARY.has(answer) && !usedWords.has(answer)) {
      // Correct answer
      setScore(prev => prev + 1);
      setUsedWords(prev => new Set(prev).add(answer));
      setValidAssociations(prev => [...prev, answer]);
      setLastAnswer({word: answer, isValid: true});
    } else {
      // Invalid answer (already used or not in dictionary)
      setLastAnswer({word: answer, isValid: false});
    }

    setInputValue('');
  };

  // Calculate time progress for visual indicator
  const timeProgress = (time / 30) * 100;
  const timeColor = time > 15 ? 'bg-emerald-500' : time > 10 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl mx-auto">
        {/* Timer Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${timeColor}`}
              style={{ width: `${timeProgress}%` }}
            />
          </div>
          <div className="text-center mt-3">
            <span className={`text-2xl font-bold ${time <= 10 ? 'text-red-400' : 'text-white'}`}>
              {time}s
            </span>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-gray-800 bg-opacity-50 rounded-3xl p-8 border border-gray-700">
          {/* Current Word */}
          <div className="text-center mb-8">
            <p className="text-gray-300 text-lg mb-3">Digite todas as associações que conseguir para:</p>
            <h2 className="text-6xl font-bold text-white tracking-wider mb-6">
              {currentWord}
            </h2>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="mb-6">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite uma associação..."
              className="w-full bg-gray-700 border-2 border-gray-600 rounded-2xl p-4 text-xl text-center text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all"
              autoFocus
            />
          </form>

          {/* Feedback */}
          {lastAnswer && (
            <div className={`text-center mb-4 p-3 rounded-xl ${
              lastAnswer.isValid 
                ? 'bg-green-800 bg-opacity-50 text-green-300' 
                : 'bg-red-800 bg-opacity-50 text-red-300'
            }`}>
              <span className="font-semibold">
                {lastAnswer.isValid ? '✅ ' : '❌ '}
                &quot;{lastAnswer.word}&quot;
                {lastAnswer.isValid ? ' - Ótima associação!' : ' - Inválida ou já usada'}
              </span>
            </div>
          )}

          {/* Score */}
          <div className="text-center mb-6">
            <div className="bg-gray-700 bg-opacity-50 rounded-2xl p-6 inline-block">
              <p className="text-gray-300 text-sm mb-1">Associações válidas</p>
              <p className="text-4xl font-bold text-white">{score}</p>
            </div>
          </div>

          {/* Valid Associations List */}
          {validAssociations.length > 0 && (
            <div>
              <h3 className="text-gray-300 text-sm mb-3 text-center">Suas associações:</h3>
              <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto">
                {validAssociations.map((word, index) => (
                  <span 
                    key={index}
                    className="bg-blue-800 bg-opacity-50 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-center text-gray-400 text-sm max-w-md mx-auto">
          <p>💡 Digite palavras relacionadas à palavra-chave. Cada associação válida vale 1 ponto!</p>
        </div>
      </div>
    </div>
  );
};