import { Canvas } from '@react-three/fiber'
import { SphereShade } from './Shader1/SphereShade'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import {Sphere2Shader} from './Shader1/Sphere2Shader'

const App = () => {
  return (
    <Canvas
      camera={{position: [0,0,0.25]}} 
      dpr={[1, 2]} 
      gl={{ 
        toneMapping: THREE.NoToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      {/* <OrbitControls makeDefault /> */}
      {/* <SphereShade /> */}
      <Sphere2Shader />
    </Canvas>
  )
}

export default App