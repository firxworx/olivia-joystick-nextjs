import React, { useState, useEffect, useRef, useCallback } from 'react'
import create, { State } from 'zustand'

import { useTransition, animated } from 'react-spring'
import YouTubePlayer from 'react-player/youtube'

import { episodes } from 'src/data/episodes'

import { useSpeech } from '../../hooks/useSpeech'
import { useControllerStore } from '../../stores/useControllerStore'

const screens = [...episodes[0]]

interface TelevisionModeState extends State {
  screen: number
  updateScreen: (update: number) => void

  progress: Array<number>
  updateProgress: (update: number) => void
}

const store = (set: any) => ({
  screen: 0,
  updateScreen: (screen: number) => {
    set({ screen })
  },

  progress: Array.from({ length: screens.length }, () => 0),
  updateProgress: (latest: number) => {
    set((state: TelevisionModeState) => {
      const nextProgressState = [...state.progress]
      nextProgressState[state.screen] = latest

      return {
        progress: nextProgressState,
      }
    })
  },
})

const useTelevisionModeStore = create<TelevisionModeState>(store)

/**
 * TelevisionMode cycles through an array of YouTube video URL's based on up/down inputs.
 * The action button controls play/pause behaviour.
 */
export const TelevisionMode: React.FC = () => {
  const playerRef = useRef<YouTubePlayer | null>(null)

  const [isPlayMode, setIsPlayMode] = useState(true)
  const [transitionDirection, setTransitionDirection] = useState<'UP' | 'DOWN' | undefined>(undefined)

  const [screen, progress, updateScreen, updateProgress] = useTelevisionModeStore((state) => [
    state.screen,
    state.progress[state.screen],
    state.updateScreen,
    state.updateProgress,
  ])

  const speak = useSpeech()
  const joystick = useControllerStore((state) => state.controller)

  // seekTo() is more reliable when called from player onStart() vs. onReady() callback
  const handlePlayerStarted = () => {
    if (progress > 0) {
      playerRef.current?.seekTo(progress)
    }
  }

  // JSX.LibraryManagedAttributes<typeof YouTubePlayer, YouTubePlayer['props']['onProgress']>
  const handleProgressUpdate = (playedSeconds: number) => {
    if (playedSeconds) {
      updateProgress(playedSeconds)
    }
  }

  // a ref callback on the YouTubePlayer prevents playerRef.current from becoming null.
  // this enables reliable playerRef.current.getCurrentTime() calls to save an
  // outgoing screen's current playback time even with transitions.
  const handlePlayerRef = useCallback((node: YouTubePlayer | null) => {
    if (node) {
      playerRef.current = node
    }
  }, [])

  // handle joystick actions
  useEffect(() => {
    if (joystick.button) {
      speak(isPlayMode ? 'PAUSE' : 'PLAY')
      setIsPlayMode(!isPlayMode)
    }

    if (joystick.up || joystick.down) {
      const currTime = playerRef.current?.getCurrentTime()

      if (currTime) {
        updateProgress(currTime)
      }
    }

    if (joystick.up) {
      speak('UP')
      setTransitionDirection('UP')
      updateScreen((screen + 1) % screens.length)
    }

    if (joystick.down) {
      speak('DOWN')
      setTransitionDirection('DOWN')
      updateScreen((screen - 1 + screens.length) % screens.length)
    }
  }, [joystick.button, joystick.up, joystick.down])

  // save screen progress on component unmount (when parent mode changes)
  // @see https://reactjs.org/blog/2020/08/10/react-v17-rc.html#effect-cleanup-timing
  // useEffect(() => {
  //   const player = playerRef.current

  //   return () => {
  //     if (player) {
  //       const currTime = player.getCurrentTime()
  //       console.log('unmount', currTime)

  //       if (currTime) {
  //         updateProgress(currTime)
  //       }
  //     }
  //   }
  // }, [playerRef.current])

  const transitions = useTransition(screen, {
    config: { duration: 500 },
    from: {
      opacity: 0,
      transform: `translate3d(0px, ${transitionDirection === 'UP' ? '100%' : '-100%'}, 0px)`,
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0px, 0%, 0px)',
      // onRest: handlePlayerStarted,
    },
    leave: {
      opacity: 0,
      position: 'absolute',
      transform: `translate3d(0px, ${transitionDirection === 'UP' ? '-100%' : '100%'}, 0px)`,
    },
  })

  return (
    <>
      {transitions((styles, screenIndex) => (
        <animated.div className="w-full h-full" style={{ ...styles }}>
          <YouTubePlayer
            ref={handlePlayerRef}
            url={screens[screenIndex]}
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
            onProgress={({ playedSeconds }) => handleProgressUpdate(playedSeconds)}
          />
        </animated.div>
      ))}
    </>
  )
}
