'use client';

import { useState, useEffect, useRef } from 'react';

// Data for the MVP - cada tema com suas palavras específicas
const STIMULUS_WORDS = ['FRIO', 'CARRO', 'FLORESTA', 'MÚSICA', 'CIDADE', 'PRAIA', 'FOGO', 'SONHO', 'LIVRO', 'COMIDA'];

// Dicionário organizado por tema - versão reduzida (8-10 palavras por tema)
const THEME_DICTIONARIES = {
  'FRIO': new Set([
    'neve', 'gelo', 'inverno', 'casaco', 'calafrio', 'geada', 'aquecedor', 'cobertor', 'esqui', 'sorvete'
  ]),
  'CARRO': new Set([
    'motor', 'roda', 'volante', 'estrada', 'gasolina', 'freio', 'velocidade', 'pneu', 'garagem', 'viagem'
  ]),
  'FLORESTA': new Set([
    'arvore', 'mato', 'trilha', 'passaro', 'folha', 'madeira', 'natureza', 'verde', 'sombra', 'animais'
  ]),
  'MÚSICA': new Set([
    'som', 'ritmo', 'banda', 'melodia', 'cantar', 'guitarra', 'piano', 'dança', 'nota', 'palco'
  ]),
  'CIDADE': new Set([
    'predio', 'rua', 'ponte', 'pessoas', 'transito', 'semaforo', 'urbano', 'loja', 'centro', 'escola'
  ]),
  'PRAIA': new Set([
    'areia', 'mar', 'onda', 'sol', 'bronzeado', 'surfar', 'concha', 'agua', 'peixe', 'barco'
  ]),
  'FOGO': new Set([
    'calor', 'chama', 'fumaca', 'luz', 'queimar', 'fogueira', 'bombeiro', 'cinza', 'brasas', 'incendio'
  ]),
  'SONHO': new Set([
    'dormir', 'pesadelo', 'acordar', 'mente', 'imaginacao', 'cama', 'noite', 'fantasia', 'desejo', 'sono'
  ]),
  'LIVRO': new Set([
    'ler', 'pagina', 'historia', 'autor', 'biblioteca', 'conhecimento', 'papel', 'texto', 'aprender', 'romance'
  ]),
  'COMIDA': new Set([
    'comer', 'sabor', 'cozinha', 'fome', 'prato', 'tempero', 'receita', 'doce', 'salgado', 'chef'
  ])
};

interface GameScreenProps {
  showResults: (score: number) => void;
}

export const GameScreen = ({ showResults }: GameScreenProps) => {
  const [time, setTime] = useState(30);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState(STIMULUS_WORDS[Math.floor(Math.random() * STIMULUS_WORDS.length)]);
  const [usedWords, setUsedWords] = useState(new Set<string>());
  const [inputValue, setInputValue] = useState('');
  const [validAssociations, setValidAssociations] = useState<string[]>([]);
  const [lastAnswer, setLastAnswer] = useState<{word: string, isValid: boolean} | null>(null);
  const [wordsFoundInCurrentTheme, setWordsFoundInCurrentTheme] = useState(0);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
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

  // Função para gerar uma dica fixa para o tema (apenas 1 palavra)
  const generateHintForTheme = (themeDictionary: Set<string>) => {
    const availableHints = Array.from(themeDictionary).filter(word => !usedWords.has(word));
    if (availableHints.length === 0) return null;
    const randomHint = availableHints[Math.floor(Math.random() * availableHints.length)];
    return randomHint;
  };

  // Auto-focus input and maybe show initial hint
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // 30% de chance de mostrar dica no tema inicial
    const shouldShowInitialHint = Math.random() < 0.3;
    if (shouldShowInitialHint) {
      const initialThemeDictionary = THEME_DICTIONARIES[currentWord as keyof typeof THEME_DICTIONARIES];
      const hint = generateHintForTheme(initialThemeDictionary);
      setCurrentHint(hint);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Função para mudar o tema quando encontrar 2-3 palavras
  const changeTheme = () => {
    const availableWords = STIMULUS_WORDS.filter(w => w !== currentWord);
    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(newWord);
    setWordsFoundInCurrentTheme(0);
    setLastAnswer({word: `Novo tema: ${newWord}!`, isValid: true});
    
    // 30% de chance de mostrar uma dica quando muda tema
    const shouldShowHint = Math.random() < 0.3;
    if (shouldShowHint) {
      const newThemeDictionary = THEME_DICTIONARIES[newWord as keyof typeof THEME_DICTIONARIES];
      const hint = generateHintForTheme(newThemeDictionary);
      setCurrentHint(hint);
    } else {
      setCurrentHint(null);
    }
    
    // Clear the feedback after 2 seconds
    setTimeout(() => {
      setLastAnswer(null);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = inputValue.trim().toLowerCase();

    if (!answer) return;

    // Get current theme dictionary
    const currentThemeDictionary = THEME_DICTIONARIES[currentWord as keyof typeof THEME_DICTIONARIES];

    // Validation - palavra deve estar no dicionário do tema atual E não ter sido usada
    if (currentThemeDictionary.has(answer) && !usedWords.has(answer)) {
      // Correct answer
      setScore(prev => prev + 1);
      setUsedWords(prev => new Set(prev).add(answer));
      setValidAssociations(prev => [...prev, answer]);
      setLastAnswer({word: answer, isValid: true});
      setWordsFoundInCurrentTheme(prev => prev + 1);

      // Muda tema após encontrar 2-3 palavras (mais rápido)
      const wordsToChange = 2 + Math.floor(Math.random() * 2); // 2 a 3 palavras
      if (wordsFoundInCurrentTheme + 1 >= wordsToChange) {
        setTimeout(() => changeTheme(), 1000); // Aguarda 1 segundo antes de mudar
      }
    } else {
      // Invalid answer (not in current theme dictionary or already used)
      setLastAnswer({word: answer, isValid: false});
    }

    setInputValue('');
  };

  // Calculate time progress for visual indicator
  const timeProgress = (time / 60) * 100;
  const timeColor = time > 30 ? 'bg-emerald-500' : time > 15 ? 'bg-yellow-500' : 'bg-red-500';

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
            <span className={`text-2xl font-bold ${time <= 15 ? 'text-red-400' : 'text-white'}`}>
              {time}s
            </span>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-gray-800 bg-opacity-50 rounded-3xl p-8 border border-gray-700">
          {/* Current Word */}
          <div className="text-center mb-8">
            <p className="text-gray-300 text-lg mb-2">Digite palavras relacionadas apenas com:</p>
            <h2 className="text-6xl font-bold text-white tracking-wider mb-4">
              {currentWord}
            </h2>
            {currentHint && (
              <div className="mb-3 text-yellow-400 text-lg">
                💡 Dica: <span className="font-semibold">{currentHint}</span>
              </div>
            )}
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
                {lastAnswer.isValid ? ' - Ótima associação!' : ' - Inválida'}
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
          <p>💡 Digite palavras relacionadas à palavra-chave. Às vezes aparecem dicas!</p>
        </div>
      </div>
    </div>
  );
};