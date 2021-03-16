import React, { useState, useEffect, useCallback, useRef } from 'react'
import ReactPlayer from 'react-player/youtube'

import { useJoystick, Joystick, initialJoystickState } from '../../hooks/useJoystick'

const screens = [
  'https://www.youtube.com/watch?v=QZ_ecRti0F0', // dora - wonderland full movie
  'https://www.youtube.com/watch?v=bPjua3v4Psw', // dora - star mountain
  'https://www.youtube.com/watch?v=Edr6_-L3bi4', // scooby doo - Scaredy Cats Scooby & Shaggy
]

export const TelevisionMode: React.FC<{ joystick: Joystick }> = ({ joystick }) => {
  // const [ userInteracted, setUserInteracted ] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)

  const [ isPlaying, setIsPlaying ] = useState(true)
  const [ isReady, setIsReady ] = useState(false)

  const [ currentScreen, setCurrentScreen ] = useState(0)
  const [ screenProgress, setScreenProgress ] = useState<Array<number>>(Array.from({ length: screens.length }, () => 0))

  // const [ joystick, setJoystick ] = useState<Joystick>(initialJoystickState)

  const handleNext = () => {
    setCurrentScreen((currentScreen + 1) % screens.length)
    setIsReady(false)
  }

  const handleBack = () => {
    setCurrentScreen((currentScreen - 1 + screens.length) % screens.length)
    setIsReady(false)
  }

  /*
  const handleJoystickChange = useCallback((js: Joystick) => {
    setJoystick({ ...js })
  }, [])
  */

  const handlePlayerReady = (position: number) => {
    setIsReady(true)
  }

  // useJoystick(handleJoystickChange)

  useEffect(() => {
    if (joystick.button) {
      setIsPlaying(!isPlaying)
    }

    if (joystick.up) {
      const currTime = playerRef.current?.getCurrentTime()

      if (currTime) {
        const sp = [ ...screenProgress ]
        sp[currentScreen] = currTime

        console.log(`screen ${currentScreen} saving time ${currTime}`)
        setScreenProgress(sp)
      }

      handleNext()
    }

    if (joystick.down) {
      const currTime = playerRef.current?.getCurrentTime()

      if (currTime) {
        const sp = [ ...screenProgress ]
        sp[currentScreen] = currTime

        console.log(`screen ${currentScreen} saving time ${currTime}`)
        setScreenProgress(sp)
      }

      handleBack()
    }
  }, [ joystick.button, joystick.up, joystick.down, joystick.left, joystick.right ])

  /*
  useEffect(() => {
    if (isReady && playerRef.current) {
      console.log(`current screen ${currentScreen} (${isReady ? 'ready' : 'x'}) seeking to ${screenProgress[currentScreen]}`)
      playerRef.current?.seekTo(Math.round(screenProgress[currentScreen]), 'seconds')
    }
  }, [ currentScreen, isReady ])
  */

  // amazing how reliably the first dev shot works (joystick returns to center and the jump happens)
  useEffect(() => {
    playerRef.current?.seekTo(Math.round(screenProgress[currentScreen]), 'seconds')
  })

  console.log(`current screen ${currentScreen} (${isReady ? 'ready' : 'x'}) [${screenProgress.join(', ')}]`)

  return (
    <>
      {/*
      <h2>{`${screens[currentScreen]} ... ${screenProgress[currentScreen]}`}</h2>
      */}
      <ReactPlayer
        ref={playerRef}
        url={screens[currentScreen]}
        playing={isPlaying}
        width="100%"
        height="100%"
        progressInterval={1000}
        onReady={() => handlePlayerReady(screenProgress[currentScreen])}
      />
    </>
  )
}
