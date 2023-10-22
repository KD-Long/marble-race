import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useRef, useEffect,useState } from "react";
import * as THREE from 'three'


export default function Player() {
    const playerRef = useRef()
    const [subscribeKey, getKeys] = useKeyboardControls()
    const {rapier, world} = useRapier()
    const [smoothCameraPosition] = useState(()=>{return new THREE.Vector3(200,200,200)})
    const [smoothCameraTarget] = useState(()=>{return new THREE.Vector3()})


    const jump = () => {
        // we need to raycast to check if ball is close to ground and if it is allowed to jump
        const origin = playerRef.current.translation()
        origin.y -= 0.31 // radius of ball + 0.1 buffer
        const direction = {x:0,y:-1,z:0}

        const ray = new rapier.Ray(origin,direction)
        const hit = world.castRay(ray,10,true)

        // toi is timoe of impact but its actually distance
        if(hit.toi<0.15)
            playerRef.current.applyImpulse({x:0,y:0.5,z:0})
    }
    // one time call when component is rendered (no dependencies)
    useEffect(() => {
        // the point of this is to only jump on change of key from:"not pressed" to "pressed"
        // this function also returns a way to unsbuscribe (in the case of a component hot module replacment)
        const unsub = subscribeKey(
            //selector "i want to listen to"
            (state) => {
                return state.jump
            },
            // when the change/event above happens above call this func
            (value) => {
                if (value)
                    jump()
            })

        // cleanup when //player gets modified hot module replacment (prevents subscribed key functions being called twice)
        return ()=>{
            unsub()
        }

        
    }, [])

    useFrame((state, delta) => {


        const { forward, backward, left, right, jump } = getKeys()

        // when we press multiple keys at once we want to calculate one impulse not apply two seperate ones
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        // need to scale for frame rate so that all framrates have the same force
        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta

        if (forward) {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
        if (backward) {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }
        if (left) {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }
        if (right) {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        playerRef.current.applyImpulse(impulse)
        playerRef.current.applyTorqueImpulse(torque)


        /** 
         * Camera 
         */

        // set position of camera to position of ball + offset
        const bodyPosition = playerRef.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        // set camera lookAt target to position of ball + offset
        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25

        // using lerp to make a smoother camera transition (not jerky)

        smoothCameraPosition.lerp(cameraPosition,7* delta)
        smoothCameraTarget.lerp(cameraTarget,7*delta)

        state.camera.position.copy(smoothCameraPosition)
        state.camera.lookAt(smoothCameraTarget)


    })


    return <>
        <RigidBody
            ref={playerRef}
            position={[0, 1, 0]}
            colliders='ball'
            restitution={0.2}
            friction={1}
            canSleep={false}
            linearDamping={0.5} // this allows the ball to eventally stop moving(kindalike air resistance would work)
            angularDamping={0.5}
        >
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial color='mediumpurple' flatShading />
            </mesh>
        </RigidBody>
    </>
}