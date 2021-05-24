import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useSphere } from '@react-three/cannon'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
// import { PositionalAudio } from '@react-three/drei'

import { Projectile } from './Projectile'
import { useControllerStore } from '../../../../stores/useControllerStore'
import useSound from 'use-sound'

const SPEED = 5
const PROJECTILE_SPEED = 15
const PROJECTILE_COOL_DOWN_TIME = 300
const PROJECTILE_MAX_COUNT = 10
const JUMP_SPEED = 5
const JUMP_COOL_DOWN_TIME = 400

const ANGULAR_SPEED = 2

const BASE_PATH = '/olivia-joystick-nextjs'

// const accel = 0.001
// const rotateSpeed = 0.002
// const friction = 0.00003

export interface Projectile {
  id: number
  position: [number, number, number]
  forward: [number, number, number]
}

const yAxisNormalizedVector = new THREE.Vector3(0, 1, 0).normalize()

// consider this approach for when using the PositionalAudio
// useLoader.preload(THREE.AudioLoader, 'assets/sfx/shoot.wav')

// the player is represented by a sphere w/ fixed rotation (i.e. prevented from rotating)
export const Player: React.FC<{}> = () => {
  const [playSfxShoot] = useSound(`${BASE_PATH}/assets/sfx/toss.ogg`)

  const [sphereRef, api] = useSphere(() => ({
    fixedRotation: true,
    mass: 100,
    position: [0, 8, 0],
    args: 0.2,
    material: {
      friction: 0,
    },
  }))

  const [projectiles, setProjectiles] = useState<Array<Projectile>>([])

  const stateRef = useRef({
    timeToShoot: 0,
    timeTojump: 0,
    velocity: [0, 0, 0],
    rot: [0, 0, 0],
    jumping: false,
  })

  const { camera, scene } = useThree()

  useEffect(() => {
    // use position perhaps? api.position?

    api.velocity.subscribe((v) => (stateRef.current.velocity = v))
    api.rotation.subscribe((v) => (stateRef.current.rot = v))
  }, [api])

  const joystick = useControllerStore((state) => state.controller)

  useFrame(({ clock }) => {
    // jump action disabled for now...
    const space = false
    const shoot = joystick.button

    const velocity = new THREE.Vector3()

    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)

    const forward = new THREE.Vector3()
    forward.setFromMatrixColumn(camera.matrix, 0)
    forward.crossVectors(camera.up, forward)

    if (sphereRef.current) {
      if (joystick.up || joystick.down) {
        const forwardDirection = joystick.up && !joystick.down ? 1 : -1

        velocity.add(forward.clone().multiplyScalar(SPEED * forwardDirection))
        // velocity.clampLength(-5, 5) // necessary?
      }

      if (joystick.left || joystick.right) {
        const rotationDirection = joystick.left && !joystick.right ? 1 : -1

        const cur = sphereRef.current.quaternion
        const rot = new THREE.Quaternion().setFromAxisAngle(
          yAxisNormalizedVector,
          (ANGULAR_SPEED * Math.PI * rotationDirection) / 180
        )

        // multiply to combine to single rotation
        const mult = cur.multiplyQuaternions(rot, cur)

        // rotate the player
        const euler = new THREE.Euler().setFromQuaternion(mult)
        api.rotation.set(euler.x, euler.y, euler.z)

        // rotate the camera with the player
        camera.rotation.set(sphereRef.current.rotation.x, sphereRef.current.rotation.y, sphereRef.current.rotation.z)
      }
    }

    // move the camera forward/back with the player
    if (sphereRef.current?.position) {
      camera.position.set(sphereRef.current.position.x, sphereRef.current.position.y + 1, sphereRef.current.position.z)
    }

    // handle jump
    api.velocity.set(velocity.x, stateRef.current.velocity[1], velocity.z)

    if (stateRef.current.jumping && stateRef.current.velocity[1] < 0) {
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
        api.velocity.set(stateRef.current.velocity[0], JUMP_SPEED, stateRef.current.velocity[2])
      }
    }

    // handle shooting projectiles
    if (shoot) {
      const projectileDirection = cameraDirection.clone().multiplyScalar(PROJECTILE_SPEED)
      const projectilePosition = camera.position.clone().add(cameraDirection.clone().multiplyScalar(2))

      const now = Date.now()
      if (now >= stateRef.current.timeToShoot) {
        playSfxShoot()

        stateRef.current.timeToShoot = now + PROJECTILE_COOL_DOWN_TIME
        setProjectiles((prev) => [
          {
            id: now,
            position: [projectilePosition.x, projectilePosition.y, projectilePosition.z],
            forward: [projectileDirection.x, projectileDirection.y, projectileDirection.z],
          },
          ...(prev.length > PROJECTILE_MAX_COUNT ? prev.slice(0, PROJECTILE_MAX_COUNT) : prev),
        ])
      }
    }
  })

  return (
    <>
      {projectiles.map((projectile) => {
        return <Projectile key={projectile.id} velocity={projectile.forward} position={projectile.position} />
      })}

      <mesh ref={sphereRef}>
        <sphereBufferGeometry args={[1, 32, 32]} />
        <meshPhongMaterial color={'hotpink'} />
      </mesh>
    </>
  )
}
