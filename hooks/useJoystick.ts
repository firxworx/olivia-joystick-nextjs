import { useRef, useCallback, useEffect } from 'react'
import { useInterval } from './useInterval'
// import equal from 'fast-deep-equal/es6'

/*
interface GamepadRef {
  [key: number]: Gamepad;
}

interface Gamepads {
  [key: number]: Pick<Gamepad, 'id' | 'buttons' | 'axes'>;
}
*/

export interface Joystick {
  button: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

let haveEvents: boolean = false
if (typeof window !== 'undefined') {
  haveEvents = 'ongamepadconnected' in window
}

export const useJoystick = (onJoystickChange: (status: Joystick) => void) => {
  // const gamepadRef = useRef<GamepadRef>(undefined)
  const joystickRef = useRef<Joystick>({
    button: false,
    up: false,
    down: false,
    left: false,
    right: false,
  })

  const requestRef = useRef<number>(undefined)

  const addGamepad = useCallback((gamepad: Gamepad) => {
    // ref approach w/ multiple controllers
    /*
    gamepadRef.current = {
      ...gamepadRef.current,
      [gamepad.index]: gamepad,
    }
    */

    const { index, id, buttons: [ btn0 ], axes: [axis0, axis1 ] } = gamepad

    const latest: Joystick = {
      button: (btn0 && btn0.pressed),
      up: (axis1 < -0.5),
      down: (axis1 > 0.5),
      left: (axis0 < -0.5),
      right: (axis0 > 0.5),
    }

    const { button, up, down, left, right } = joystickRef.current

    if (latest.button !== button || latest.up !== up || latest.down !== down || latest.left !== left || latest.right !== right) {
      joystickRef.current = {
        button: latest.button,
        up: latest.up,
        down: latest.down,
        left: latest.left,
        right: latest.right,
      }

      onJoystickChange(joystickRef.current)
    }
  }, [])

  const scanGamepads = useCallback(() => {
    const joystick = navigator.getGamepads()

    // assume single controller for current purposes
    if (joystick.length && joystick[0]) {
      addGamepad(joystick[0])
    }
  }, [])

  // update each gamepad's status on each 'tick'
  const animate = useCallback((time: DOMHighResTimeStamp) => {
    if (!haveEvents) {
      scanGamepads()
    }

    requestRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  // check for new gamepads regularly
  useInterval(() => {
    if (!haveEvents) {
      scanGamepads()
    }
  }, 1000)

  const handleConnected = useCallback((event: GamepadEvent) => {
    console.log('A gamepad connected:')
    console.log(event)
    addGamepad(event.gamepad)
  }, [])

  const handleDisconnected = useCallback((event: GamepadEvent) => {
    console.log('A gamepad disconnected:')
    console.log(event)
  }, [])

  useEffect(() => {
    window.addEventListener('gamepadconnected', handleConnected)
    window.addEventListener('gamepaddisconnected', handleDisconnected)

    return () => {
      window.removeEventListener('gamepadconnected', handleConnected)
      window.removeEventListener('gamepadconnected', handleDisconnected)
    }
  }, [])
}
