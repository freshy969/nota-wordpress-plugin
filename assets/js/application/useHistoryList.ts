import { useSelect } from '@wordpress/data'
import { useCallback, useEffect, useState } from '@wordpress/element'
import { wordPressService } from 'assets/js/services/wordPressService/wordPressService'
import { logger } from 'assets/js/utils/logger/logger'

const useWpSelect = useSelect as WordPress.useSelect

export interface History {
  hasNext: boolean
  hasPrev: boolean
  historyIndex: number
  prevHistoryItem: () => void
  nextHistoryItem: () => void
  totalHistoryItems: number
}

interface Args<T> {
  initialItems?: T
  key: string
}
export const useHistoryList = <T>({ initialItems, key }: Args<T>) => {
  const [items, setItems] = useState<T[]>(initialItems ? [initialItems] : [])
  const [historyIndex, setHistoryIndex] = useState(initialItems ? 0 : -1)
  const { postId, savedHistory } = useWpSelect(
    (select) => {
      const coreEditor = select('core/editor')
      return {
        savedHistory: coreEditor.getCurrentPost()?.meta?.[key],
        postId: coreEditor.getCurrentPostId(),
      }
    },
    [key],
  )

  useEffect(() => {
    if (typeof savedHistory === undefined) return
    try {
      const parsedHistory = JSON.parse(savedHistory)
      setItems(parsedHistory)
      setHistoryIndex(parsedHistory.length - 1)
    } catch (e) {
      logger.error(e)
    }
  }, [savedHistory])

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
        const updated = [...current]
        updated.splice(historyIndex, 1, nextItems)
        wordPressService
          .editMeta({
            postId,
            key,
            value: JSON.stringify(updated),
          })
          .catch(logger.error)
        return updated
      })
    },
    [historyIndex, setItems, key, postId],
  )

  const addHistoryItem = useCallback(
    (nextItems: T) => {
      setItems((current) => {
        const next = [...current, nextItems]
        wordPressService
          .editMeta({
            postId,
            key,
            value: JSON.stringify(next),
          })
          .catch(logger.error)
        return next
      })
      setHistoryIndex((n) => n + 1)
    },
    [setItems, key, postId],
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
