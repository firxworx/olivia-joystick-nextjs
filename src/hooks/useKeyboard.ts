import { useCallback, useEffect, useRef } from 'react'

// reference for keyboard key values:
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values

export interface KeyboardNavigation {
  space: boolean
  shift: boolean
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}

export const initialKeyboardNavigationState: KeyboardNavigation = {
  space: false,
  shift: false,
  up: false,
  down: false,
  left: false,
  right: false,
}

const keyNameDict = {
  ' ': 'space',
  Spacebar: 'space',
  Shift: 'shift',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  W: 'up',
  S: 'down',
  A: 'left',
  D: 'right',
}

const haveWindow = typeof window === 'object'

export const useKeyboard = (onKeyboardChange: (status: KeyboardNavigation) => void) => {
  const keyboardRef = useRef<KeyboardNavigation>(initialKeyboardNavigationState)

  const keyupHandler = useCallback((event: KeyboardEvent) => {
    const { key } = event
    // console.log(key)

    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'W' ||
      key === 'S' ||
      key === 'A' ||
      key === 'D' ||
      key === ' ' ||
      key === 'Spacebar' ||
      key === 'Shift'
    ) {
      event.stopPropagation()

      keyboardRef.current = {
        ...keyboardRef.current,
        [keyNameDict[key]]: false,
      }

      onKeyboardChange(keyboardRef.current)
    }
  }, [])

  const keydownHandler = useCallback((event: KeyboardEvent) => {
    const { key } = event
    // console.log(key)

    if (
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'W' ||
      key === 'S' ||
      key === 'A' ||
      key === 'D' ||
      key === ' ' ||
      key === 'Spacebar' ||
      key === 'Shift'
    ) {
      event.stopPropagation()

      if (event.repeat) {
        return
      }

      keyboardRef.current = {
        ...keyboardRef.current,
        [keyNameDict[key]]: true,
      }

      onKeyboardChange(keyboardRef.current)
    }
  }, [])

  /*
  const keypressHandler = (event: KeyboardEvent) => {
    event.stopPropagation()
  }
  */

  useEffect(() => {
    if (!haveWindow) {
      return
    }

    window.addEventListener('keydown', keydownHandler)
    window.addEventListener('keyup', keyupHandler)
    // window.addEventListener('keypress', keypressHandler)

    return () => {
      window.removeEventListener('keydown', keydownHandler)
      window.removeEventListener('keyup', keyupHandler)
      // window.removeEventListener('keypress', keypressHandler)
    }
  }, [keydownHandler, keyupHandler])
}
