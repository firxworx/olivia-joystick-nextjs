import React from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
// import { useSpeech } from '../hooks/useSpeech'
import { useJoystick } from '../hooks/useJoystick'
import { JoystickBuddy } from '../components/JoystickBuddy'

const JoystickHookTester: React.FC<{}> = () => {
  // const speak = useSpeech()
  const { UP, DOWN, LEFT, RIGHT, BUTTON } = useJoystick()

  console.log('endless re-renders')

  return (
    <div>
      <h1 className={styles.title}>CONTROLLER</h1>
      <div className={styles.box}>
        {BUTTON && <h1>BEEP</h1>}
        <h1>{UP && 'UP'}</h1>
        <h1>{DOWN && 'DOWN'}</h1>
        <h1>{RIGHT && 'RIGHT'}</h1>
        <h1>{LEFT && 'LEFT'}</h1>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Joystick Playground</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
          <JoystickHookTester />
          {/* <JoystickBuddy /> */}
        </div>
      </main>

      <footer className={styles.footer}>
        w00t
      </footer>
    </div>
  )
}
