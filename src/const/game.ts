import { TechCard } from '@/types/game';

export const ALL_TECH_CARDS: TechCard[] = [
  { id: 'react', name: 'React', cost: 2, level: 1 },
  { id: 'vue', name: 'Vue.js', cost: 1, level: 1 },
  { id: 'express', name: 'Express.js', cost: 1, level: 1 },
  { id: 'django', name: 'Django', cost: 2, level: 1 },
  { id: 'tensorflow', name: 'TensorFlow', cost: 3, level: 1 },
  { id: 'pytorch', name: 'PyTorch', cost: 3, level: 1 },
  { id: 'fastapi', name: 'FastAPI', cost: 2, level: 1 },
  { id: 'jwt', name: 'JWT', cost: 1, level: 1 },
  { id: 'redis', name: 'Redis', cost: 2, level: 1 },
  { id: 'oauth', name: 'OAuth', cost: 2, level: 1 },
  { id: 'nextjs', name: 'Next.js', cost: 3, level: 1 },
  { id: 'threejs', name: 'Three.js', cost: 2, level: 1 },
  { id: 'websocket', name: 'WebSocket', cost: 2, level: 1 },
];

export const THEMES = ['心', '光', '力', '命', '夢', '空', '時', '愛', '道', '美'];

export const DIRECTIONS = ['アイデア重視', '技術重視'];

export const GAME_CONFIG = {
  MAX_TURNS: 10,
  INITIAL_RESOURCE: 10,
  SHOP_SIZE: 5,
  MAX_SELECTED_CARDS: 3,
  REROLL_COST: 3,
  TECH_LEVEL_MAX: 5,
  FINAL_BONUS_PER_MAX_TECH: 100,
} as const;