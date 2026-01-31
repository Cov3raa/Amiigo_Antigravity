import React, { Suspense, useRef, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import VATCharacter from './components/VATCharacter'

function App() {
    const [anim, setAnim] = useState('walk')

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#111' }}>

            {/* UI Overlay */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <button
                    onClick={() => setAnim(anim === 'walk' ? 'idle' : 'walk')}
                    style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                    Current Animation: {anim.toUpperCase()}
                </button>
            </div>

            <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5}>
                        {/* We pass the 'anim' state down to the character */}
                        <VATCharacter position={[0, 0, 0]} animationState={anim} />

                        {/* If you wanted to keep the static wireframe one next to it: */}
                        {/* <VATCharacter position={[2, 0, 0]} animationState="idle" /> */}
                    </Stage>
                </Suspense>
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    )
}

export default App