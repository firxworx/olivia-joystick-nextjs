import dynamic from 'next/dynamic'

import * as THREE from 'three'
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useLoader, useFrame } from 'react-three-fiber'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Joystick } from '../../hooks/useJoystick'
// import { OrbitControls } from '@react-three/drei'
// import { OrbitControls } from './3d/OrbitControls'
// fail import { useGLTF, OrbitControls } from '@react-three/drei'
// const controls = new OrbitControls(camera, renderer.domElement)
// const GLTFLoader = dynamic(() => import('three/examples/jsm/loaders/GLTFLoader'))


// @ts-ignore
/*
const GLTFLoader = dynamic(() =>
  import('three/examples/jsm/loaders/GLTFLoader').then((x) => x.GLTFLoader)
)
*/

const Bird = dynamic(() => import('./3d/Bird'), { ssr: false })

// @ts-ignore
const OrbitControls = dynamic(() => import('three/examples/js/controls/OrbitControls'), { ssr: false })

// nextjs version
/*
const Birds: React.FC<{}> = () => {
  return new Array(5).fill(undefined).map((_, i) => {
    const x = (15 + Math.random() * 30) * (Math.round(Math.random()) ? -1 : 1)
    const y = -10 + Math.random() * 20
    const z = -5 + Math.random() * 10
    const bird = ['stork', 'parrot', 'flamingo'][Math.round(Math.random() * 2)]
    let speed = bird === 'stork' ? 0.5 : bird === 'flamingo' ? 2 : 5
    let factor =
      bird === 'stork'
        ? 0.5 + Math.random()
        : bird === 'flamingo'
        ? 0.25 + Math.random()
        : 1 + Math.random() - 0.5

    return (
      <Bird
        key={i}
        position={[x, y, z]}
        rotation={[0, x > 0 ? Math.PI : 0, 0]}
        speed={speed}
        factor={factor}
        url={`/glb/${bird}.glb`}
      />
    )
  })
}
*/

// OG version
const Birds: React.FC<{}> = () => {
  return (
    <>
      {(new Array(10)).fill(undefined).map((_, i) => {
        const x = (15 + Math.random() * 30) * (Math.round(Math.random()) ? -1 : 1)
        const y = -10 + Math.random() * 20
        const z = -5 + Math.random() * 10
        const bird = ['stork', 'parrot', 'flamingo'][Math.round(Math.random() * 2)]
        let speed = bird === 'stork' ? 0.5 : bird === 'flamingo' ? 2 : 5
        let factor = bird === 'stork' ? 0.5 + Math.random() : bird === 'flamingo' ? 0.25 + Math.random() : 1 + Math.random() - 0.5

        return (
          <Bird key={i} position={[x, y, z]} rotation={[0, x > 0 ? Math.PI : 0, 0]} speed={speed} factor={factor} url={`/olivia-joystick-nextjs/assets/3d/${bird}.glb`} />
        )
      })}
    </>
  )
}

export const ThreeBird: React.FC<{ joystick: Joystick, speak: (phrase: string) => void }> = ({ joystick, speak }) => {
return (
  <Canvas camera={{ position: [0, 0, 35] }}>
    <ambientLight intensity={2} />
    <pointLight position={[40, 40, 40]} />
    <OrbitControls />
    <Suspense fallback={null}>
      <Birds />
    </Suspense>
  </Canvas>
)
}
