import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import Player from './Player'
import useGame from './stores/useGame.jsx'


import Lights from './Lights.jsx'
import { Level, TrapAxe, TrapLimbo, TrapSpinner, } from './Level.jsx'

export default function Experience() {
    //another selector call back to get specific value from global state store
    const blockCount = useGame((state) => { return state.blocksCount })
    const blockSeed = useGame((state) => { return state.blockSeed })

    return <>
        {/* <OrbitControls makeDefault /> */}
        <color args={['#bdedfc']} attach='background' />
        <Physics
        // debug
        >
            <Lights />
            <Level count={blockCount} blockSeed={blockSeed} />
            <Player />
        </Physics>
    </>
}