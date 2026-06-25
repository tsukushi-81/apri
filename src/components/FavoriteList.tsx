import type { FavoriteOutfit } from '../types'

interface Props {
  items: FavoriteOutfit[]
  onDelete: (id: string) => void
}

export default function FavoriteList({ items, onDelete }: Props) {
  return (
    <ul className="favorite-list">
      {items.map((item) => {
        const date = new Date(item.savedAt).toLocaleDateString('ja-JP')
        return (
          <li key={item.id} className="favorite-item">
            <div className="favorite-content">
              <p className="favorite-memo">{item.memo}</p>
              <span className="favorite-date">{date}</span>
            </div>
            <button
              className="delete-btn"
              onClick={() => onDelete(item.id)}
              aria-label="削除"
            >
              削除
            </button>
          </li>
        )
      })}
    </ul>
  )
}
