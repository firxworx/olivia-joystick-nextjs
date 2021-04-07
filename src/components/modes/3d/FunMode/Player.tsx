import React, { useEffect, useRef, useState } from 'react'
import { useSphere, BodyProps } from '@react-three/cannon'
import { useFrame, useThree } from '@react-three/fiber'
import { Raycaster, Vector3, Euler, Quaternion } from 'three'
import { Projectile } from './Projectile'
import { useMouseInput } from './useMouseInput'
import { useKeyboardInput } from './useKeyboardInput'
import { useVariableRef } from './useVariableRef'

const SPEED = 5
const BULLET_SPEED = 35
const BULLET_COOL_DOWN_TIME = 300
const JUMP_SPEED = 5
const JUMP_COOL_DOWN_TIME = 400

export interface Bullet {
  id: number
  position: [number, number, number]
  forward: [number, number, number]
}

export const Player: React.FC<{}> = () => {
  const [sphereRef, api] = useSphere(() => ({
    mass: 100,
    fixedRotation: true,
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
    jumping: false,
  })

  // const pressed = useKeyboardInput(['w', 'a', 's', 'd', ' '])
  const pressed = useKeyboardInput(['i', 'j', 'k', 'l', 'm', 'n'])

  const pressedMouse = useMouseInput()

  const input = useVariableRef<ReturnType<typeof useKeyboardInput>>(pressed)
  const mouseInput = useVariableRef<ReturnType<typeof useMouseInput>>(pressedMouse)

  const { camera, scene } = useThree()

  useEffect(() => {
    api.velocity.subscribe((v) => (stateRef.current.vel = v))
  }, [api])

  useFrame(() => {
    // const { w, s, a, d } = input.current
    const { i, j, k, l } = input.current
    // const space = input.current[' ']
    const space = input.current['m']

    const kfShoot = input.current['n']

    let velocity = new Vector3(0, 0, 0)
    let cameraDirection = new Vector3()
    camera.getWorldDirection(cameraDirection)

    let forward = new Vector3()
    forward.setFromMatrixColumn(camera.matrix, 0)
    forward.crossVectors(camera.up, forward)

    let right = new Vector3()
    right.setFromMatrixColumn(camera.matrix, 0)

    let [horizontal, vertical] = [0, 0]

    if (i) {
      // w
      vertical += 1
    }
    if (k) {
      // s
      vertical -= 1
    }
    if (l) {
      // d
      horizontal += 1
    }
    if (j) {
      // a
      horizontal -= 1
    }

    if (horizontal !== 0 && vertical !== 0) {
      velocity
        .add(forward.clone().multiplyScalar(SPEED * vertical))
        .add(right.clone().multiplyScalar(SPEED * horizontal))
      velocity.clampLength(-5, 5)
    } else if (horizontal !== 0) {
      velocity.add(right.clone().multiplyScalar(SPEED * horizontal))
    } else if (vertical !== 0) {
      velocity.add(forward.clone().multiplyScalar(SPEED * vertical))
    }

    api.velocity.set(velocity.x, stateRef.current.vel[1], velocity.z)
    //api.rotation.set(vel)

    if (sphereRef?.current) {
      camera.position.set(sphereRef.current.position.x, sphereRef.current.position.y + 1, sphereRef.current.position.z)
    }

    if (stateRef.current.jumping && stateRef.current.vel[1] < 0) {
      if (sphereRef.current) {
        const raycaster = new Raycaster(sphereRef.current.position, new Vector3(0, -1, 0), 0, 0.2)
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

    if (mouseInput.current.left || kfShoot) {
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
