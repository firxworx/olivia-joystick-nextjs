import React, { useState, useEffect } from 'react'

import { GridLayout } from '../components/GridLayout'
import { TelevisionMode } from '../components/modes/TelevisionMode'
import { SpeechMode } from '../components/modes/SpeechMode'
import { useSpeech } from '../hooks/useSpeech'
import { ThreeFunMode } from '../components/modes/ThreeFunMode'
import { ThreeMode2 } from '../components/modes/ThreeMode2'
import { useControllerStore } from '../stores/useControllerStore'

const modes = [
  { name: 'Television Mode', component: TelevisionMode },
  { name: 'Speech Mode', component: SpeechMode },
  // { name: 'Three Fun Mode', component: ThreeFunMode },
  // { name: 'Three Mode Two', component: ThreeMode2 },
]

export default function IndexPage() {
  const [currentMode, setCurrentMode] = useState(0)

  const speak = useSpeech()
  const controller = useControllerStore((state) => state.controller)

  const handleNextMode = () => {
    const newModeIndex = (currentMode + 1) % modes.length

    speak(`SWITCH, ${modes[newModeIndex].name}`)
    setCurrentMode(newModeIndex)
  }

  useEffect(() => {
    if (controller.altButton) {
      handleNextMode()
    }
  }, [controller.altButton])

  const CurrentMode = modes[currentMode].component

  return (
    <GridLayout>
      <CurrentMode />
      {/*modes[currentMode].component({})*/}
    </GridLayout>
  )
}
