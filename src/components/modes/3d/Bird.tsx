import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

import { useFrame, useLoader } from 'react-three-fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// @ts-ignore
const Bird = ({ speed, factor, url, ...props }) => {
  const gltf = useLoader(GLTFLoader, url)
  const group = useRef()

  // @ts-ignore
  const [mixer] = useState(() => new THREE.AnimationMixer())

  useEffect(() => {
    // @ts-ignore
    if (gltf?.animations) {
      // @ts-ignore
      return void mixer.clipAction(gltf.animations[0], group.current).play()
    }
  },
    // @ts-ignore
    [gltf.animations, mixer]
  )

  useFrame((state, delta) => {
    // @ts-ignore
    group.current.rotation.y +=
      Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
    mixer.update(delta * speed)
  })

  return (
    <group ref={group}>
      <scene name="Scene" {...props}>
        <mesh
          name="Object_0"
          // @ts-ignore
          morphTargetDictionary={gltf.nodes.Object_0.morphTargetDictionary}
          // @ts-ignore
          morphTargetInfluences={gltf.nodes.Object_0.morphTargetInfluences}
          rotation={[1.5707964611537577, 0, 0]}
        >
          <bufferGeometry attach="geometry"
          // @ts-ignore
          {...gltf.nodes.Object_0.geometry} />
          <meshStandardMaterial
            attach="material"
            // @ts-ignore
            {...gltf.nodes.Object_0.material}
            name="Material_0_COLOR_0"
          />
        </mesh>
      </scene>
    </group>
  )
}

export default Bird
