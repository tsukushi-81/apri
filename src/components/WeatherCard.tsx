import type { WeatherData } from '../types'

interface Props {
  weather: WeatherData
}

export default function WeatherCard({ weather }: Props) {
  const observed = new Date(weather.observedAt).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section className="weather-card">
      <h2>現在の天気</h2>
      <div className="weather-info">
        <span className="weather-condition">{weather.condition}</span>
        <span className="weather-temp">{weather.temperature.toFixed(1)}°C</span>
        <span className="weather-humidity">湿度 {weather.humidity}%</span>
      </div>
      <p className="weather-time">取得時刻: {observed}</p>
    </section>
  )
}
