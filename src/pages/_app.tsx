import React, { useState, useCallback, useEffect } from 'react'
import { AppProps } from 'next/app' // AppContext
import Head from 'next/head'

import '../styles/tailwind.css'

import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'
import { useKeyboard, KeyboardNavigation, initialKeyboardNavigationState } from '../hooks/useKeyboard'
import { useControllerStore } from '../stores/useControllerStore'
import { SpeechContextProvider } from 'src/components/context/Speech'

function MyApp({ Component, pageProps }: AppProps) {
  const [joystick, setJoystick] = useState<Joystick>(initialJoystickState)
  const [keyboard, setKeyboard] = useState<KeyboardNavigation>(initialKeyboardNavigationState)

  const handleJoystickChange = useCallback((joystickState: Joystick) => {
    setJoystick({ ...joystickState })
  }, [])

  const handleKeyboardChange = useCallback((keyboardState: KeyboardNavigation) => {
    setKeyboard({ ...keyboardState })
  }, [])

  useJoystick(handleJoystickChange)
  useKeyboard(handleKeyboardChange)

  const updateControllerState = useControllerStore((state) => state.updateControllerState)

  useEffect(() => {
    updateControllerState({
      up: joystick.up || keyboard.up,
      down: joystick.down || keyboard.down,
      left: joystick.left || keyboard.left,
      right: joystick.right || keyboard.right,
      button: joystick.button || keyboard.space,
      altButton: joystick.altButton || keyboard.shift,
    })
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

  return (
    <>
      <Head>
        <title>Olivia Joystick</title>
        <link rel="icon" href="favicon.ico" />
      </Head>
      <SpeechContextProvider>
        <Component {...pageProps} />
      </SpeechContextProvider>
    </>
  )
}

export default MyApp
