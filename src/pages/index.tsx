import React, { useState, useCallback } from 'react'
import { GridLayout } from '../components/GridLayout'
import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'

import { TelevisionMode } from '../components/modes/TelevisionMode'
import { SpeechMode } from '../components/modes/SpeechMode'
import { initialKeyboardNavigationState, KeyboardNavigation, useKeyboard } from '../hooks/useKeyboard'

export default function Home() {
  const [ joystick, setJoystick ] = useState<Joystick>(initialJoystickState)
  const [ keyboard, setKeyboard ] = useState<KeyboardNavigation>(initialKeyboardNavigationState)

  const handleJoystickChange = useCallback((joystickState: Joystick) => {
    setJoystick({ ...joystickState })
  }, [])

  const handleKeyboardChange = useCallback((keyboardState: KeyboardNavigation) => {
    setKeyboard({ ...keyboardState })
  }, [])

  useJoystick(handleJoystickChange)
  useKeyboard(handleKeyboardChange)

  const combinedControl: Joystick = {
    up: joystick.up || keyboard.up,
    down: joystick.down || keyboard.down,
    left: joystick.left || keyboard.left,
    right: joystick.right || keyboard.right,
    button: joystick.button || keyboard.space,
  }

  return (
    <GridLayout>
      <div className="flex justify-center items-center">
        <TelevisionMode joystick={combinedControl} />
        {/*<SpeechMode joystick={joystick} /> */}
      </div>
    </GridLayout>
  )
}
