import React, { useState, useEffect, useCallback } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'
import styles from './styles/JoystickHookTester.module.css'

export const JoystickHookTester: React.FC<{}> = () => {
  const [ joystick, setJoystick ] = useState<Joystick>(initialJoystickState)

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
