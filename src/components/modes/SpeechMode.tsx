import React, { useState, useEffect } from 'react'

import { Joystick } from '../../hooks/useJoystick'
import { useSpeech } from '../../hooks/useSpeech'

import styles from '../styles/SpeechMode.module.css'

const phrases = [
  'Change My Diaper',
  'I am Hungry',
  'I am Olivia',
  'I Love Mommy',
  'Feed Me Treats',
  'Give Me More',
  'I want to watch TV',
]

export const SpeechMode: React.FC<{ joystick: Joystick }> = ({ joystick }) => {
  const [ currentPhrase, setCurrentPhrase ] = useState(0)

  const speak = useSpeech()

  const handleNext = () => {
    setCurrentPhrase((currentPhrase + 1) % phrases.length)
  }

  const handleBack = () => {
    setCurrentPhrase((currentPhrase - 1 + phrases.length) % phrases.length)
  }

  useEffect(() => {
    if (joystick.button) {
      speak(phrases[currentPhrase])
    }

    if (joystick.up) {
      handleBack()
    }

    if (joystick.down) {
      handleNext()
    }
  }, [ joystick.button, joystick.up, joystick.down ])

  console.log(`current phrase ${currentPhrase} [${phrases.join(', ')}]`)

  return (
    <div className={styles.container}>
      <div className={styles.boxes}>
        {phrases.map((phrase, index) => (
          <div key="phrase">
            {currentPhrase === index
              ? (
                <div className={`${styles.box} ${styles.selected}`}><strong>{phrase}</strong></div>
              )
              : (
                <div className={`${styles.box} ${styles.unselected}`}>{phrase}</div>
              )
            }
          </div>
        ))}
      </div>
    </div>
  )
}
