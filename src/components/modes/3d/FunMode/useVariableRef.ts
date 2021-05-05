import { useEffect, useRef } from 'react'

export const useVariableRef = <T>(state: T) => {
  const varRef = useRef(state)

  useEffect(() => {
    varRef.current = state
  }, [state])

  return varRef
}
