import create, { State } from 'zustand'
import { initialJoystickState, Joystick } from '../hooks/useJoystick'

interface ControllerStoreState extends State {
  controller: Joystick
  updateControllerState: (update: Joystick) => void
}

const store = (set: any) => ({
  controller: initialJoystickState,
  updateControllerState: (update: Joystick) => {
    set({ controller: update })
  },
})

export const useControllerStore = create<ControllerStoreState>(store)
