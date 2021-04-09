import React, { useState, useCallback, useEffect, useMemo } from 'react'

import { GridLayout } from '../components/GridLayout'
import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'
import { TelevisionMode } from '../components/modes/TelevisionMode'
import { SpeechMode } from '../components/modes/SpeechMode'
import { initialKeyboardNavigationState, KeyboardNavigation, useKeyboard } from '../hooks/useKeyboard'
import { useSpeech } from '../hooks/useSpeech'

const modes = [
  { name: 'Television Mode', component: TelevisionMode },
  { name: 'Speech Mode', component: SpeechMode },
]

export default function Home() {
  const [currentMode, setCurrentMode] = useState(0)

  const [joystick, setJoystick] = useState<Joystick>(initialJoystickState)
  const [keyboard, setKeyboard] = useState<KeyboardNavigation>(initialKeyboardNavigationState)

  const speak = useSpeech()

  const handleJoystickChange = useCallback((joystickState: Joystick) => {
    setJoystick({ ...joystickState })
  }, [])

  const handleKeyboardChange = useCallback((keyboardState: KeyboardNavigation) => {
    setKeyboard({ ...keyboardState })
  }, [])

  useJoystick(handleJoystickChange)
  useKeyboard(handleKeyboardChange)

  const combinedControl: Joystick = useMemo(() => {
    return {
      up: joystick.up || keyboard.up,
      down: joystick.down || keyboard.down,
      left: joystick.left || keyboard.left,
      right: joystick.right || keyboard.right,
      button: joystick.button || keyboard.space,
      altButton: joystick.altButton || keyboard.shift,
    }
  }, [joystick, keyboard])

  const handleNextMode = () => {
    const newModeIndex = (currentMode + 1) % modes.length

    speak(`SWITCH, ${modes[newModeIndex].name}`)
    setCurrentMode(newModeIndex)
  }

  useEffect(() => {
    if (combinedControl.altButton) {
      handleNextMode()
    }
  }, [combinedControl.altButton])

  const CurrentMode = modes[currentMode].component

  return (
    <GridLayout>
      <CurrentMode joystick={combinedControl} speak={speak} />
    </GridLayout>
  )
}
