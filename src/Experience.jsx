import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Player from './Player'


import Lights from './Lights.jsx'
import { Level, TrapAxe, TrapLimbo, TrapSpinner, } from './Level.jsx'

export default function Experience() {
    return <>
        {/* <OrbitControls makeDefault /> */}

        <Physics
            // debug
        >
            <Lights />
            <Level count={5} blockTypes={[TrapSpinner, TrapLimbo, TrapAxe]} />
            <Player />
        </Physics>
    </>
}