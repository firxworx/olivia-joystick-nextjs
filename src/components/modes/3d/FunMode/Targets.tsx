import { useEffect, useState } from 'react'
import { useBox, BodyProps } from '@react-three/cannon'
import niceColors from 'nice-color-palettes'

const paletteIndex = 8

export const Cube: React.FC<BodyProps> = (props) => {
  const [color, setColor] = useState('white')
  const [cubeRef, api] = useBox(() => ({
    mass: 1,
    args: [0.5, 0.5, 0.5],
    material: {
      friction: 1,
      restitution: 0,
    },
    ...props,
  }))

  useEffect(() => setColor(niceColors[paletteIndex][Math.floor(Math.random() * niceColors[paletteIndex].length)]), [])

  return (
    <mesh ref={cubeRef} castShadow>
      <boxBufferGeometry args={[0.5, 0.5, 0.5]} />
      <meshLambertMaterial color={color} />
    </mesh>
  )
}

export const Targets: React.FC<{}> = () => {
  return (
    <>
      <Cube position={[0, 0, -5]} />
      <Cube position={[-0.6, 0, -5]} />
      <Cube position={[0.6, 0, -5]} />
      <Cube position={[-0.3, 0.5, -5]} />
      <Cube position={[0.3, 0.5, -5]} />
      <Cube position={[0, 1, -5]} />

      <Cube position={[-5, 0, -5]} />
      <Cube position={[-5, 0.5, -5]} />
      <Cube position={[-5, 1, -5]} />
      <Cube position={[-5, 1.5, -5]} />

      {/*
      <Cube position={[0, 0, 5]} type={'Static'} />
      <Cube position={[0, 0, 5.5]} type={'Static'} />
      <Cube position={[0, 0.5, 5.5]} type={'Static'} />
      */}
    </>
  )
}
