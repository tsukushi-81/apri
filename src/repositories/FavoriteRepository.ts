import { FAVORITES_STORAGE_KEY } from '../constants'
import { LocalStorage } from '../infrastructure/LocalStorage'
import type { FavoriteOutfit } from '../types'

export class FavoriteRepository {
  private storage = new LocalStorage()

  findAll(): FavoriteOutfit[] {
    const raw = this.storage.get(FAVORITES_STORAGE_KEY)
    if (!raw) return []
    try {
      return JSON.parse(raw) as FavoriteOutfit[]
    } catch {
      return []
    }
  }

  save(item: FavoriteOutfit): void {
    const list = this.findAll()
    list.unshift(item)
    this.storage.set(FAVORITES_STORAGE_KEY, JSON.stringify(list))
  }

  delete(id: string): void {
    const list = this.findAll().filter((f) => f.id !== id)
    this.storage.set(FAVORITES_STORAGE_KEY, JSON.stringify(list))
  }

  findById(id: string): FavoriteOutfit | null {
    return this.findAll().find((f) => f.id === id) ?? null
  }
}
