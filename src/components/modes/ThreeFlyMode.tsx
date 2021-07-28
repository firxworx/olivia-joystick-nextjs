import React, { Suspense } from 'react'
import * as THREE from 'three'
import { Html, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'

import { MetalUFO } from '../models/vehicles/MetalUFO'
import { CloudSphereOrange } from '../models/scenes/CloudSphereOrange'
import { SpinningHeart } from '../models/game/SpinningHeart'
import { PoopEmoji } from '../models/game/PoopEmoji'

import { useControllerStore } from '../../stores/useControllerStore'

/**
 * Return size of the given `THREE.Object3D` calculated via bounding box.
 */
const getBoxSize = (obj?: THREE.Object3D): [number, number, number] | undefined => {
  if (obj) {
    const helper = new THREE.BoxHelper(obj)
    helper.geometry.computeBoundingBox()

    const bb = helper.geometry.boundingBox
    if (bb) {
      return [bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z]
    }
  }

  return undefined
}

/**
 * Player component that wraps the UFO model and responds to joystick controls.
 */
export const PlayerUFO: React.FC = () => {
  const groupRef = React.useRef<THREE.Group>(null)

  const joystick = useControllerStore((state) => state.controller)

  const { viewport } = useThree()
  const vph = viewport.getCurrentViewport().height / 2 - 0.55
  const vpw = viewport.getCurrentViewport().width / 2 - 1.25

  const size = React.useMemo(() => getBoxSize(groupRef.current?.children[0]) ?? [0, 0, 0], [groupRef.current])

  useFrame(() => {
    if (!groupRef.current?.position) {
      return
    }

    if (joystick.up && groupRef.current.position.y < vph + size[1]) {
      groupRef.current.position.y += 0.05
    }

    if (joystick.down && groupRef.current.position.y > -1 * vph - size[1]) {
      groupRef.current.position.y -= 0.05
    }

    if (joystick.left && groupRef.current.position.x < vpw + size[0]) {
      groupRef.current.position.x += 0.05
    }

    if (joystick.right && groupRef.current.position.x > -1 * vpw - size[0]) {
      groupRef.current.position.x -= 0.05
    }
  })

  return <MetalUFO ref={groupRef} position={[0, 0, 0]} />
}

const CAMERA_FOV = 50
const CAMERA_Z = -15

/**
 * Player controls a flying saucer's movement... Game WIP
 */
export const ThreeFlyMode: React.FC<{}> = () => {
  const cameraRef = React.useRef<THREE.PerspectiveCamera>(null)

  return (
    <Canvas
      // @ts-expect-error
      shadowMap
    >
      <PerspectiveCamera ref={cameraRef} position={[0, 0, CAMERA_Z]} fov={CAMERA_FOV} makeDefault />
      <ambientLight intensity={1} />
      <pointLight position={[40, 40, 40]} />
      <pointLight position={[0, 0, -10]} />
      <Suspense fallback={<Html center>Loading...</Html>}>
        <PlayerUFO />
        <SpinningHeart position={[-4, 0, 0]} />
        <PoopEmoji position={[4, 0, 0]} />
        <CloudSphereOrange />
      </Suspense>
      <axesHelper />
      <OrbitControls />
    </Canvas>
  )
}
