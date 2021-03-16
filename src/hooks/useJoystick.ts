import { useRef, useCallback, useEffect } from 'react'
import { useInterval } from './useInterval'

let haveEvents: boolean = false
if (typeof window !== 'undefined') {
  haveEvents = 'ongamepadconnected' in window
}

export interface Joystick {
  button: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export const initialJoystickState: Joystick = {
  button: false,
  up: false,
  down: false,
  left: false,
  right: false,
}

export const useJoystick = (onJoystickChange: (status: Joystick) => void) => {
  const joystickRef = useRef<Joystick>(initialJoystickState)

  const requestRef = useRef<number | null>(null)

  const addGamepad = useCallback((gamepad: Gamepad) => {
    // concept for multiple controllers --
    // gamepadRef.current = {
    //  ...gamepadRef.current,
    //  [gamepad.index]: gamepad,
    // }

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

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  // check for new gamepads on a regular interval
  useInterval(() => {
    if (!haveEvents) {
      scanGamepads()
    }
  }, 1000)

  const handleConnected = useCallback((event: GamepadEvent) => {
    console.log('A gamepad connected:', event)
    addGamepad(event.gamepad)
  }, [])

  const handleDisconnected = useCallback((event: GamepadEvent) => {
    console.log('A gamepad disconnected:', event)
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
