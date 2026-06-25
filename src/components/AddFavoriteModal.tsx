import { useState } from 'react'
import { FavoriteRepository } from '../repositories/FavoriteRepository'
import type { FavoriteOutfit } from '../types'

interface Props {
  initialMemo: string
  onClose: () => void
}

const repo = new FavoriteRepository()

export default function AddFavoriteModal({ initialMemo, onClose }: Props) {
  const [memo, setMemo] = useState(initialMemo)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSave = () => {
    if (memo.trim() === '') {
      setValidationError('メモを入力してください。')
      return
    }

    const item: FavoriteOutfit = {
      id: crypto.randomUUID(),
      memo: memo.trim(),
      savedAt: new Date(),
    }
    repo.save(item)
    onClose()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="お気に入り追加">
      <div className="modal">
        <h2>お気に入りに追加</h2>
        <label htmlFor="memo-input" className="modal-label">
          服装メモ
        </label>
        <textarea
          id="memo-input"
          className="modal-textarea"
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value)
            if (validationError) setValidationError(null)
          }}
          rows={4}
          placeholder="例: 白シャツ＋チノパン＋薄手カーディガン"
        />
        {validationError && (
          <p className="validation-error" role="alert">
            {validationError}
          </p>
        )}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn-primary" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
