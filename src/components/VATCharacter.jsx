import React from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function VATCharacter(props) {
    // Load the GLB model 
    // The 'Character.001_vat' node contains the mesh 
    const { nodes } = useGLTF('/assets/character.glb')

    // Assign the complex node name to a simple variable
    const character = nodes["Character.001_vat"]

    // Load your textures (Position and Normal)
    const posMap = useTexture('/assets/character.png')
    const normMap = useTexture('/assets/character_vrnm.png')

    // CRITICAL: Set texture filters to Nearest to avoid JPEG/Linear interpolation 
    // which ruins VAT data integrity.
    posMap.minFilter = posMap.magFilter = THREE.NearestFilter
    normMap.minFilter = normMap.magFilter = THREE.NearestFilter
    posMap.flipY = false
    normMap.flipY = false

    return (
        <group {...props} dispose={null}>
            <mesh
                geometry={character.geometry}
                scale={[10, 10, 10]} // Scaling up as the min/max bounds are small
            >
                <meshStandardMaterial color="gray" wireframe />
            </mesh>
        </group >
    )
}

// Preload assets for better performance
useGLTF.preload('/assets/character.glb')