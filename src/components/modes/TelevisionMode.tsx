import React, { useState, useEffect, useRef } from 'react'
import { useTransition, animated } from 'react-spring'
import YouTubePlayer from 'react-player/youtube'

import { episodes } from 'src/data/episodes'

import { useSpeech } from '../../hooks/useSpeech'
import { useControllerStore } from '../../stores/useControllerStore'

const screens = [...episodes[0]]

// react-player lessons:
// - seekTo() is best called from the onStart callback/handler vs. onReady

export const TelevisionMode: React.FC<{}> = () => {
  const playerRef = useRef<YouTubePlayer>(null)

  const [isPlayMode, setIsPlayMode] = useState(true)

  const [currentScreen, setCurrentScreen] = useState(0)
  const [screenProgress, setScreenProgress] = useState<Array<number>>(Array.from({ length: screens.length }, () => 0))

  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down' | undefined>(undefined)

  const speak = useSpeech()
  const joystick = useControllerStore((state) => state.controller)

  const handleNext = () => {
    setTransitionDirection('up')
    setCurrentScreen((currentScreen + 1) % screens.length)
  }

  const handleBack = () => {
    setTransitionDirection('down')
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

  const transitions = useTransition(currentScreen, {
    config: { duration: 500 },
    from: {
      opacity: 0,
      transform: `translate3d(0px, ${transitionDirection === 'up' ? '100%' : '-100%'}, 0px)`,
    },
    enter: { opacity: 1, transform: 'translate3d(0px, 0%, 0px)' },
    leave: {
      opacity: 0,
      position: 'absolute',
      transform: `translate3d(0px, ${transitionDirection === 'up' ? '-100%' : '100%'}, 0px)`,
    },
  })

  return (
    <>
      {transitions((styles, currentScreenIndex) => (
        <animated.div className="w-full h-full" style={{ ...styles }}>
          <YouTubePlayer
            ref={playerRef}
            url={screens[currentScreenIndex]}
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
        </animated.div>
      ))}
    </>
  )
}
