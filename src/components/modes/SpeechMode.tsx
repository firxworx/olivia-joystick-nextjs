import clsx from 'clsx'
import React, { useState, useEffect } from 'react'

import { useSpeech } from '../../hooks/useSpeech'
import { useControllerStore } from '../../stores/useControllerStore'
import { VectorIcon } from '../VectorIcon'

const phrases: Array<{
  icon: VectorIcon | null
  phrase: string
}> = [
  { icon: 'yes', phrase: 'YES' },
  { icon: 'no', phrase: 'NO' },
  { icon: 'pizza', phrase: 'Feed Me' },
  { icon: 'smile', phrase: 'OLIVIA' },
]

export const SpeechMode: React.FC<{}> = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0)

  const handleNext = () => {
    setCurrentPhrase((currentPhrase + 1) % phrases.length)
  }

  const handleBack = () => {
    setCurrentPhrase((currentPhrase - 1 + phrases.length) % phrases.length)
  }

  const speak = useSpeech()
  const joystick = useControllerStore((state) => state.controller)

  useEffect(() => {
    if (joystick.button) {
      speak(phrases[currentPhrase].phrase)
    }

    if (joystick.up) {
      handleBack()
    }

    if (joystick.down) {
      handleNext()
    }
  }, [joystick])

  return (
    <div className="bg-gray-50 min-h-screen min-w-full flex justify-center items-center">
      <div className="flex flex-col w-6/12 space-y-4">
        {phrases.map((phrase, index) => (
          <div
            key={phrase.phrase}
            className={clsx(
              'flex justify-center items-center border-2 border-gray-300 text-4xl p-8 rounded-md bg-gray-200 leading-none',
              {
                ['font-bold bg-yellow-50 border-gray-500 shadow-inner']: currentPhrase === index,
              }
            )}
          >
            {phrase.icon && (
              <VectorIcon
                className={clsx('w-12 h-12 mr-4', {
                  ['animate-ping']: currentPhrase === index,
                })}
                type={phrase.icon}
              />
            )}
            <span>{phrase.phrase}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
