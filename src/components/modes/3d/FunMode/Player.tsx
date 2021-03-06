import React, { useEffect, useRef, useState } from 'react'
import { useSphere, BodyProps } from '@react-three/cannon'
// import { useSphere, BodyProps } from 'use-cannon'

import { useFrame, useThree } from '@react-three/fiber'
// import { Raycaster, Vector3, Euler, Quaternion } from 'three'
import * as THREE from 'three'
import { Projectile } from './Projectile'
/*
import { useMouseInput } from './useMouseInput'
import { useKeyboardInput } from './useKeyboardInput'
import { useVariableRef } from './useVariableRef'
import { Joystick } from '../../../../hooks/useJoystick'
*/
import { useControllerStore } from '../../../../stores/useControllerStore'

const SPEED = 5
const BULLET_SPEED = 35
const BULLET_COOL_DOWN_TIME = 300
const JUMP_SPEED = 5
const JUMP_COOL_DOWN_TIME = 400

const accel = 0.001
const rotateSpeed = 0.002
const friction = 0.00003

export interface Bullet {
  id: number
  position: [number, number, number]
  forward: [number, number, number]
}

// https://codesandbox.io/s/balls-collisions-xcnu5?file=/src/state.js:743-816

// https://codesandbox.io/embed/r3f-positional-audio-246wl audio

export const Player: React.FC<{}> = () => {
  const [sphereRef, api] = useSphere(() => ({
    mass: 100,
    // fixedRotation: true, - set if don't want body to rotate - OG was true
    position: [0, 1, 0],
    args: 0.2,
    material: {
      friction: 0,
    },
  }))

  const [bullets, setBullets] = useState<Array<Bullet>>([])

  const stateRef = useRef({
    timeToShoot: 0,
    timeTojump: 0,
    vel: [0, 0, 0],
    rot: [0, 0, 0], // kf add
    jumping: false,
  })

  // const pressed = useKeyboardInput(['w', 'a', 's', 'd', ' '])
  // kf - const pressed = useKeyboardInput(['i', 'j', 'k', 'l', 'm', 'n'])

  // const pressedMouse = useMouseInput()
  // const input = useVariableRef<ReturnType<typeof useKeyboardInput>>(pressed)
  // const mouseInput = useVariableRef<ReturnType<typeof useMouseInput>>(pressedMouse)

  const { camera, scene } = useThree()

  useEffect(() => {
    api.velocity.subscribe((v) => (stateRef.current.vel = v))
    api.rotation.subscribe((v) => (stateRef.current.rot = v)) // kf add
  }, [api])

  const joystick = useControllerStore((state) => state.controller)

  useFrame(({ clock }) => {
    // const { w, s, a, d } = input.current
    // const { i, j, k, l } = input.current
    // const space = input.current[' ']
    /*
    const space = input.current['m']
    const kfShoot = input.current['n']
    */
    const space = false
    const kfShoot = joystick.button

    let velocity = new THREE.Vector3(0, 0, 0)
    // let cameraDirection = new THREE.Vector3()
    let cameraDirection = new THREE.Vector3(0, 0, 0)
    camera.getWorldDirection(cameraDirection)

    // let forward = new THREE.Vector3()
    let forward = new THREE.Vector3(0, 0, 0)
    forward.setFromMatrixColumn(camera.matrix, 0)
    forward.crossVectors(camera.up, forward)

    // let right = new THREE.Vector3()
    let right = new THREE.Vector3(0, 0, 0)
    right.setFromMatrixColumn(camera.matrix, 0)

    let [horizontal, vertical] = [0, 0]

    if (joystick.up) {
      vertical += 1
    }
    if (joystick.down) {
      vertical -= 1
    }
    if (joystick.right) {
      horizontal += 1
    }
    if (joystick.left) {
      horizontal -= 1
    }

    if (horizontal !== 0 && vertical !== 0) {
      velocity
        .add(forward.clone().multiplyScalar(SPEED * vertical))
        .add(right.clone().multiplyScalar(SPEED * horizontal))

      velocity.clampLength(-5, 5)
      // ORIGINAL
      // } else if (horizontal !== 0) {
      //  velocity.add(right.clone().multiplyScalar(SPEED * horizontal))

      // ADDITIONS
    } else if (horizontal < 0) {
      // api.rotation.set(0, 0, -0.08)
      // const t = clock.getElapsedTime()
      // api.rotation.set(new THREE.Euler(0, 0, -rotateSpeed * clock.getElapsedTime())) // or clock.getDelta?
      // api.rotation.set(Math.sin(t * 6), Math.cos(t * 6), 0)
      // api.angularVelocity.set
      // api.angularVelocity.set(0, 0, 0.5)
    } else if (horizontal > 0) {
      api.rotation.set(0, 0, -0.08)
      // state.balls[id].lookDir.applyEuler(new THREE.Euler(0, 0, rotateSpeed * clock.getElapsedTime()))
    } else if (vertical !== 0) {
      velocity.add(forward.clone().multiplyScalar(SPEED * vertical))
    }

    api.velocity.set(velocity.x, stateRef.current.vel[1], velocity.z)
    // @future - next step - api.rotation.set(vel)
    // api.angularVelocity.set(0, 0, 0.5)

    if (sphereRef.current?.position) {
      camera.position.set(sphereRef.current.position.x, sphereRef.current.position.y + 1, sphereRef.current.position.z)
    }

    // kf - rotate on y axis - rotation.y.set
    if (sphereRef.current?.rotation) {
      // camera.rotation.set(sphereRef.current.rotation.x, sphereRef.current.rotation.y + 0, sphereRef.current.rotation.z)
    }

    if (stateRef.current.jumping && stateRef.current.vel[1] < 0) {
      if (sphereRef.current?.position) {
        const raycaster = new THREE.Raycaster(sphereRef.current.position, new THREE.Vector3(0, -1, 0), 0, 0.2)
        const intersects = raycaster.intersectObjects(scene.children)

        if (intersects.length !== 0) {
          stateRef.current.jumping = false
        }
      }
    }

    if (space && !stateRef.current.jumping) {
      const now = Date.now()
      if (now > stateRef.current.timeTojump) {
        stateRef.current.timeTojump = now + JUMP_COOL_DOWN_TIME
        stateRef.current.jumping = true
        api.velocity.set(stateRef.current.vel[0], JUMP_SPEED, stateRef.current.vel[2])
      }
    }

    const bulletDirection = cameraDirection.clone().multiplyScalar(BULLET_SPEED)
    const bulletPosition = camera.position.clone().add(cameraDirection.clone().multiplyScalar(2))

    if (kfShoot) {
      // if (mouseInput.current.left || kfShoot) {
      const now = Date.now()
      if (now >= stateRef.current.timeToShoot) {
        stateRef.current.timeToShoot = now + BULLET_COOL_DOWN_TIME
        setBullets((bullets) => [
          ...bullets,
          {
            id: now,
            position: [bulletPosition.x, bulletPosition.y, bulletPosition.z],
            forward: [bulletDirection.x, bulletDirection.y, bulletDirection.z],
          },
        ])
      }
    }
  })

  return (
    <>
      {bullets.map((bullet) => {
        return <Projectile key={bullet.id} velocity={bullet.forward} position={bullet.position} />
      })}
      <mesh ref={sphereRef}>
        <sphereBufferGeometry args={[1, 32, 32]} />
        <meshPhongMaterial color={'hotpink'} />
      </mesh>
    </>
  )
}
