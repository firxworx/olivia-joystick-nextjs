import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useSpeech } from '../hooks/useSpeech'
import { Joystick, useJoystick } from '../hooks/useJoystick'
// import { JoystickBuddy } from '../components/JoystickBuddy'

const JoystickHookTester: React.FC<{}> = () => {
  const [ joystick, setJoystick ] = useState<Joystick>({
    button: false,
    up: false,
    down: false,
    left: false,
    right: false,
  })

  const speak = useSpeech()

  const handleJoystickChange = useCallback((status: Joystick) => {
    // console.log(status)
    setJoystick({ ...status })
  }, [])

  useJoystick(handleJoystickChange)

  const { button, up, down, left, right } = joystick

  useEffect(() => {
    if (button) {
      speak('beep')
    }

    if (up) {
      speak('up')
    }

    if (down) {
      speak('down')
    }

    if (left) {
      speak('left')
    }

    if (right) {
      speak('right')
    }
  }, [ button, up, down, left, right ])

  console.log('component rendering')

  return (
    <div>
      <h1 className={styles.title}>CONTROLLER</h1>
      <div className={styles.box}>
        {button && <h1>BEEP</h1>}
        <h1>{up && 'UP'}</h1>
        <h1>{down && 'DOWN'}</h1>
        <h1>{right && 'RIGHT'}</h1>
        <h1>{left && 'LEFT'}</h1>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Joystick Playground</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <JoystickHookTester />
          {/* <JoystickBuddy /> */}
        </div>
      </main>

      <footer className={styles.footer}>
        w00t
      </footer>
    </div>
  )
}
