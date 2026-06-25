import { useEffect, useState } from 'react'
import { WeatherRepository } from '../repositories/WeatherRepository'
import { RecommendationEngine } from '../engine/RecommendationEngine'
import WeatherCard from '../components/WeatherCard'
import OutfitCard from '../components/OutfitCard'
import AddFavoriteModal from '../components/AddFavoriteModal'
import type { WeatherData, OutfitRecommendation } from '../types'

type Status = 'idle' | 'loading' | 'success' | 'error'

const repo = new WeatherRepository()
const engine = new RecommendationEngine()

export default function HomePage() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSuggestion, setModalSuggestion] = useState('')

  const load = async () => {
    setStatus('loading')
    setError(null)
    try {
      const loc = await WeatherRepository.getCurrentLocation()
      const data = await repo.fetchWeather(loc)
      setWeather(data)
      setRecommendation(engine.generate(data))
      setStatus('success')
    } catch (e) {
      setError(e instanceof Error ? e.message : '不明なエラーが発生しました。')
      setStatus('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openModal = (suggestion: string) => {
    setModalSuggestion(suggestion)
    setModalOpen(true)
  }

  return (
    <div className="page">
      {status === 'loading' && (
        <div className="loading">
          <div className="spinner" />
          <p>天気情報を取得中...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="error-box" role="alert">
          <p>{error}</p>
          <button onClick={load}>再試行</button>
        </div>
      )}

      {status === 'success' && weather && recommendation && (
        <>
          {weather.cached && (
            <div className="info-box" role="status">
              オフライン中のため、キャッシュされた天気データを表示しています。
            </div>
          )}
          <WeatherCard weather={weather} />
          <section className="outfit-section">
            <h2>服装提案</h2>
            <div className="outfit-grid">
              <OutfitCard
                label="朝"
                suggestion={recommendation.morningOutfit}
                onFavorite={() => openModal(recommendation.morningOutfit)}
              />
              <OutfitCard
                label="昼"
                suggestion={recommendation.afternoonOutfit}
                onFavorite={() => openModal(recommendation.afternoonOutfit)}
              />
              <OutfitCard
                label="夜"
                suggestion={recommendation.eveningOutfit}
                onFavorite={() => openModal(recommendation.eveningOutfit)}
              />
            </div>
          </section>
          <button className="reload-btn" onClick={load}>
            更新
          </button>
        </>
      )}

      {modalOpen && (
        <AddFavoriteModal
          initialMemo={modalSuggestion}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
