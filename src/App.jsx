import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import VATCharacter from './components/VATCharacter'

function App() {
    return (
        <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
            <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5}>
                        {/* Load one instance of the character to start */}
                        <VATCharacter position={[0, 0, 0]} />
                    </Stage>
                </Suspense>
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    )
}

export default App