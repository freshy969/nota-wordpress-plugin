import { useEffect, useState } from '@wordpress/element'

interface Args<T> {
  trackValue: T
  revertFn: (lastValue: T) => void
}
export const useRevision = <T>({ trackValue, revertFn }: Args<T>) => {
  // holds any revisions made to the trackValue
  const [history, setHistory] = useState<T[]>([])
  // holds any revisions made by nota
  const [notaHistory, setNotaHistory] = useState<T[]>([])

  // whenever the track value changes we add this to the history
  // this allows us to keep track of any outside edits to the value in question
  // e.g. updates to the post title directory
  useEffect(() => {
    setHistory((current) => [trackValue, ...current])
  }, [trackValue])

  // finds the last non-nota update and reverts to that
  const revert = () => {
    const lastNonNotaValue = history.find(
      (historyItem) => !notaHistory.includes(historyItem),
    )
    if (lastNonNotaValue) {
      revertFn(lastNonNotaValue)
    }
  }

  // keeps track of the edits made by nota
  const update = (value: T) => {
    setNotaHistory((current) => [value, ...current])
  }

  return {
    update,
    revert,
  }
}
