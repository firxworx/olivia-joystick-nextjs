import React, { useEffect, useCallback, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const JoystickBuddy: React.FC<{}> = () => {
  const handleConnected = useCallback((event: GamepadEvent) => {
    console.log('A gamepad connected:')
    console.log(event)    // .gamepad
  }, [])

  const handleDisconnected = useCallback((event: GamepadEvent) => {
    console.log('A gamepad disconnected:')
    console.log(event)    // .gamepad
  }, [])

  useEffect(() => {
    window.addEventListener('gamepadconnected', handleConnected)
    window.addEventListener('gamepaddisconnected', handleDisconnected)

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected)
      window.removeEventListener('gamepadconnected', handleDisconnected)
    }
  }, [])

  return (
    <div>
      GAMEPAD!
    </div>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <div>
          <JoystickBuddy />
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
