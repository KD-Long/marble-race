
import { useKeyboardControls } from '@react-three/drei'
import { addEffect } from '@react-three/fiber'
import useGame from './stores/useGame.jsx'
import { useRef, useEffect } from 'react'






export default function Interface() {

    // this func is a 'selector' we are telling it what we want back. in this case everything
    // I think the reson we are doing this is we dont have useFrame so we can call a get on each frame to check
    // so instead we get each parameter as a var and then when  the values change  to component needs to be rerendered
    // hence it updates
    const forward = useKeyboardControls((state) => { return state.forward })
    const backward = useKeyboardControls((state) => { return state.backward })
    const left = useKeyboardControls((state) => { return state.left })
    const right = useKeyboardControls((state) => { return state.right })
    const jump = useKeyboardControls((state) => { return state.jump })

    const restart = useGame((state) => { return state.restart })
    const phase = useGame((state) => { return state.phase })

    const startTime = useGame((state) => { return state.startTime })
    
    const timeRef = useRef()

    const restartClick = () => {
        restart()
    }

    // called once after first render
    useEffect(() => {

        // from r3f kinda like useFrame (outside canvas)
        // note we are subscribing at render time meaning we canot reactivly access:
        //       const phase = useGame((state) => { return state.phase }) 
        // from above we need to get value on each frame

        const unSubEffect = addEffect(() => {
            const state = useGame.getState()
            let elapsedTime = 0

            if(state.phase === 'playing')
                elapsedTime = Date.now() - state.startTime
            else if(state.phase === 'ended')
                elapsedTime = state.endTime - state.startTime

            elapsedTime = elapsedTime/1000 
            elapsedTime = elapsedTime.toFixed(2)

            // upate the html text content here (check exists first)
            if(timeRef.current)
                timeRef.current.textContent = elapsedTime

        })

        //dispose this func when comopnent is reloaded other wise multiple funcs will run
        return () => {
            unSubEffect()
        }

    }, [])


    return <>
        <div className='interface'>
            {/* time */}
            <div ref={timeRef} className="time">0.00</div>
            {/* Restart */}
            {/* Conditionally display button when condition is met */}
            {phase === 'ended' ? <div className="restart" onClick={restartClick}>Restart</div> : null}

            {/* Controls */}
            <div className="controls">
                <div className="raw">
                    <div className={`key ${forward ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key ${left ? 'active' : ''}`}></div>
                    <div className={`key ${backward ? 'active' : ''}`}></div>
                    <div className={`key ${right ? 'active' : ''}`}></div>
                </div>
                <div className="raw">
                    <div className={`key large ${jump ? 'active' : ''}`}></div>
                </div>
            </div>
        </div>

    </>

}