import React, { useState, useEffect, useCallback, useRef } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { GridLayout } from '../components/GridLayout'
import { useJoystick, Joystick, initialJoystickState } from '../hooks/useJoystick'
import ReactPlayer from 'react-player/youtube'

const screens = [
  'https://www.youtube.com/watch?v=T53yDxrnLMY', // dora - swiper the explorer
  'https://www.youtube.com/watch?v=jCvSEuHms5M&t=4s', // masha - summer holidays
  'https://www.youtube.com/watch?v=ONvNWclIes4', // dora - winter holiday adventures
  'https://www.youtube.com/watch?v=HlhMayx8f7c', // curious george - curious george discovers the poles
  'https://www.youtube.com/watch?v=hRTcdBJsQXE', // masha - furry friends
  'https://www.youtube.com/watch?v=L50l3xJlyXQ', // dora - start catcher
  'https://www.youtube.com/watch?v=Ik_QP4oA_Hg', // curious george - maple monkey madness


  /*
  'https://www.youtube.com/watch?v=9dvkOAetNeQ', // dora
  'https://www.youtube.com/watch?v=4AVHd8LD73o', // Blaze and the Monster Machines S02E14 Dinosaur Parade
  'https://www.youtube.com/watch?v=HSlUxiDt4Nc', // rocky bulwinkle
  'https://www.youtube.com/watch?v=XPVpylrxWMY', // masha
  // 'https://www.youtube.com/watch?v=V-N47iTh7m4', // octonauts
  // 'https://www.youtube.com/watch?v=3htKYkfF2b8', // relaxing kaleidoscope
  */

  // feature length thomas https://www.youtube.com/watch?v=Lj__ClMega0
  /*
  'https://www.youtube.com/watch?v=W0G3qZbwmq8',
  'https://www.youtube.com/watch?v=RHNlAA2uV0o',
  'https://www.youtube.com/watch?v=ud_gLdgJJAQ',
  'https://www.youtube.com/watch?v=0w4QiOwOgDU',
  'https://www.youtube.com/watch?v=62fXe5PE7Sk',
  'https://www.youtube.com/watch?v=OPeOmgede_U',
  */
  /*
  'https://www.youtube.com/watch?v=T53yDxrnLMY',
  'https://www.youtube.com/watch?v=N9h2sg-PGRk',
  'https://www.youtube.com/watch?v=jCvSEuHms5M',
  'https://www.youtube.com/watch?v=fJxLNvhce2w',
  */
]

export default function Home() {
  // const [ userInteracted, setUserInteracted ] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)

  const [ isPlaying, setIsPlaying ] = useState(true)
  const [ isReady, setIsReady ] = useState(false)

  const [ currentScreen, setCurrentScreen ] = useState(0)
  const [ screenProgress, setScreenProgress ] = useState<Array<number>>(Array.from({ length: screens.length }, () => 0))

  const [ joystick, setJoystick ] = useState<Joystick>(initialJoystickState)

  const handleNext = () => {
    setCurrentScreen((currentScreen + 1) % screens.length)
    setIsReady(false)
  }

  const handleBack = () => {
    setCurrentScreen((currentScreen - 1 + screens.length) % screens.length)
    setIsReady(false)
  }

  const handleJoystickChange = useCallback((js: Joystick) => {
    setJoystick({ ...js })
  }, [])

  const handlePlayerReady = (position: number) => {
    setIsReady(true)
  }

  useJoystick(handleJoystickChange)

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
      <Head>
        <title>Olivia Joystick</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GridLayout>
        {/*
        <h2>{`${screens[currentScreen]} ... ${screenProgress[currentScreen]}`}</h2>
        */}
        <div className={styles.screen}>
          <ReactPlayer
            ref={playerRef}
            url={screens[currentScreen]}
            playing={isPlaying}
            width="100%"
            height="100%"
            progressInterval={1000}
            onReady={() => handlePlayerReady(screenProgress[currentScreen])}
          />
        </div>
      </GridLayout>
    </>
  )
}
