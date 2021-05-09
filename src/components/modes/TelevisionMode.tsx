import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTransition, animated } from 'react-spring'
import YouTubePlayer from 'react-player/youtube'

import { episodes } from 'src/data/episodes'

import { useSpeech } from '../../hooks/useSpeech'
import { useControllerStore } from '../../stores/useControllerStore'

const screens = [...episodes[0]]

/**
 * TelevisionMode cycles through an array of YouTube video URL's based on up/down inputs.
 * The action button controls play/pause behaviour.
 */
export const TelevisionMode: React.FC<{}> = () => {
  const playerRef = useRef<YouTubePlayer | null>(null)

  const [isPlayMode, setIsPlayMode] = useState(true)

  const [currentScreen, setCurrentScreen] = useState(0)
  const [screenProgress, setScreenProgress] = useState<Array<number>>(Array.from({ length: screens.length }, () => 0))

  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down' | undefined>(undefined)

  const speak = useSpeech()
  const joystick = useControllerStore((state) => state.controller)

  // seekTo() is more reliable when called from the player onStart vs. onReady callback
  const handlePlayerStarted = () => {
    if (screenProgress[currentScreen] > 0) {
      playerRef.current?.seekTo(screenProgress[currentScreen])
    }
  }

  // use a ref callback on the player to prevent playerRef.current from becoming null
  // this enables reliable playerRef.current.getCurrentTime() calls to save an
  // outgoing screen's current playback time even with transitions
  const handlePlayerRef = useCallback((node: YouTubePlayer | null) => {
    if (node) {
      playerRef.current = node
    }
  }, [])

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
      setTransitionDirection('up')
      setCurrentScreen((currentScreen + 1) % screens.length)
    }

    if (joystick.down) {
      speak('DOWN')
      setTransitionDirection('down')
      setCurrentScreen((currentScreen - 1 + screens.length) % screens.length)
    }
  }, [joystick.button, joystick.up, joystick.down, joystick.left, joystick.right])

  const transitions = useTransition(currentScreen, {
    config: { duration: 500 },
    from: {
      opacity: 0,
      transform: `translate3d(0px, ${transitionDirection === 'up' ? '100%' : '-100%'}, 0px)`,
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0px, 0%, 0px)',
      // onRest: handlePlayerStarted,
    },
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
            ref={handlePlayerRef}
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
