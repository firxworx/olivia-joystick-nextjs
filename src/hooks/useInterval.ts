import { useEffect, useRef } from 'react'

export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<unknown>()

  // save the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [ callback ])

  // set interval
  useEffect(() => {
    const tick = () => {
      if (savedCallback.current && typeof savedCallback.current === 'function') {
        savedCallback.current()
      }
    }

    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  },  [ delay ])
}
