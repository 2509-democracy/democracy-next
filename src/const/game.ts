export const THEMES = ["心", "光", "力", "命", "夢", "空", "時", "愛", "道", "美"];

export const DIRECTIONS = ["アイデア重視", "技術重視"];

export const GAME_CONFIG = {
  MAX_TURNS: 2,
  INITIAL_RESOURCE: 10,
  SHOP_SIZE: 5,
  MAX_SELECTED_CARDS: 3,
  REROLL_COST: 3,
  FREE_REROLL_ON_TURN_START: true, // ターン開始時に無料リロール
  TECH_LEVEL_MAX: 5,
  FINAL_BONUS_PER_MAX_TECH: 100,
  // マルチモード設定
  MULTI_GAME: {
    MAX_PLAYERS: 4,
    PREPARATION_TIME: 45, // 準備時間45秒
    EXECUTION_TIME: 30,   // 実行時間30秒
    RESULT_TIME: 10,      // 結果時間10秒
  },
} as const;
