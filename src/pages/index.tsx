import React, { useState, useEffect } from 'react'
import { useTransition, animated } from 'react-spring'

import { useControllerStore } from '../stores/useControllerStore'
import { useSpeech } from '../hooks/useSpeech'

import { GridLayout } from '../components/GridLayout'
import { TelevisionMode } from '../components/modes/TelevisionMode'
import { SpeechMode } from '../components/modes/SpeechMode'
// import { ThreeFunMode } from '../components/modes/ThreeFunMode'
// import { ThreeMode2 } from '../components/modes/ThreeMode2'

const modes = [
  { name: 'Television Mode', component: TelevisionMode },
  { name: 'Speech Mode', component: SpeechMode },
  // { name: 'Three Fun Mode', component: ThreeFunMode },
  // { name: 'Three Mode Two', component: ThreeMode2 },
]

const Mode: React.FC<{ index: number }> = ({ index }) => {
  return modes[index].component({})
}

export default function IndexPage() {
  const [currentMode, setCurrentMode] = useState(0)

  const speak = useSpeech()
  const controller = useControllerStore((state) => state.controller)

  const handleNextMode = () => {
    const nextModeIndex = (currentMode + 1) % modes.length

    speak(`SWITCH, ${modes[nextModeIndex].name}`)
    setCurrentMode(nextModeIndex)
  }

  useEffect(() => {
    if (controller.altButton) {
      handleNextMode()
    }
  }, [controller.altButton])

  const transitions = useTransition(currentMode, {
    config: { duration: 500 }, // config.molasses
    from: {
      opacity: 0,
      transform: 'translate3d(-100%, 0px, 0px)',
    },
    enter: { opacity: 1, transform: 'translate3d(0%, 0px, 0px)' },
    leave: { opacity: 0, position: 'absolute', transform: 'translate3d(100%, 0px, 0px)' },
    // delay...
    // onRest: () => ...
  })

  return (
    <GridLayout>
      {transitions((styles, modeIndex) => (
        <animated.div className="w-full h-full" style={{ ...styles }}>
          <Mode index={modeIndex} />
        </animated.div>
      ))}
    </GridLayout>
  )
}
