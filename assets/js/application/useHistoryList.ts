import { useCallback, useState } from '@wordpress/element'

export interface History {
  hasNext: boolean
  hasPrev: boolean
  historyIndex: number
  prevHistoryItem: () => void
  nextHistoryItem: () => void
  totalHistoryItems: number
}

export const useHistoryList = <T>(initialItems?: T) => {
  const [items, setItems] = useState<T[]>(initialItems ? [initialItems] : [])
  const [historyIndex, setHistoryIndex] = useState(0)

  const totalHistoryItems = items.length
  const hasNext = historyIndex < totalHistoryItems - 1
  const hasPrev = historyIndex > 0

  const nextHistoryItem = useCallback(() => {
    if (!hasNext) return
    setHistoryIndex((n) => n + 1)
  }, [hasNext, setHistoryIndex])

  const prevHistoryItem = useCallback(() => {
    if (!hasPrev) return
    setHistoryIndex((n) => n - 1)
  }, [hasPrev, setHistoryIndex])

  const updateHistoryItem = useCallback(
    (nextItems: T) => {
      setItems((current) => {
        return current.splice(historyIndex, 1, nextItems)
      })
    },
    [historyIndex, setItems],
  )

  const addHistoryItem = useCallback(
    (nextItems: T) => {
      setItems((current) => [...current, nextItems])
      setHistoryIndex((n) => n + 1)
    },
    [setItems],
  )

  return {
    addHistoryItem,
    data: items[historyIndex],
    history: {
      hasNext,
      hasPrev,
      historyIndex,
      nextHistoryItem,
      prevHistoryItem,
      totalHistoryItems,
    },
    update: updateHistoryItem,
  }
}
