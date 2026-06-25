import { TIME_SLOTS } from '../constants'
import type { OutfitRecommendation, OutfitRule, WeatherData, HourlyForecast } from '../types'
import { OUTFIT_RULES } from './outfitRules'

export class RecommendationEngine {
  private rules: OutfitRule[]

  constructor(rules: OutfitRule[] = OUTFIT_RULES) {
    this.rules = rules
  }

  generate(weather: WeatherData): OutfitRecommendation {
    const morning = this.selectForecast(weather.hourlyForecasts, TIME_SLOTS.MORNING.hours)
    const afternoon = this.selectForecast(weather.hourlyForecasts, TIME_SLOTS.AFTERNOON.hours)
    const evening = this.selectForecast(weather.hourlyForecasts, TIME_SLOTS.EVENING.hours)

    return {
      morningOutfit: this.selectRule(
        morning?.temperature ?? weather.temperature,
        morning?.humidity ?? weather.humidity,
        morning?.condition ?? weather.condition
      ),
      afternoonOutfit: this.selectRule(
        afternoon?.temperature ?? weather.temperature,
        afternoon?.humidity ?? weather.humidity,
        afternoon?.condition ?? weather.condition
      ),
      eveningOutfit: this.selectRule(
        evening?.temperature ?? weather.temperature,
        evening?.humidity ?? weather.humidity,
        evening?.condition ?? weather.condition
      ),
      generatedAt: new Date(),
    }
  }

  selectRule(temp: number, humidity: number, condition: string): string {
    // 条件付きルール（天気一致）を先に評価
    const conditionMatch = this.rules.find(
      (r) =>
        r.condition !== null &&
        condition.includes(r.condition) &&
        temp >= r.tempMin &&
        temp <= r.tempMax &&
        humidity <= r.humidityMax
    )
    if (conditionMatch) return conditionMatch.suggestion

    // 気温・湿度のみのルール
    const tempMatch = this.rules.find(
      (r) =>
        r.condition === null &&
        temp >= r.tempMin &&
        temp <= r.tempMax &&
        humidity <= r.humidityMax
    )
    return tempMatch?.suggestion ?? '天候に合わせた服装をお選びください。'
  }

  private selectForecast(
    forecasts: HourlyForecast[],
    targetHours: readonly number[]
  ): HourlyForecast | null {
    for (const hour of targetHours) {
      const found = forecasts.find((f) => new Date(f.time).getHours() === hour)
      if (found) return found
    }
    return null
  }
}
