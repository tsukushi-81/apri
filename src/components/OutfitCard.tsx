interface Props {
  label: string
  suggestion: string
  onFavorite: () => void
}

export default function OutfitCard({ label, suggestion, onFavorite }: Props) {
  return (
    <div className="outfit-card">
      <h3 className="outfit-label">{label}</h3>
      <p className="outfit-suggestion">{suggestion}</p>
      <button className="favorite-btn" onClick={onFavorite} aria-label="お気に入りに追加">
        ♡ お気に入り
      </button>
    </div>
  )
}
