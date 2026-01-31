import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { VATMaterial } from './VATMaterial'

// 1. Define Animation Ranges
// (Check your Blender timeline if these frames look wrong!)
const ANIMATIONS = {
    walk: { start: 0, end: 100 },
    idle: { start: 101, end: 210 }
}

export default function VATCharacter({ position, animationState = 'walk' }) {
    // 1. Change the file extension to .gltf
    const { nodes } = useGLTF('/assets/Character.gltf')

    // 2. Keep the "Robust Finder" (Best for lazy/safe loading)
    // This works regardless of whether the internal name is "Character_vat" or "Object_0"
    const character = Object.values(nodes).find((node) => node.isMesh)

    // Safety Check: If it's still failing, log what we found
    if (!character) {
        console.error("Could not find any mesh! Loaded nodes:", Object.keys(nodes))
        return null // Stop rendering to prevent the crash
    }

    // ... rest of your code (useTexture, useMemo, etc.)

    // 3. Load PNG Textures
    // Make sure these files exist in public/assets/
    const [posMap, normMap] = useTexture([
        '/assets/Character_vat.png',
        '/assets/Character_vnrm.png'
    ])

    useMemo(() => {
        // 4. TEXTURE SETTINGS (Critical for VAT)
        // Prevent blurring (NearestFilter) and color shifting (NoColorSpace)
        posMap.minFilter = posMap.magFilter = THREE.NearestFilter
        posMap.generateMipmaps = false
        posMap.colorSpace = THREE.NoColorSpace
        posMap.flipY = false  // Crucial: VAT textures are often flipped

        normMap.minFilter = normMap.magFilter = THREE.NearestFilter
        normMap.generateMipmaps = false
        normMap.colorSpace = THREE.NoColorSpace
        normMap.flipY = false

        posMap.needsUpdate = true
        normMap.needsUpdate = true

        // 5. GEOMETRY FIX
        // Connect the data in 'uv1' to the shader's 'uv2' input
        if (character.geometry.attributes.uv1) {
            character.geometry.setAttribute('uv2', character.geometry.attributes.uv1)
        }
    }, [posMap, normMap, character.geometry])

    // 6. BOUNDS (Hardcoded Safety)
    // Since your JSON had 0.0 bounds, we force a 4-meter box (-2 to +2)
    // so the character doesn't disappear.
    const bMin = useMemo(() => new THREE.Vector3(-2, -2, -2), [])
    const bMax = useMemo(() => new THREE.Vector3(2, 2, 2), [])

    const materialRef = useRef()

    useFrame((state, delta) => {
        if (materialRef.current) {
            const range = ANIMATIONS[animationState]
            let currentFrame = materialRef.current.uTime

            // Animation Speed (30 FPS)
            currentFrame += delta * 30

            // Loop Logic
            if (currentFrame > range.end || currentFrame < range.start) {
                currentFrame = range.start
            }

            materialRef.current.uTime = currentFrame
        }
    })

    return (
        <group position={position} dispose={null}>
            <mesh
                geometry={character.geometry}
                rotation={[0, 0, 0]}
                scale={[1, 1, 1]}
                frustumCulled={false} // Always render, even if bounds look weird
            >
                <vATMaterial
                    ref={materialRef}
                    uPosMap={posMap}
                    uNormMap={normMap}
                    uMin={bMin}
                    uMax={bMax}
                    uTotalFrames={211}
                />
            </mesh>
        </group>
    )
}