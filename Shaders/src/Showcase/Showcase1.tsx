import React, { useEffect, useRef } from 'react'
import { useFrame, extend, ReactThreeFiber, useThree } from '@react-three/fiber'
import { shaderMaterial, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Define the custom shader material
const ColorShiftMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor1: new THREE.Color(1.0, 1.0, 1.0), // White
        uColor2: new THREE.Color(1.0, 0.4, 0.4), // Medium/Light Red
        uSize: 2.0, // Reduced base size for gaps
    },
    // Vertex Shader
    `
        uniform float uTime;
        uniform float uSize;
        varying vec2 vUv;
        
        void main() {
        vUv = uv;
        
        // Calculate simple wave displacement for "good positions" dynamic feel
        vec3 pos = position;
        // pos.y += ;
        float wave = sin(pos.x * 0.75 + uTime) * 0.15;
        float wave2 = sin(pos.z * 0.75 + uTime) * 0.15;
        pos.z += wave;
        // pos.x += wave2;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Size attenuation: points get smaller as they move away
        gl_PointSize = uSize * (20.0 / -mvPosition.z);
        }
    `,
    // Fragment Shader
    `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;

        void main() {
        // Create a smooth wave pattern for color mixing
        float wave = sin(vUv.x * 5.0 + uTime) * 0.5 + 0.5;
        float wave2 = cos(vUv.y * 5.0 + uTime * 2.0) * 0.5 + 0.5;
        
        float strength = (wave + wave2) * 0.5;
        
        vec3 finalColor = mix(uColor1, uColor2, strength);
        
        // Optional: Circular points instead of square
        // vec2 coord = gl_PointCoord - vec2(0.5);
        // if(length(coord) > 0.5) discard;
        
        gl_FragColor = vec4(finalColor, 1.0);
        }
    `
)

// Extend the material so it can be used as a JSX element
extend({ ColorShiftMaterial })

// Add type support for the custom material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      colorShiftMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof ColorShiftMaterial> & {
          uTime?: number
          uColor1?: THREE.Color
          uColor2?: THREE.Color
          uSize?: number
      }
    }
  }
}

const Scene = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null!)

    const { camera } = useThree()

    useEffect(() => {
        camera.lookAt(0,0,0);
    }, [camera])

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta
        }
    })

    return (
        <>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" />
            
            {/* Using points for the pixelated look */}
            <points rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
                {/* High segment count for more 'pixels' */}
                <planeGeometry args={[20, 20, 128, 128]} />
                {/* Transparent true helps with some point rendering artifacts if they overlap */}
                <colorShiftMaterial ref={materialRef} transparent={true} />
            </points>
        </>
    )
}

const Showcase1 = () => {
    return (
        <Scene />
    )
}

export default Showcase1