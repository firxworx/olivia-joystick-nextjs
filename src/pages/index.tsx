import React, { useState, useCallback, useEffect, useMemo } from 'react'

import { GridLayout } from '../components/GridLayout'
import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'
import { TelevisionMode } from '../components/modes/TelevisionMode'
import { SpeechMode } from '../components/modes/SpeechMode'
import { initialKeyboardNavigationState, KeyboardNavigation, useKeyboard } from '../hooks/useKeyboard'
import { useSpeech } from '../hooks/useSpeech'
import { ThreeFunMode } from '../components/modes/ThreeFunMode'
import { ThreeMode2 } from '../components/modes/ThreeMode2'
import { useControllerStore } from '../stores/useControllerStore'

const modes = [
  { name: 'Television Mode', component: TelevisionMode },
  { name: 'Speech Mode', component: SpeechMode },
  { name: 'Three Fun Mode', component: ThreeFunMode },
  { name: 'Three Mode Two', component: ThreeMode2 },
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
  }, [
    joystick.up,
    joystick.down,
    joystick.left,
    joystick.right,
    joystick.button,
    joystick.altButton,
    keyboard.up,
    keyboard.down,
    keyboard.left,
    keyboard.right,
    keyboard.shift,
    keyboard.space,
  ])

  const updateControllerState = useControllerStore((state) => state.updateControllerState)
  updateControllerState(combinedControl)

  const handleNextMode = () => {
    const newModeIndex = (currentMode + 1) % modes.length

    speak(`SWITCH, ${modes[newModeIndex].name}`)
    setCurrentMode(newModeIndex)
  }

  useEffect(() => {
    if (joystick.altButton || keyboard.shift) {
      handleNextMode()
    }
  }, [joystick.altButton, keyboard.shift])

  const CurrentMode = modes[currentMode].component

  return (
    <GridLayout>
      <CurrentMode />
    </GridLayout>
  )
}
