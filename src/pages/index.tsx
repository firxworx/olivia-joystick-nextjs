import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { GridLayout } from '../components/GridLayout'
import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'

import { TelevisionMode } from '../components/modes/TelevisionMode'
import { SpeechMode } from '../components/modes/SpeechMode'
import { initialKeyboardNavigationState, KeyboardNavigation, useKeyboard } from '../hooks/useKeyboard'
import { useSpeech } from '../hooks/useSpeech'

const modes = [
  { name: 'Television', component: TelevisionMode },
  { name: 'Speech Mode', component: SpeechMode },
]

export default function Home() {
  const [ currentMode, setCurrentMode ] = useState(0)

  const [ joystick, setJoystick ] = useState<Joystick>(initialJoystickState)
  const [ keyboard, setKeyboard ] = useState<KeyboardNavigation>(initialKeyboardNavigationState)

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
    }
  }, [
    joystick.up, joystick.down, joystick.left, joystick.right, joystick.button,
    keyboard.up, keyboard.down, keyboard.left, keyboard.right, keyboard.space,
  ])

  const handleNextMode = () => {
    const newModeIndex = (currentMode + 1) % modes.length

    speak(modes[newModeIndex].name)
    setCurrentMode(newModeIndex)
  }

  const handlePreviousMode = () => {
    const newModeIndex = (currentMode - 1 + modes.length) % modes.length

    speak(modes[newModeIndex].name)
    setCurrentMode(newModeIndex)
  }

  useEffect(() => {
    if (combinedControl.left) {
      handlePreviousMode()
    }

    if (combinedControl.right) {
      handleNextMode()
    }
  }, [ combinedControl.left, combinedControl.right ])


  console.log(`current mode ${currentMode}`)
  const CurrentMode = modes[currentMode].component

  return (
    <GridLayout>
      <div className="flex justify-center items-center">
        <CurrentMode joystick={combinedControl} speak={speak} />
        {/*<TelevisionMode joystick={combinedControl} />*/}
        {/*<SpeechMode joystick={joystick} /> */}
      </div>
    </GridLayout>
  )
}
