import type { OutfitRule } from '../types'

// 気温・湿度・天気状態から服装を決定するルール一覧
// 上から順に評価し、最初にマッチしたものを採用する
export const OUTFIT_RULES: OutfitRule[] = [
  // 雨・雪系
  { tempMin: -99, tempMax: 99, humidityMax: 100, condition: '雪', suggestion: '厚手のコート、防水ブーツ、手袋。傘は折りたたみ式が便利です。' },
  { tempMin: -99, tempMax: 99, humidityMax: 100, condition: '大雪', suggestion: '防水の厚手コート、長靴、手袋必携。外出は最小限に。' },
  { tempMin: -99, tempMax: 99, humidityMax: 100, condition: '雨', suggestion: '傘必携。レインコートまたは防水アウターがおすすめ。' },
  { tempMin: -99, tempMax: 99, humidityMax: 100, condition: '大雨', suggestion: '傘必携。レインコートと防水ブーツを強くおすすめします。' },
  { tempMin: -99, tempMax: 99, humidityMax: 100, condition: '小雨', suggestion: '折りたたみ傘を持参しましょう。' },
  { tempMin: -99, tempMax: 99, humidityMax: 100, condition: 'にわか雨', suggestion: '折りたたみ傘があると安心です。' },
  { tempMin: -99, tempMax: 99, humidityMax: 100, condition: '雷雨', suggestion: '傘必携。できれば外出を控えましょう。' },

  // 気温別（晴れ・曇り）
  { tempMin: 30, tempMax: 99, humidityMax: 100, condition: null, suggestion: '半袖・ショートパンツ。熱中症対策に帽子と水分補給を忘れずに。' },
  { tempMin: 25, tempMax: 29, humidityMax: 80,  condition: null, suggestion: '半袖で十分です。日差しが強い場合は帽子も。' },
  { tempMin: 25, tempMax: 29, humidityMax: 100, condition: null, suggestion: '半袖＋薄手の羽織もの。蒸し暑いので通気性のよい素材を選びましょう。' },
  { tempMin: 20, tempMax: 24, humidityMax: 100, condition: null, suggestion: '長袖シャツまたは薄手のカーディガンがちょうどよいです。' },
  { tempMin: 15, tempMax: 19, humidityMax: 100, condition: null, suggestion: '薄手のジャケットまたはパーカーを羽織りましょう。' },
  { tempMin: 10, tempMax: 14, humidityMax: 100, condition: null, suggestion: 'コートまたは厚手のジャケットが必要です。重ね着がおすすめ。' },
  { tempMin: 5,  tempMax: 9,  humidityMax: 100, condition: null, suggestion: '厚手のコート、マフラー、手袋を準備しましょう。' },
  { tempMin: -99, tempMax: 4, humidityMax: 100, condition: null, suggestion: '防寒対策を万全に。ダウンコート、帽子、マフラー、手袋が必要です。' },
]
