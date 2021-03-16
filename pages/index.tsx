import React, { useState, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
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
    <>
      <Head>
        <title>Olivia Joystick</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GridLayout>
        {/*
        <h2>{`${screens[currentScreen]} ... ${screenProgress[currentScreen]}`}</h2>
        */}
        <div className={styles.screen}>
          <TelevisionMode joystick={combinedControl} />
          {/*<SpeechMode joystick={joystick} /> */}
        </div>
      </GridLayout>
    </>
  )
}
