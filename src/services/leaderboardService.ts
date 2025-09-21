interface ScoreEntry {
  nickname: string;
  score: number;
  date: string;
  id?: number;
}

interface LeaderboardData {
  scores: ScoreEntry[];
  lastReset: string;
}

const API_BASE_URL = '/api';

class LeaderboardService {
  // Verificar se é um novo dia e resetar se necessário (agora feito automaticamente no backend)
  async checkAndResetDaily(): Promise<void> {
    // No novo sistema, o reset diário é feito automaticamente pelas API routes
    // Não precisamos verificar manualmente aqui
  }

  // Fallback para localStorage
  private checkAndResetDailyLocal(): void {
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem('last-reset-date');
    
    if (lastResetDate !== today) {
      localStorage.setItem('associa-scores', '[]');
      localStorage.setItem('last-reset-date', today);
    }
  }


  // Buscar todos os scores
  async getScores(): Promise<ScoreEntry[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/scores`);
      if (!response.ok) {
        throw new Error('Erro ao buscar scores');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar scores, usando fallback local:', error);
      return this.getScoresLocal();
    }
  }

  // Fallback local para buscar scores
  private getScoresLocal(): ScoreEntry[] {
    this.checkAndResetDailyLocal();
    return JSON.parse(localStorage.getItem('associa-scores') || '[]');
  }

  // Salvar novo score
  async saveScore(scoreEntry: Omit<ScoreEntry, 'id'>): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreEntry),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        throw new Error(errorData.error || 'Erro ao salvar score');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar score, usando fallback local:', error);
      return this.saveScoreLocal(scoreEntry);
    }
  }

  // Fallback local para salvar score
  private saveScoreLocal(scoreEntry: Omit<ScoreEntry, 'id'>): boolean {
    try {
      const existingScores = JSON.parse(localStorage.getItem('associa-scores') || '[]');
      const updatedScores = [...existingScores, scoreEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      localStorage.setItem('associa-scores', JSON.stringify(updatedScores));
      return true;
    } catch (error) {
      console.error('Erro ao salvar score local:', error);
      return false;
    }
  }
}

export const leaderboardService = new LeaderboardService();
export type { ScoreEntry };
