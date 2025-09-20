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
  const [, setValidAssociations] = useState<string[]>([]);
  const [lastAnswer, setLastAnswer] = useState<{word: string, isValid: boolean} | null>(null);
  const [wordsFoundInCurrentTheme, setWordsFoundInCurrentTheme] = useState(0);
  const [wordChangeKey, setWordChangeKey] = useState(0);
  const [inputFeedback, setInputFeedback] = useState<'valid' | 'invalid' | null>(null);
  const [recentAnswers, setRecentAnswers] = useState<string[]>([]);
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

  // Função para mudar o tema quando encontrar 2-3 palavras
  const changeTheme = () => {
    const availableWords = STIMULUS_WORDS.filter(w => w !== currentWord);
    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentWord(newWord);
    setWordsFoundInCurrentTheme(0);
    setWordChangeKey(prev => prev + 1); // Trigger animation
    setLastAnswer({word: `${newWord}!`, isValid: true});
    
    // Clear the feedback after 1 second (mais rápido)
    setTimeout(() => {
      setLastAnswer(null);
    }, 1000);
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
      setInputFeedback('valid');
      
      // Add to recent answers (keep last 3)
      setRecentAnswers(prev => [answer, ...prev.slice(0, 2)]);

      // Muda tema após encontrar 2-3 palavras (mais rápido)
      const wordsToChange = 2 + Math.floor(Math.random() * 2); // 2 a 3 palavras
      if (wordsFoundInCurrentTheme + 1 >= wordsToChange) {
        setTimeout(() => changeTheme(), 800); // Mais rápido
      }
    } else {
      // Invalid answer (not in current theme dictionary or already used)
      setLastAnswer({word: answer, isValid: false});
      setInputFeedback('invalid');
    }

    // Clear input feedback after animation
    setTimeout(() => {
      setInputFeedback(null);
    }, 200);

    setInputValue('');
  };

  // Calculate time progress for visual indicator
  const timeProgress = (time / 60) * 100;
  const timeColor = time > 30 ? 'bg-emerald-500' : time > 15 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Speed lines background effect */}
      <div className="speed-lines"></div>
      
      {/* Timer - Canto superior direito */}
      <div className="fixed top-8 right-8 z-20">
        <div className="text-right">
          <div className={`text-6xl font-black text-white font-mono leading-none ${time <= 10 ? 'animate-timer-pulse text-gray-300' : ''}`}>
            {time.toString().padStart(2, '0')}
          </div>
          <div className="w-20 bg-gray-800 h-2 mt-2 overflow-hidden rounded-full">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${timeColor} rounded-full`}
              style={{ width: `${timeProgress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 font-mono">TEMPO</div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Main Game - Apenas 3 elementos principais */}
        
        {/* 1. Palavra Estímulo - Centralizada e dominante */}
        <div className="text-center mb-12 relative">
          <div className="animate-flash-behind absolute inset-0 rounded-lg" key={`flash-${wordChangeKey}`}></div>
          <h1 
            className="text-8xl md:text-9xl font-black tracking-tight text-white leading-none mb-4 animate-word-change relative z-10"
            key={`word-${wordChangeKey}`}
          >
            {currentWord}
          </h1>
        </div>

        {/* 2. Campo de Input - Logo abaixo da palavra */}
        <div className="w-full max-w-2xl mb-8 relative">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="DIGITE AQUI"
                className={`w-full bg-transparent border-b-4 border-white text-center text-3xl font-bold text-white placeholder-gray-500 focus:outline-none focus:border-gray-300 py-4 tracking-widest uppercase transition-all duration-150 ${
                  inputFeedback === 'valid' ? 'animate-input-valid' : 
                  inputFeedback === 'invalid' ? 'animate-input-invalid' : ''
                }`}
                autoFocus
              />
              {inputValue && (
                <div className="input-line"></div>
              )}
            </div>
          </form>
          
          {/* Histórico de respostas recentes */}
          {recentAnswers.length > 0 && (
            <div className="mt-4 text-center">
              <div className="flex justify-center gap-3 text-gray-500 text-sm font-mono">
                {recentAnswers.map((answer, index) => (
                  <span key={index} className="opacity-80" style={{ opacity: 1 - (index * 0.3) }}>
                    ✓ {answer.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Feedback Visual - Minimalista */}
        {lastAnswer && (
          <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 font-bold text-xl tracking-wide transition-all duration-150 ${
            lastAnswer.isValid 
              ? 'bg-white text-black animate-flash' 
              : 'bg-gray-800 text-white animate-pulse-gray'
          }`}>
            {lastAnswer.isValid ? `✓ ${lastAnswer.word.toUpperCase()}` : `✗ ${lastAnswer.word.toUpperCase()}`}
          </div>
        )}

        {/* Score - Discreto no canto inferior esquerdo */}
        <div className="fixed bottom-8 left-8 text-white font-mono">
          <div className="text-4xl font-black">{score.toString().padStart(2, '0')}</div>
          <div className="text-gray-500 text-sm font-medium tracking-wide">PONTOS</div>
        </div>

        {/* Progresso - Linha sutil na parte inferior */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-900">
          <div 
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${(score / 20) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};