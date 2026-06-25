import { OPEN_METEO_BASE_URL, getWeatherLabel } from '../constants'
import type { WeatherData, HourlyForecast } from '../types'

export class WeatherService {
  async get(lat: number, lng: number): Promise<WeatherData> {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lng),
      hourly: 'temperature_2m,relativehumidity_2m,weathercode',
      forecast_days: '1',
      timezone: 'Asia/Tokyo',
    })

    const res = await fetch(`${OPEN_METEO_BASE_URL}?${params}`)
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`)

    const json = await res.json()
    return this.parse(json)
  }

  private parse(json: Record<string, unknown>): WeatherData {
    const hourly = json['hourly'] as {
      time: string[]
      temperature_2m: number[]
      relativehumidity_2m: number[]
      weathercode: number[]
    }

    const now = new Date()
    const currentHour = now.getHours()

    const hourlyForecasts: HourlyForecast[] = hourly.time.map((t, i) => ({
      time: t,
      temperature: hourly.temperature_2m[i] ?? 0,
      humidity: hourly.relativehumidity_2m[i] ?? 0,
      condition: getWeatherLabel(hourly.weathercode[i] ?? 0),
    }))

    // 現在時刻に最も近いインデックスを現在の気象値として使う
    const currentIndex = Math.max(
      0,
      hourlyForecasts.findIndex((f) => {
        const h = new Date(f.time).getHours()
        return h >= currentHour
      })
    )

    const current = hourlyForecasts[currentIndex] ?? hourlyForecasts[0]

    return {
      temperature: current?.temperature ?? 0,
      humidity: current?.humidity ?? 0,
      condition: current?.condition ?? '不明',
      observedAt: now,
      hourlyForecasts,
      cached: false,
    }
  }
}
