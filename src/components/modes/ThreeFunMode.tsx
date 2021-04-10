import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

import { Html } from '@react-three/drei' // Sky, Cloud, Stars, OrbitControls
import { Canvas } from '@react-three/fiber'
import { Physics, usePlane } from '@react-three/cannon' // useBox, useCylinder

import { Targets } from './3d/FunMode/Targets'
import { Player } from './3d/FunMode/Player'

// dynamic() is the nextjs way to go for loading these assets
const Bird = dynamic(() => import('./3d/Bird'), { ssr: false })

export const GroundPlane = () => {
  const [ref, api] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.25, 0],
    material: {
      friction: 0.1,
    },
  }))

  return (
    <mesh ref={ref} receiveShadow={true} scale={[1000, 1000, 1000]}>
      <planeBufferGeometry />
      <meshPhongMaterial color={'#333333'} />
    </mesh>
  )
}

const Birds: React.FC<{}> = () => {
  return (
    <>
      {new Array(10).fill(undefined).map((_, i) => {
        const x = (15 + Math.random() * 30) * (Math.round(Math.random()) ? -1 : 1)
        const y = 2 + Math.random() * 20
        const z = -5 + Math.random() * 10
        const bird = ['stork', 'parrot', 'flamingo'][Math.round(Math.random() * 2)]
        let speed = bird === 'stork' ? 0.5 : bird === 'flamingo' ? 2 : 5
        let factor =
          bird === 'stork' ? 0.5 + Math.random() : bird === 'flamingo' ? 0.25 + Math.random() : 1 + Math.random() - 0.5

        return (
          <Bird
            key={i}
            position={[x, y, z]}
            rotation={[0, x > 0 ? Math.PI : 0, 0]}
            speed={speed}
            factor={factor}
            url={`/olivia-joystick-nextjs/assets/3d/${bird}.glb`}
          />
        )
      })}
    </>
  )
}

export const ThreeFunMode: React.FC<{}> = () => {
  return (
    <Canvas
      // camera={{ position: [0.5, 3, 4.5], fov: 50 }}
      // camera={{ position: [0, 0, 35] }}
      // camera={{ position: [3, 8, -4] }}
      // @ts-ignore
      shadowMap
    >
      {/*<Sky sunPosition={[100, 10, 100]} />*/}
      <axesHelper />

      {/* <fog attach="fog" args={["white", 0, 26]} /> */}
      <ambientLight intensity={0.8} />
      <pointLight position={[40, 40, 40]} />
      {/* <OrbitControls /> */}
      <Suspense fallback={<Html center>Loading.</Html>}>
        <Physics gravity={[0, -18, 0]} tolerance={0} iterations={50} broadphase={'SAP'}>
          <Targets />
          {/* fackin birds causing an issue when things change */}
          {/*<Birds />*/}
          <Player />
          <GroundPlane />
        </Physics>
      </Suspense>
      <gridHelper />
    </Canvas>
  )
}
