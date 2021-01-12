import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useInterval } from './useInterval'
// import equal from 'fast-deep-equal/es6'

/*
interface GamepadRef {
  [key: number]: Gamepad;
}
*/

interface Gamepads {
  [key: number]: Pick<Gamepad, 'id' | 'buttons' | 'axes'>;
}

let haveEvents: boolean = false
if (typeof window !== 'undefined') {
  haveEvents = 'ongamepadconnected' in window
}

interface Joystick {
  UP: boolean;
  DOWN: boolean;
  LEFT: boolean;
  RIGHT: boolean;
  BUTTON: boolean;
}

export const useJoystick = () => {
  // const gamepadRef = useRef<GamepadRef>(undefined)
  const [ joystick, setJoystick ] = useState<Joystick>({
    UP: false, DOWN: false, LEFT: false, RIGHT: false, BUTTON: false,
  })
  const requestRef = useRef<number>(undefined)

  const addGamepad = useCallback((gamepad: Gamepad) => {
    /*
    // ref approach?
    gamepadRef.current = {
      ...gamepadRef.current,
      [gamepad.index]: gamepad,
    }
    */

    const { index, id, buttons: [ btn0 ], axes: [axis0, axis1 ] } = gamepad

    const UP = (axis1 < -0.5)
    const DOWN = (axis1 > 0.5)
    const LEFT = (axis0 < -0.5)
    const RIGHT = (axis0 > 0.5)
    const BUTTON = (btn0 && btn0.pressed)

    if (joystick.UP === UP && joystick.DOWN === DOWN && joystick.LEFT === LEFT && joystick.RIGHT === RIGHT && joystick.BUTTON === BUTTON) {
      return
    }

    setJoystick({
      UP,
      DOWN,
      LEFT,
      RIGHT,
      BUTTON
    })
  }, [])

  const scanGamepads = useCallback(() => {
    // gamepads from api (may also want to check for webkitGetGamepads if getGamepads DNE)
    const joystick = navigator.getGamepads()

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

  /*
  // console.log(gamepadRef && gamepadRef.current)

  const BUTTON = (gamepads && gamepads[0] && gamepads[0].buttons[0] && gamepads[0].buttons[0].pressed)

  const UP = (gamepads && gamepads[0] && gamepads[0].axes[1] < -0.5)
  const DOWN = (gamepads && gamepads[0] && gamepads[0].axes[1] > 0.5)
  const LEFT = (gamepads && gamepads[0] && gamepads[0].axes[0] < -0.5)
  const RIGHT = (gamepads && gamepads[0] && gamepads[0].axes[0] > 0.5)

  const buh = useMemo(() => [ UP, DOWN, LEFT, RIGHT, BUTTON ], [ UP, DOWN, LEFT, RIGHT, BUTTON ])

  return buh
  */

  return joystick
}
