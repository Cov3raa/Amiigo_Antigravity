import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const VATMaterial = shaderMaterial(
    {
        uTime: 0,
        uPosMap: null,
        uNormMap: null,
        uMin: new THREE.Vector3(),
        uMax: new THREE.Vector3(),
        uTotalFrames: 211,
    },
    // VERTEX SHADER
    `
    attribute vec2 uv2; // The VAT Lookup
    
    uniform float uTime;
    uniform float uTotalFrames;
    uniform sampler2D uPosMap;
    uniform sampler2D uNormMap;
    uniform vec3 uMin;
    uniform vec3 uMax;

    varying vec2 vUv;

    void main() {
      vUv = uv;

      // Calculate Frame Y
      float frameY = (uTime + 0.5) / uTotalFrames;

      // Read Position Data
      vec2 readUV = vec2(uv2.x, frameY);
      vec4 posData = texture2D(uPosMap, readUV);

      // Expand Position (0..1 -> Min..Max)
      vec3 newPos = mix(uMin, uMax, posData.rgb);

  vNormal = normal; // Pass the mesh normal to the pixel shader

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
    // FRAGMENT SHADER (Lit Version)
    `
    varying vec2 vUv;
    // We need normals to react to light
    varying vec3 vNormal; 

    void main() {
      // 1. SIMPLE VISIBILITY TEST:
      // Output a solid bright color (Teal)
      vec3 objectColor = vec3(0.0, 0.8, 0.8);

      // 2. FAKE LIGHTING (To see 3D shape)
      // Light coming from top-right
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0)); 
      float diff = max(dot(vNormal, lightDir), 0.2); // 0.2 is ambient light

      gl_FragColor = vec4(objectColor * diff, 1.0);
    }
  `
)

extend({ VATMaterial })

export { VATMaterial }