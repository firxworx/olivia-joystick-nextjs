import { useSphere, BodyProps } from '@react-three/cannon'
// import { useSphere, BodyProps } from 'use-cannon'

export const Projectile: React.FC<BodyProps> = (props) => {
  const [sphereRef, api] = useSphere(() => ({
    mass: 5,
    args: 0.1,
    ...props,
  }))

  return (
    <mesh ref={sphereRef} castShadow>
      <sphereBufferGeometry args={[0.1, 32, 32]} />
      <meshLambertMaterial color="red" />
    </mesh>
  )
}
