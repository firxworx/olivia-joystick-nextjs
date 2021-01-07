import React, { useEffect, useCallback, useState, useRef } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useInterval } from '../hooks/useInterval'
// import SpeechButton from '../components/SpeechButton'
import { useSpeech } from '../hooks/useSpeech'

const JoystickBuddy: React.FC<{}> = () => {
  const [ gamepads, setGamepads ] = useState({})

  const requestRef = useRef<number>(undefined)

  const speak = useSpeech()

  let haveEvents: boolean = false
  if (typeof window !== 'undefined') {
    haveEvents = 'ongamepadconnected' in window
  }

  const addGamepad = useCallback((gamepad) => {
    // consider using refs; refs these would be necessary anyway for a hook
    setGamepads({
      ...gamepads,
      [gamepad.index]: {
        buttons: gamepad.buttons,
        id: gamepad.id,
        axes: gamepad.axes,
      },
    })
  }, [])

  const scanGamepads = () => {
    // gamepads from api (may also want to check for webkitGetGamepads if getGamepads DNE)
    const detectedGamepads = navigator.getGamepads
      ? navigator.getGamepads()
      : []
    
    // loop through all detected controllers and add if not already in state
    for (let i = 0; i < detectedGamepads.length; i++) {
      if (detectedGamepads[i]) {
        addGamepad(detectedGamepads[i])
      }
    }
  }

  // update each gamepad's status on each 'tick'
  const animate = (time: DOMHighResTimeStamp) => {
    if (!haveEvents) {
      scanGamepads()
    }

    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  // check for new gamepads regularly
  useInterval(() => {
    if (!haveEvents) {
      scanGamepads()
    }
  }, 1000)

  const handleConnected = useCallback((event: GamepadEvent) => {
    console.log('A gamepad connected:')
    console.log(event)    // .gamepad
    addGamepad(event.gamepad)
  }, [])

  const handleDisconnected = useCallback((event: GamepadEvent) => {
    console.log('A gamepad disconnected:')
    console.log(event)    // .gamepad
  }, [])

  useEffect(() => {
    window.addEventListener('gamepadconnected', handleConnected)
    window.addEventListener('gamepaddisconnected', handleDisconnected)

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected)
      window.removeEventListener('gamepadconnected', handleDisconnected)
    }
  }, [])

  // button
  const BUTTON = (gamepads[0] && gamepads[0].buttons[0] && gamepads[0].buttons[0].pressed)

  /*
  // red handle
  const UP = gamepads[0] && gamepads[0].axes[0] > 0.5 && 'UP'
  const DOWN = gamepads[0] && gamepads[0].axes[0] < -0.5 && 'DOWN'
  const RIGHT = gamepads[0] && gamepads[0].axes[1] > 0.5 && 'RIGHT'
  const LEFT = gamepads[0] && gamepads[0].axes[1] < -0.5 && 'LEFT'
  */

  // blue handle
  const RIGHT = gamepads[0] && gamepads[0].axes[0] > 0.5 && 'RIGHT'
  const LEFT = gamepads[0] && gamepads[0].axes[0] < -0.5 && 'LEFT'
  const DOWN = gamepads[0] && gamepads[0].axes[1] > 0.5 && 'DOWN'
  const UP = gamepads[0] && gamepads[0].axes[1] < -0.5 && 'UP'

  useEffect(() => {
    if (RIGHT) {
      speak('RIGHT')
    }
    if (LEFT) {
      speak('LEFT')
    }
    if (UP) {
      speak('UP')
    }
    if (DOWN) {
      speak('DOWN')
    }
    if (BUTTON) {
      speak('BEEP')
    }
  }, [ BUTTON, RIGHT, LEFT, DOWN, UP ])

  return (
    <div>
      <h1 className={styles.title}>CONTROLLER</h1>
      <div className={styles.box}>
        {BUTTON && <h1>BEEP</h1>}
        <h1>{UP}</h1>
        <h1>{DOWN}</h1>
        <h1>{RIGHT}</h1>
        <h1>{LEFT}</h1>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          {/* <SpeechButton say="hello world">Hello World</SpeechButton> */}
        </div>
        <div>
          <JoystickBuddy />
        </div>
      </main>

      <footer className={styles.footer}>
        powered by firxworx
      </footer>
    </div>
  )
}
