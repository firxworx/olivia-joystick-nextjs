import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from 'react-three-fiber' // useThree
import { Physics, usePlane, useBox, useCylinder } from '@react-three/cannon'
// import { Sky } from 'drei' // Stats, Sky, OrbitControls, PointerLockControls  // SKy current version crashes
// import { Physics } from 'use-cannon'
import niceColors from 'nice-color-palettes'
import Sphere from './3d/Sphere'
import { Joystick } from '../../hooks/useJoystick'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// https://github.com/pmndrs/drei/issues/261

// import { Canvas, useFrame, useThree } from "react-three-fiber";
// https://codesandbox.io/s/3qdm3?file=/src/App.tsx:128-192 // r3f hello world

// https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box

// https://tympanus.net/codrops/2020/09/30/creating-mirrors-in-react-three-fiber-and-three-js/
// https://tympanus.net/codrops/2020/09/30/creating-mirrors-in-react-three-fiber-and-three-js/

// https://codesandbox.io/s/github/onion2k/r3f-by-example/tree/develop/examples/physics/three-balls-perpetual-physics-usecannon?file=/src/ball.js

// 😊, 😢, 🤖, 🦊, 👌🏻

// https://codesandbox.io/s/m30n5?file=/src/index.js - super cool spring transition

// https://codesandbox.io/s/3wbkv?file=/index.js
// https://codesandbox.io/s/ewpqf?file=/src/index.js
// https://codesandbox.io/s/0j6yb - cool cube-grid, could move x,y with joystick

// https://codesandbox.io/s/bee-and-flowers-tin2n?file=/src/world/Player.js -- flying bee demo

// https://codesandbox.io/s/r3f-cannon-physics-h4mwj?file=/src/index.js - plane that disappears then blocks fall

// https://codesandbox.io/s/angry-noether-txxw9?file=/src/Player.js music player ui
// https://codesandbox.io/s/use-cannon-cylinder-wobble-34z0n wobbly cylinder
// https://codesandbox.io/s/v6lg3?file=/src/App.js - icosohedrons - wobble, slide, etc
// https://codesandbox.io/s/h97zc - SOLID animated example (the initials that cast a shadow)

const Plane: React.FC<{
  position?: [number, number, number],
  rotation?: [number, number, number],
}> = ({ position = [0, 0, 0], rotation = [-Math.PI / 2, 0, 0] }) => {
  const [ref] = usePlane(() => ({
    mass: 0,
    position,
    rotation,
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={[100, 100]} />
      <meshStandardMaterial attach="material" color={'#aaa'} />
    </mesh>
  )
}

const CannonPlane: React.FC<any> = (props) => {
  const [ref] = usePlane(() => ({ ...props }));
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial color={"#dddddd"} />
    </mesh>
  )
}

//
const Cube: React.FC<{}> = () => {
  const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0] }))

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxBufferGeometry args={[ 1, 1 ]} />
      <meshStandardMaterial roughness={0.5} color="#f0f0f0" />
    </mesh>
  )
}

// WORKS - rotates
const RotatingBox: React.FC<{}> = () => {
  const ref = useRef<THREE.Mesh>()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.005;
      ref.current.rotation.y += 0.0075;
    }
  })

  return (
    <mesh ref={ref}>
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial
        attach="material"
        color={'hotpink'} // 0xfe9966 - peach
      />
    </mesh>
  );
}

const Coins: React.FC<{ number: number }> = ({ number }) => {
  //https://codesandbox.io/s/vigilant-bash-xfxpg?file=/src/index.js:548-1405
  // const texture = useLoader(THREE.TextureLoader, "./coin.png");

  // @ts-ignore
  const [ref, api] = useCylinder(() => ({
    mass: 1,
    args: [0.1, 0.1, 0.05, 20],
    rotation: [Math.random() - 0.5, Math.random() * 2 + 1, Math.random() - 0.5],
    position: [Math.random() - 0.5, Math.random() * 2 + 1, Math.random() - 0.5]
  }));

  useFrame(() =>
    api
      .at(Math.floor(Math.random() * number))
      .position.set(Math.random(), Math.random() * 2, Math.random())
  );

  return (
    <instancedMesh
      receiveShadow
      castShadow
      ref={ref}
      // @ts-ignore
      args={[null, null, number]}
    >
      <cylinderBufferGeometry
        attach="geometry"
        args={[0.1, 0.1, 0.05, 20]}
      ></cylinderBufferGeometry>
      <meshLambertMaterial attach="material" color="gold" />
    </instancedMesh>
  );
}

const Cubes: React.FC<{ number: number }> = ({ number }) => {
  const yFactor = 3 // orig 2

  const [ref, api] = useBox(() => ({
    mass: 1,
    args: [0.1, 0.1, 0.1],
    // args: [0.5, 0.5, 0.5],
    position: [Math.random() - 0.5, Math.random() * yFactor, Math.random() - 0.5]
  }))

  const colors = useMemo(() => {
    const array = new Float32Array(number * 3)
    const color = new THREE.Color()
    for (let i = 0; i < number; i++)
      color
        .set(niceColors[17][Math.floor(Math.random() * 5)])
        .convertSRGBToLinear()
        .toArray(array, i * 3)
    return array
  }, [number])

  useFrame(() => api.at(
    Math.floor(Math.random() * number)).position.set(0, Math.random() * yFactor, 0)
  )

  return (
    <instancedMesh
      receiveShadow
      castShadow
      ref={ref}
      // @ts-ignore
      args={[null, null, number]}
    >
      <boxBufferGeometry attach="geometry" args={[0.25, 0.25, 0.25]}>
        <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colors, 3]} />
      </boxBufferGeometry>
      <meshLambertMaterial
        attach="material"
        // @ts-ignore
        vertexColors={THREE.VertexColors}
      />
    </instancedMesh>
  )
}

// <pointLight position={[10, 10, 10]} />
// <directionalLight args={["#FFFFFF", 0.6]} position={[-0.5, 1, 1]} castShadow />
// <ambientLight />
// <hemisphereLight intensity={0.35} />
// <directionalLight position={[5, 5, 5]} intensity={2} castShadow shadow-camera-zoom={2} />
// <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
// <fog attach="fog" args={["#041830", 5, 10]} />
export const ThreeMode2: React.FC<{
  joystick: Joystick,
  speak: (phrase: string) => void
}> = ({ joystick, speak }) => {
  return (
    <Canvas
      className="w-full h-full"
      // colorManagement
      // pixelRatio={window.devicePixelRatio}
      // camera={{ position: [15, 15, 30] }}
      // camera={{ position: [-10, 10, 10], fov: 35 }} // near: 5, far: 20
      // gl={{ antialias: false, alpha: false }}
      // camera={{ position: [0, 0, 20] }}
      // camera={{ position: [0, 0, 1] }}
    >

    <ambientLight intensity={0.5} />
    <pointLight position={[2, 10, 10]} castShadow />
    <Physics>
      {/* <axesHelper position={[0, 0, 0]} args={[10]} /> */}
      <Plane position={[0, -2.25, 0]} />
      {joystick.button && (
        <>
          {/*<Coins number={20} />*/}
          <Cubes number={80} />
        </>
      )}
      {/*<Sphere position={[0.5, 7, 0]} color={"red"} />*/}
    </Physics>
  </Canvas>
  )
}
