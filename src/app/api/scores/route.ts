import { NextRequest, NextResponse } from 'next/server';
import { loadData, saveData, getNextId, checkAndResetDaily, type ScoreEntry } from '@/lib/db';

// GET /api/scores - Listar scores ordenados por pontuação
export async function GET() {
  try {
    const data = await checkAndResetDaily();
    
    // Ordenar por score (desc) e limitar a 10
    const sortedScores = data.scores
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    return NextResponse.json(sortedScores);
  } catch (error) {
    console.error('Erro ao buscar scores:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/scores - Adicionar novo score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados obrigatórios
    if (!body.nickname || typeof body.score !== 'number' || !body.date) {
      return NextResponse.json(
        { error: 'Dados inválidos. nickname, score e date são obrigatórios.' },
        { status: 400 }
      );
    }
    
    // Validar tamanho do nickname
    if (body.nickname.trim().length < 2 || body.nickname.trim().length > 20) {
      return NextResponse.json(
        { error: 'Nickname deve ter entre 2 e 20 caracteres.' },
        { status: 400 }
      );
    }
    
    // Validar score
    if (body.score < 0 || body.score > 100) {
      return NextResponse.json(
        { error: 'Score deve estar entre 0 e 100.' },
        { status: 400 }
      );
    }
    
    const data = await checkAndResetDaily();
    
    // Criar novo score
    const newScore: ScoreEntry = {
      id: getNextId(data.scores),
      nickname: body.nickname.trim(),
      score: body.score,
      date: body.date
    };
    
    data.scores.push(newScore);
    await saveData(data);
    
    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar score:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
