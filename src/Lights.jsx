import { useRef } from "react"
import {useFrame} from '@react-three/fiber'


export default function Lights() {
    const lightRef = useRef()

    useFrame((state)=>{
        // +1 makes it light the ball better -8 is to position such that the shadow is all in front and not underutilised behind screen
        lightRef.current.position.z = state.camera.position.z +1 -8
        lightRef.current.target.position.z =  state.camera.position.z -8
        // Three js only updates the 'matrix' when an objects rotation-scale-position changes in this case 'target' is not in the scene so we need to manually tell threejs to update its matrix
        lightRef.current.target.updateMatrixWorld()

    })

    return <>
        <directionalLight
            ref={lightRef}
            castShadow
            position={[4, 4, 1]}
            intensity={1.5}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={10}
            shadow-camera-top={10}
            shadow-camera-right={10}
            shadow-camera-bottom={- 10}
            shadow-camera-left={- 10}
        />
        <ambientLight intensity={0.5} />
    </>
}