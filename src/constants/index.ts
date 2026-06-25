export const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export const WEATHER_CACHE_TTL_MS = 5 * 60 * 1000 // 5分

export const FAVORITES_STORAGE_KEY = 'favorites'

export const TIME_SLOTS = {
  MORNING: { label: '朝', hours: [6, 7, 8, 9] },
  AFTERNOON: { label: '昼', hours: [11, 12, 13, 14] },
  EVENING: { label: '夜', hours: [18, 19, 20, 21] },
} as const

// WMO Weather interpretation codes → 日本語ラベル
export const WEATHER_CODE_MAP: Record<number, string> = {
  0: '快晴',
  1: '晴れ',
  2: '一部曇り',
  3: '曇り',
  45: '霧',
  48: '霧氷',
  51: '小雨',
  53: '雨',
  55: '強雨',
  61: '小雨',
  63: '雨',
  65: '大雨',
  71: '小雪',
  73: '雪',
  75: '大雪',
  80: 'にわか雨',
  81: 'にわか雨',
  82: '強いにわか雨',
  95: '雷雨',
  99: '激しい雷雨',
}

export function getWeatherLabel(code: number): string {
  return WEATHER_CODE_MAP[code] ?? '不明'
}
