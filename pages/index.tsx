import React, { useEffect, useCallback, useState, useRef } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useInterval } from '../hooks/useInterval'

const JoystickBuddy: React.FC<{}> = () => {
  const [ gamepads, setGamepads ] = useState({})

  const requestRef = useRef<number>(undefined)

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

  return (
    <div>
      <h1 className={styles.title}>GAMEPAD!</h1>
      {Object.keys(gamepads).map((id) => (
        <div key={id}>
          <h2>{gamepads[id].id}</h2>
          {gamepads[id].axes && gamepads[id].axes.map((axis, index: number) => (
            <div key={index}>
              <h3>{index}</h3>
              <pre>
                {JSON.stringify(axis, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      ))}
      <h1 className={styles.title}>DIRECTIONS</h1>
      <div className={styles.box}>
        <h1>{gamepads[0] && gamepads[0].axes[0] > 0.5 && 'UP'}</h1>
        <div>{gamepads[0] && gamepads[0].axes[0] < -0.5 && 'DOWN'}</div>
        <div>{gamepads[0] && gamepads[0].axes[1] > 0.5 && 'RIGHT'}</div>
        <div>{gamepads[0] && gamepads[0].axes[1] < -0.5 && 'LEFT'}</div>
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
          <JoystickBuddy />
        </div>
      </main>

      <footer className={styles.footer}>
        powered by firxworx
      </footer>
    </div>
  )
}
