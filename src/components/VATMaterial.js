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
    uniform vec3 uMin;
    uniform vec3 uMax;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec2 vLookUp; 

    void main() {
      vUv = uv;

      // Calculate Frame Y
      float frameY = (uTime + 0.5) / uTotalFrames;

      // Read Position Data
      vec2 readUV = vec2(uv2.x, frameY);
      vLookUp = readUV; // Pass to fragment
      
      // Fetch displacement
      vec4 texData = texture2D(uPosMap, readUV);
      vec3 displacement = uMin + texData.rgb * (uMax - uMin);
      
      vec3 newPos = position + displacement; 

      vNormal = normal; 

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  // FRAGMENT SHADER
  `
    varying vec2 vUv;
    varying vec3 vNormal; 
    
    void main() {
      // Basic lighting based on normals
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float light = dot(vNormal, lightDir) * 0.5 + 0.5;
      gl_FragColor = vec4(vec3(light), 1.0);
    }
  `
)

extend({ VATMaterial })

export { VATMaterial }