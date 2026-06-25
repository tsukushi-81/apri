import { useEffect, useState } from 'react'
import { FavoriteRepository } from '../repositories/FavoriteRepository'
import FavoriteList from '../components/FavoriteList'
import AddFavoriteModal from '../components/AddFavoriteModal'
import type { FavoriteOutfit } from '../types'

const repo = new FavoriteRepository()

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<FavoriteOutfit[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const refresh = () => setFavorites(repo.findAll())

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = (id: string) => {
    if (!window.confirm('このお気に入りを削除しますか？')) return
    repo.delete(id)
    refresh()
  }

  const handleModalClose = () => {
    setModalOpen(false)
    refresh()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>お気に入り</h2>
        <button className="add-btn" onClick={() => setModalOpen(true)}>
          ＋ 追加
        </button>
      </div>

      {favorites.length === 0 ? (
        <p className="empty-state">まだ登録がありません。</p>
      ) : (
        <FavoriteList items={favorites} onDelete={handleDelete} />
      )}

      {modalOpen && (
        <AddFavoriteModal initialMemo="" onClose={handleModalClose} />
      )}
    </div>
  )
}
