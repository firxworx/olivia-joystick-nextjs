import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player/youtube'

import { Joystick } from '../../hooks/useJoystick'

const screens = [
  'https://www.youtube.com/watch?v=VkQkg8jFbA4',
  'https://www.youtube.com/watch?v=HsPgLCcEXLI',
  'https://www.youtube.com/watch?v=hSwF40YgMxg', // masha peace and quiet
  'https://www.youtube.com/watch?v=fzZaXbGwv-o', // ghostbusters pilot
  'https://www.youtube.com/watch?v=MDF8sAnY92Q', // masha girl power
  'https://www.youtube.com/watch?v=eeVDXCWwmyE', // mr rogers
  'https://www.youtube.com/watch?v=oyClviB1xd8', // sesame search for elmos costume
  /*
  'https://www.youtube.com/watch?v=DBGR4fMrEzI', // Team Umizoomi full Episode Cap 13
  'https://www.youtube.com/watch?v=cZ2iSwsFqBc', // Wallykazam 11 full Episode
  'https://www.youtube.com/watch?v=z46HPYa7WD4', // Dora Halloween
  'https://www.youtube.com/watch?v=8fKNkiJl_Ro', // Looney Tunes Summer Vacation
  'https://www.youtube.com/watch?v=2nxE4HTVzQs', // Masha and the Bear - Winter with Masha (50)
  'https://www.youtube.com/watch?v=HfEVEGf1A8Q', // Spookiz - Movie
  'https://www.youtube.com/watch?v=T53yDxrnLMY', // Dora - Swiper the Explorer
  'https://www.youtube.com/watch?v=c7PLTjUkdW0', // Masha - Hooray its Childrens
  */
  /*
  'https://www.youtube.com/watch?v=bPjua3v4Psw', // dora - star mountain
  'https://www.youtube.com/watch?v=Edr6_-L3bi4', // scooby doo - Scaredy Cats Scooby & Shaggy
  'https://www.youtube.com/watch?v=HlhMayx8f7c', // curious george - curious george discovers the poles
  'https://www.youtube.com/watch?v=hRTcdBJsQXE', // masha - furry friends
  'https://www.youtube.com/watch?v=L50l3xJlyXQ', // dora - start catcher
  'https://www.youtube.com/watch?v=Ik_QP4oA_Hg', // curious george - maple monkey madness
  */
]

export const TelevisionMode: React.FC<{ joystick: Joystick; speak: (phrase: string) => void }> = ({
  joystick,
  speak,
}) => {
  // const [ userInteracted, setUserInteracted ] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)

  const [isPlaying, setIsPlaying] = useState(true)
  const [isReady, setIsReady] = useState(false)

  const [currentScreen, setCurrentScreen] = useState(0)
  const [screenProgress, setScreenProgress] = useState<Array<number>>(Array.from({ length: screens.length }, () => 0))

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
        const sp = [...screenProgress]
        sp[currentScreen] = currTime

        console.log(`screen ${currentScreen} saving time ${currTime}`)
        setScreenProgress(sp)
      }

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
