import { useCallback, useEffect, useRef } from 'react'

// reference for keyboard key values:
// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values

export interface KeyboardNavigation {
  space: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export const initialKeyboardNavigationState: KeyboardNavigation = {
  space: false,
  up: false,
  down: false,
  left: false,
  right: false,
}

const keyNameDict = {
  ' ': 'space',
  'Spacebar': 'space',
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
}

const haveWindow = typeof window === 'object'

export const useKeyboard = (onKeyboardChange: (status: KeyboardNavigation) => void) => {
  const keyboardRef = useRef<KeyboardNavigation>(initialKeyboardNavigationState)

  const upHandler = useCallback(({ key }: KeyboardEvent) => {
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || key === ' ' || key === 'Spacebar') {
      keyboardRef.current = {
        ...keyboardRef.current,
        [keyNameDict[key]]: false,
      }

      onKeyboardChange(keyboardRef.current)
    }
  }, [])

  const downHandler = useCallback(({ key }: KeyboardEvent) => {
    if  (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight' || key === ' ' || key === 'Spacebar') {
      keyboardRef.current = {
        ...keyboardRef.current,
        [keyNameDict[key]]: true,
      }

      onKeyboardChange(keyboardRef.current)
    }
  }, [])

  useEffect(() => {
    if (!haveWindow) {
      return
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [ downHandler, upHandler ])
}
