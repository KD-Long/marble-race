import { create } from 'zustand'
import {subscribeWithSelector} from 'zustand/middleware'

//we are exporting the function create from zustand and parsing a callback function with our game parameters
// this is a state store for managing global state
export default create(subscribeWithSelector((set)=>{
    return {
        blocksCount: 5,
        blockSeed: 0,
        startTime: 0,
        endTime: 0,
    
        
        /* Phase */
            // start method is used to update/set property of phase
        phase: 'ready',
        start: ()=>{
            set((state)=>{
                if(state.phase === 'ready')
                    return {phase: 'playing', startTime: Date.now()}
                return {}
            })
        },
        restart: ()=>{
            set((state)=>{
                if(state.phase === 'playing' || state.phase === 'ended')
                    return {phase: 'ready', blockSeed: Math.random()}
                return {}
            })
        },
        end: ()=>{
            set((state)=>{
                if(state.phase === 'playing')
                    return {phase: 'ended', endTime: Date.now()}
                return {}
            })
        }
    }
}))