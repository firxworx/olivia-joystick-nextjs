import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, usePlane, useBox, useCylinder } from '@react-three/cannon'
import niceColors from 'nice-color-palettes'
import { Joystick } from '../../hooks/useJoystick'

// 😊, 😢, 🤖, 🦊, 👌🏻

const Plane: React.FC<{
  position?: [number, number, number],
  rotation?: [number, number, number],
}> = ({ position = [0, 0, 0], rotation = [-Math.PI / 2, 0, 0] }) => {
  const [ref] = usePlane(() => ({
    mass: 0,
    position,
    rotation,
    // ...props
  }))

  return (
    <mesh
      ref={ref}
      receiveShadow
    >
      <planeBufferGeometry args={[100, 100]} />
      <meshStandardMaterial attach="material" color={'#aaa'} />
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

export const ThreeMode2: React.FC<{
  joystick: Joystick,
  speak: (phrase: string) => void
}> = ({ joystick, speak }) => {
  return (
    <Canvas
      className="w-full h-full"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 10, 10]} castShadow />
      <Physics>
        <Plane position={[0, -2.25, 0]} />
        {joystick.button && (
          <>
            {/*<Coins number={20} />*/}
            <Cubes number={80} />
          </>
        )}
      </Physics>
    </Canvas>
  )
}
