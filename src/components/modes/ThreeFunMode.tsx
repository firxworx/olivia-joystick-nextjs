import React, { Suspense, useMemo } from 'react'
import dynamic from 'next/dynamic'

import * as THREE from 'three'
import { Html, Stars, Sky } from '@react-three/drei' // Sky, Cloud, Stars, OrbitControls
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane } from '@react-three/cannon' // useBox, useCylinder
// import { Physics, usePlane } from 'use-cannon'

import { Targets } from './3d/FunMode/Targets'
import { Player } from './3d/FunMode/Player'
import { BASE_URL } from 'src/constants/app'
// import { Cow } from '../models/animals/Cow'

// dynamic() is the nextjs way to go for loading these assets
// const Bird = dynamic(() => import('./3d/Bird'), { ssr: false })
// const MountainScene = dynamic(() => import('../models/scenes/MountainScene'), { ssr: false })
const CuteCat = dynamic(() => import('../models/animals/CuteCat'), { ssr: false })
const Puppy = dynamic(() => import('../models/animals/Puppy'), { ssr: false })

export const GroundPlane = () => {
  const [ref, api] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.25, 0],
    material: {
      friction: 0.5,
    },
  }))

  const texture = useMemo(() => {
    const t = new THREE.TextureLoader().load(`${BASE_URL}/assets/3d/textures/grass.jpg`)
    t.wrapS = THREE.RepeatWrapping
    t.wrapT = THREE.RepeatWrapping
    t.minFilter = THREE.LinearFilter
    t.repeat.set(100, 100)
    return t
  }, [])

  return (
    <mesh ref={ref} receiveShadow={true} scale={[100, 100, 100]}>
      <planeBufferGeometry />
      {/* <meshPhongMaterial color={'#333333'} /> */}
      <meshStandardMaterial map={texture} attach="material" />
    </mesh>
  )
}

// truck game? https://github.com/isBatak/react-three-fiber-truck/tree/a101dd5d7bf62b0451dc4652b8c10cc0b8e66b12

// {/* fackin birds causing an issue when things change */}
export const ThreeFunMode: React.FC<{}> = () => {
  // the Player component listens for the keyboard and handles movement
  return (
    <Canvas
      // camera={{ position: [0.5, 3, 4.5], fov: 50 }}
      // camera={{ position: [0, 0, 35] }}
      // camera={{ position: [3, 8, -4] }}
      camera={{ position: [0, 0, 0], fov: 100 }}
      // @ts-ignore
      shadowMap
    >
      <Sky sunPosition={[100, 10, 100]} />

      {/*<Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />*/}
      {/* <axesHelper /> */}
      {/*<fog attach="fog" args={['white', 0, 26]} />*/}

      <ambientLight intensity={0.8} />
      <pointLight position={[40, 40, 40]} />

      {/* <OrbitControls /> */}

      <Suspense fallback={<Html center>Loading.</Html>}>
        <Physics gravity={[0, -9.8, 0]} tolerance={0} iterations={50} broadphase={'SAP'}>
          <Targets />
          <Player />
          {/* <MountainScene /> */}
          <CuteCat position={[2, 0, 3]} />
          <Puppy position={[10, 0, -5]} />
          <GroundPlane />
        </Physics>
      </Suspense>
      {/* <gridHelper args={[100, 100]} /> */}
    </Canvas>
  )
}
