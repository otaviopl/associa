# 🧠 Associa Rápida

Um jogo de associação de palavras em tempo real construído com Next.js e TypeScript.

## 🎮 Sobre o Jogo

**Associa Rápida** é um jogo onde você tem 45 segundos para fazer o máximo de associações possíveis com palavras-estímulo. O jogo apresenta diferentes temas e você deve digitar palavras relacionadas o mais rápido possível.

### ✨ Funcionalidades

- ⏱️ **45 segundos** de jogo intenso
- 🎯 **10 temas diferentes** (FRIO, CARRO, FLORESTA, etc.)
- 🔊 **Efeitos sonoros** para acertos e erros  
- 💥 **Efeitos de pressão** que aumentam a cada 10 segundos
- 🏆 **Placar compartilhado** entre todos os jogadores
- 📱 **Design responsivo** e moderno
- 🔄 **Reset diário automático** do placar

## 🚀 Como executar

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm run dev
```

Abra [http://localhost:3000](http://localhost:3000) para jogar!

## 🏗️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **API Routes** - Backend integrado
- **File System** - Persistência de dados

## 🔌 API do Placar

O jogo inclui uma API integrada para o placar compartilhado:

### Endpoints disponíveis:

- `GET /api/scores` - Lista os top 10 scores
- `POST /api/scores` - Adiciona novo score
- `GET /api/settings` - Configurações do sistema

### 📁 Estrutura de dados:

```json
{
  "id": 1,
  "nickname": "Jogador",
  "score": 15,
  "date": "2025-09-21T20:30:00.000Z"
}
```

## 🚀 Deploy na Vercel

```bash
# Build local (opcional)
pnpm run build

# Deploy para produção
vercel --prod
```

## 🎯 Regras do Jogo

1. **Objetivo**: Fazer o máximo de associações válidas em 45 segundos
2. **Temas**: 10 palavras-estímulo com 10 associações cada (100 total)
3. **Pontuação**: 1 ponto por palavra correta
4. **Troca de tema**: Automática após 2-3 palavras encontradas
5. **Placar**: Resetado diariamente às 00:00

## 🎨 Efeitos Especiais

- **Sons**: Ding para acerto, buzz para erro
- **Pulsação**: Flash branco a cada 10 segundos
- **Animações**: Transições suaves e feedback visual
- **Timer**: Mudança de cor conforme tempo restante
