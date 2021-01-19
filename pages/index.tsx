import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { GridLayout } from '../components/GridLayout'
import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'
import ReactPlayer from 'react-player/youtube'

const screens = [
  'https://www.youtube.com/watch?v=W0G3qZbwmq8',
  'https://www.youtube.com/watch?v=RHNlAA2uV0o',
  'https://www.youtube.com/watch?v=ud_gLdgJJAQ',
  'https://www.youtube.com/watch?v=0w4QiOwOgDU',
  'https://www.youtube.com/watch?v=62fXe5PE7Sk',
  'https://www.youtube.com/watch?v=OPeOmgede_U',
  /*
  'https://www.youtube.com/watch?v=T53yDxrnLMY',
  'https://www.youtube.com/watch?v=N9h2sg-PGRk',
  'https://www.youtube.com/watch?v=jCvSEuHms5M',
  'https://www.youtube.com/watch?v=fJxLNvhce2w',
  */
]

export default function Home() {
  // const [ userInteracted, setUserInteracted ] = useState(false)
  const [ isPlaying, setIsPlaying ] = useState(true)

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
    if (joystick.button) {
      setIsPlaying(!isPlaying)
    }

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
          <ReactPlayer
            url={screens[currentScreen]}
            playing={isPlaying}
            width="100%"
            height="100%"
          />
        </div>
      </GridLayout>
    </>
  )
}
