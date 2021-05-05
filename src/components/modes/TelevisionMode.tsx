import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/youtube'
import { episodes } from 'src/data/episodes'

import { useSpeech } from '../../hooks/useSpeech'
import { useControllerStore } from '../../stores/useControllerStore'

const screens = [...episodes[0]]

export const TelevisionMode: React.FC<{}> = () => {
  // const [ userInteracted, setUserInteracted ] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isReady, setIsReady] = useState(false)

  const [currentScreen, setCurrentScreen] = useState(0)
  const [screenProgress, setScreenProgress] = useState<Array<number>>(Array.from({ length: screens.length }, () => 0))

  const speak = useSpeech()

  const handleNext = () => {
    setCurrentScreen((currentScreen + 1) % screens.length)
    setIsReady(false)
  }

  const handleBack = () => {
    setCurrentScreen((currentScreen - 1 + screens.length) % screens.length)
    setIsReady(false)
  }

  const handlePlayerReady = (position: number) => {
    setIsReady(true)
  }

  const joystick = useControllerStore((state) => state.controller)

  useEffect(() => {
    if (joystick.button) {
      setIsPlaying(!isPlaying)
    }

    if (joystick.up) {
      const currTime = playerRef.current?.getCurrentTime()

      if (currTime) {
        const sp = [...screenProgress]
        sp[currentScreen] = currTime

        console.log(`screen ${currentScreen} saving time ${currTime}`)
        setScreenProgress(sp)
      }

      speak('UP')
      handleNext()
    }

    if (joystick.down) {
      const currTime = playerRef.current?.getCurrentTime()

      if (currTime) {
        const sp = [...screenProgress]
        sp[currentScreen] = currTime

        console.log(`screen ${currentScreen} saving time ${currTime}`)
        setScreenProgress(sp)
      }

      speak('DOWN')
      handleBack()
    }
  }, [joystick.button, joystick.up, joystick.down, joystick.left, joystick.right])

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
