import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { GridLayout } from '../components/GridLayout'
import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'

const screens = [
  <div><h1>OLIVIA</h1><h2>IZZY</h2></div>,
  '2',
  '3',
  '4',
  '5',
  '6',
]

export default function Home() {
  // const [ userInteracted, setUserInteracted ] = useState(false)

  const [ currentScreen, setCurrentScreen ] = useState(0)
  const [ joystick, setJoystick ] = useState<Joystick>(initialJoystickState)

  const handleNext = () => {
    setCurrentScreen((currentScreen + 1) % screens.length)
  }

  const handleBack = () => {
    setCurrentScreen((currentScreen - 1 + screens.length) % screens.length)
  }

  const handleJoystickChange = useCallback((js: Joystick) => {
    setJoystick({ ...js })
  }, [])

  useJoystick(handleJoystickChange)

  useEffect(() => {
    if (joystick.up) {
      handleNext()
    }

    if (joystick.down) {
      handleBack()
    }
  }, [ joystick.button, joystick.up, joystick.down, joystick.left, joystick.right ])

  return (
    <>
      <Head>
        <title>Olivia Joystick</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GridLayout>
        <div className={styles.screen}>
          <h1>{screens[currentScreen]}</h1>
        </div>
      </GridLayout>
    </>
  )
}
