import { WEATHER_CACHE_TTL_MS } from '../constants'
import { WeatherService } from '../services/WeatherService'
import type { Location, WeatherData } from '../types'

const CACHE_KEY = 'weather_cache'

export class WeatherRepository {
  private service = new WeatherService()

  async fetchWeather(loc: Location): Promise<WeatherData> {
    const cached = this.getCached()
    if (cached) return cached

    try {
      const data = await this.service.get(loc.latitude, loc.longitude)
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data))
      return data
    } catch {
      // オフライン時はstaleキャッシュを返す
      const stale = this.getStaleCache()
      if (stale) return { ...stale, cached: true }
      throw new Error('天気データを取得できません。ネットワーク接続を確認してください。')
    }
  }

  getCached(): WeatherData | null {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    try {
      const data = JSON.parse(raw) as WeatherData
      const elapsed = Date.now() - new Date(data.observedAt).getTime()
      if (elapsed < WEATHER_CACHE_TTL_MS) return data
    } catch {
      // パース失敗時は無視
    }
    return null
  }

  private getStaleCache(): WeatherData | null {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as WeatherData
    } catch {
      return null
    }
  }

  clearCache(): void {
    sessionStorage.removeItem(CACHE_KEY)
  }

  static getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('このブラウザは位置情報をサポートしていません。'))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            fetchedAt: new Date(),
          }),
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            reject(new Error('位置情報の許可が必要です。ブラウザの設定から許可してください。'))
          } else {
            reject(new Error('位置情報を取得できませんでした。'))
          }
        }
      )
    })
  }
}
