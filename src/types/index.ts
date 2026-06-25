export interface Location {
  latitude: number
  longitude: number
  fetchedAt: Date
}

export interface HourlyForecast {
  time: string
  temperature: number
  humidity: number
  condition: string
}

export interface WeatherData {
  temperature: number
  humidity: number
  condition: string
  observedAt: Date
  hourlyForecasts: HourlyForecast[]
  cached: boolean
}

export interface OutfitRecommendation {
  morningOutfit: string
  afternoonOutfit: string
  eveningOutfit: string
  generatedAt: Date
}

export interface OutfitRule {
  tempMin: number
  tempMax: number
  humidityMax: number
  condition: string | null // null = 条件なし
  suggestion: string
}

export interface FavoriteOutfit {
  id: string
  memo: string
  savedAt: Date
}
