import { useEffect, useMemo, useState } from '@wordpress/element'

interface Args<T> {
  trackValue: T
  revertFn: (lastValue: T) => void
}
export const useRevision = <T>({ trackValue, revertFn }: Args<T>) => {
  // holds any revisions made to the trackValue
  const [history, setHistory] = useState<T[]>([])
  // holds any revisions made by nota
  const [notaHistory, setNotaHistory] = useState<T[]>([])

  // finds the last non-nota update so that users can revert
  const lastNonNotaValue = useMemo(() => {
    return history.find((historyItem) => !notaHistory.includes(historyItem))
  }, [history, notaHistory])
  // we should only revert to something if the last non-nota value exists
  // and if the last non-nota value is not the same as the current value
  const hasRevision =
    typeof lastNonNotaValue !== 'undefined' && trackValue !== lastNonNotaValue

  // whenever the track value changes we add this to the history
  // this allows us to keep track of any outside edits to the value in question
  // e.g. updates to the post title directory
  useEffect(() => {
    setHistory((current) => [trackValue, ...current])
  }, [trackValue])

  const revert = () => {
    if (typeof lastNonNotaValue !== 'undefined') {
      revertFn(lastNonNotaValue)
    }
  }

  // keeps track of the edits made by nota
  const update = (value: T) => {
    setNotaHistory((current) => [value, ...current])
  }

  return {
    update,
    revert: hasRevision ? revert : undefined,
  }
}
