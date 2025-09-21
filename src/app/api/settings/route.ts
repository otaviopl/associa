import { NextResponse } from 'next/server';
import { checkAndResetDaily } from '@/lib/db';

// GET /api/settings - Obter configurações
export async function GET() {
  try {
    const data = await checkAndResetDaily();
    return NextResponse.json(data.settings);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
