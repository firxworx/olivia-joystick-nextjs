import React, { useState, useEffect, useRef } from 'react'
import YouTubePlayer from 'react-player/youtube'
import { episodes } from 'src/data/episodes'

import { useSpeech } from '../../hooks/useSpeech'
import { useControllerStore } from '../../stores/useControllerStore'

const screens = [...episodes[0]]

// lessons:
// - the onStart callback/handler works the best for using seekTo()
// - seekTo() does not work reliably, even in the handlePlayerReady() callback, and even in
//   an effect triggered via a state changed by that callback

export const TelevisionMode: React.FC<{}> = () => {
  const playerRef = useRef<YouTubePlayer>(null)

  const [isPlayMode, setIsPlayMode] = useState(true)

  const [currentScreen, setCurrentScreen] = useState(0)
  const [screenProgress, setScreenProgress] = useState<Array<number>>(Array.from({ length: screens.length }, () => 0))

  const speak = useSpeech()
  const joystick = useControllerStore((state) => state.controller)

  const handleNext = () => {
    setCurrentScreen((currentScreen + 1) % screens.length)
  }

  const handleBack = () => {
    setCurrentScreen((currentScreen - 1 + screens.length) % screens.length)
  }

  const handlePlayerStarted = () => {
    const saved = screenProgress[currentScreen]
    if (saved > 0) {
      playerRef.current?.seekTo(saved)
    }
  }

  useEffect(() => {
    if (joystick.button) {
      if (isPlayMode) {
        speak('PAUSE')
      } else {
        speak('PLAY')
      }

      setIsPlayMode(!isPlayMode)
    }

    if (joystick.up || joystick.down) {
      const currTime = playerRef.current?.getCurrentTime()

      if (currTime) {
        setScreenProgress((sp) => {
          const nextState = [...sp]
          nextState[currentScreen] = currTime
          return nextState
        })
      }
    }

    if (joystick.up) {
      speak('UP')
      handleNext()
    }

    if (joystick.down) {
      speak('DOWN')
      handleBack()
    }
  }, [joystick.button, joystick.up, joystick.down, joystick.left, joystick.right])

  return (
    <>
      <YouTubePlayer
        ref={playerRef}
        url={screens[currentScreen]}
        playing={isPlayMode}
        width="100%"
        height="100%"
        progressInterval={1000}
        config={{
          playerVars: {
            controls: 0,
            disablekb: true,
            cc_lang_pref: 'en',
          },
        }}
        onStart={handlePlayerStarted}
      />
    </>
  )
}
