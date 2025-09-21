import { promises as fs } from 'fs';
import path from 'path';

export interface ScoreEntry {
  id: number;
  nickname: string;
  score: number;
  date: string;
}

export interface LeaderboardData {
  scores: ScoreEntry[];
  settings: {
    lastReset: string;
  };
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'leaderboard.json');

// Garantir que o diretório data existe
async function ensureDataDir() {
  const dataDir = path.dirname(DB_FILE_PATH);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Carregar dados do arquivo
export async function loadData(): Promise<LeaderboardData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existe, criar com dados iniciais
    const initialData: LeaderboardData = {
      scores: [],
      settings: {
        lastReset: new Date().toDateString()
      }
    };
    await saveData(initialData);
    return initialData;
  }
}

// Salvar dados no arquivo
export async function saveData(data: LeaderboardData): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    throw new Error('Falha ao salvar dados');
  }
}

// Obter próximo ID disponível
export function getNextId(scores: ScoreEntry[]): number {
  if (scores.length === 0) return 1;
  return Math.max(...scores.map(s => s.id)) + 1;
}

// Verificar se é um novo dia e resetar se necessário
export async function checkAndResetDaily(): Promise<LeaderboardData> {
  const data = await loadData();
  const today = new Date().toDateString();
  
  if (data.settings.lastReset !== today) {
    // É um novo dia, resetar scores
    data.scores = [];
    data.settings.lastReset = today;
    await saveData(data);
  }
  
  return data;
}
