import { RigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useState, useRef, useMemo } from 'react'
import { useGLTF, Float, Text } from '@react-three/drei'

//optimisation to have just on box geometry for all box objects and just scale it for different uses
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'yellowgreen' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

export function Floor({ material }) {

    return <>
        <group >
            <RigidBody
                type='fixed'
                restitution={0.2}
                friction={1}
            >
                <mesh
                    receiveShadow
                    position={[0, -0.1, 0]}
                    geometry={boxGeometry}
                    material={material}
                    scale={[4, 0.2, 4]}
                />
            </RigidBody>
        </group>
    </>
}


export function BlockStart({ position = [0, 0, 0] }) {
    // destructures the position from prop setting it to [0,0,0] by default
    return <>
        {/* Floor */}
        <group position={position}>
            <Floor material={floor1Material} />
            <Float
                floatIntensity={0.25}
                rotationIntensity={0.25}
            >
                <Text
                    font='/bebas-neue-v9-latin-regular.woff'
                    scale={0.5}
                    maxWidth={0.25}
                    lineHeight={0.75}
                    textAlign='right'
                    position={[0.75, 0.65, 0]}
                    rotation-y={-0.25}
                >
                    Marble Race
                    <meshBasicMaterial toneMapped={false} />
                </Text>
            </Float>
        </group>
    </>
}

export function BlockEnd({ position = [0, 0, 0] }) {
    // destructures the position from prop setting it to [0,0,0] by default
    const ham = useGLTF('./hamburger.glb')

    // apply shadows on each mesh of our model
    // - note we cant just apply to cast shadow on primitive
    ham.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })

    return <>
        {/* Floor */}
        <group position={[position[0], position[1] + 0.1, position[2],]}>
            <Text
                font='/bebas-neue-v9-latin-regular.woff'
                scale={1}
                position={[0,1.25,2]}
            >
                FINISH
                <meshBasicMaterial toneMapped={false} />
            </Text>


            <Floor material={floor1Material} />

            <RigidBody
                type='fixed'
                colliders='hull'
                position={[0, 0.25, 0]}
                restitution={0.2}
                friction={0}
            >
                <primitive object={ham.scene} scale={0.1} />
            </RigidBody>


        </group>
    </>
}

export function TrapSpinner({ position = [0, 0, 0] }) {

    const twisterRef = useRef()

    // creates a random value for spinner speed once (does not change when component is rerendered)
    // '*(Math.random()<0.5 ? -1 : 1)})' this part sets direction randomly
    const [speed] = useState(() => {

        return (Math.random() + 1) * (Math.random() < 0.5 ? -1 : 1)
    })

    useFrame((state) => {
        const elapsedTime = state.clock.elapsedTime

        //euler rotaion
        const euler = new THREE.Euler(0, -elapsedTime * speed, 0)
        const quarternion = new THREE.Quaternion()
        quarternion.setFromEuler(euler)
        twisterRef.current.setNextKinematicRotation(quarternion) //needs quarternion

    })

    return <>
        {/* Floor */}
        <group position={position}>
            <Floor material={floor2Material} />
            {/* Twister */}
            <RigidBody
                type='kinematicPosition'
                ref={twisterRef}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    castShadow
                    receiveShadow
                    position={[0, 0.1, 0]}
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[4, 0.2, 0.2]}
                />
            </RigidBody>

        </group>
    </>
}

export function TrapLimbo({ position = [0, 0, 0] }) {

    const limboRef = useRef()

    // creates a random value for spinner speed once (does not change when component is rerendered)
    // '*(Math.random()<0.5 ? -1 : 1)})' this part sets direction randomly
    const [speed] = useState(() => { return (Math.random() + 1) * (Math.random() < 0.5 ? -1 : 1) })

    // offset to make each limbo start from a different sin pos
    const [offset] = useState(() => { return Math.random() * Math.PI * 2 })

    useFrame((state) => {
        const elapsedTime = state.clock.elapsedTime

        // up and down
        const angle = elapsedTime * speed
        const y = Math.sin(angle + offset) + 1.1 // 0.2 is thickness of bar/2
        // note these are absolute. we need to add to existing xyz position
        limboRef.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })

    })

    return <>
        {/* Floor */}
        <group position={position}>
            <Floor material={floor2Material} />
            {/* limbo */}
            <RigidBody
                type='kinematicPosition'
                ref={limboRef}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    castShadow
                    receiveShadow
                    position={[0, 0, 0]}
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[4, 0.2, 0.2]}
                />
            </RigidBody>

        </group>
    </>
}

export function TrapAxe({ position = [0, 0, 0] }) {

    const AxeRef = useRef()

    // creates a random value for spinner speed once (does not change when component is rerendered)
    // '*(Math.random()<0.5 ? -1 : 1)})' this part sets direction randomly
    const [speed] = useState(() => { return (Math.random() + 1) * (Math.random() < 0.5 ? -1 : 1) })

    // offset to make each limbo start from a different sin pos
    const [offset] = useState(() => { return Math.random() * Math.PI * 2 })

    useFrame((state) => {
        const elapsedTime = state.clock.elapsedTime

        // up and down
        const angle = elapsedTime * speed
        const x = Math.sin(angle + offset) * 2 // *2 is diameter/amplitude of swing
        // note these are absolute. we need to add to existing xyz position
        AxeRef.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.5, z: position[2] })

    })

    return <>
        {/* Floor */}
        <group position={position}>
            <Floor material={floor2Material} />
            {/* limbo */}
            <RigidBody
                type='kinematicPosition'
                ref={AxeRef}
                restitution={0.2}
                friction={0}
            >
                <mesh
                    castShadow
                    receiveShadow
                    position={[0, 0, 0]}
                    geometry={boxGeometry}
                    material={obstacleMaterial}
                    scale={[2, 1, 0.2]}
                />
            </RigidBody>

        </group>
    </>
}

export function Bounds({ length = 1 }) {
    const wallLength = (length) * 4
    return <>

        <RigidBody
            type='fixed'
            restitution={0.2}
            friction={0}
        >
            {/* Right wall */}
            <mesh
                castShadow
                receiveShadow
                position={[2.1, .5, -(wallLength - 4) / 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.2, 1, wallLength]}
            />
            {/* Left wall */}
            <mesh
                // castShadow
                receiveShadow
                position={[-2.1, .5, -(wallLength - 4) / 2]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[0.2, 1, wallLength]}
            />
            {/* Back wall */}
            <mesh
                receiveShadow
                position={[0, 0.5, -(wallLength - 2)]}
                geometry={boxGeometry}
                material={wallMaterial}
                scale={[4.4, 1, 0.2]}
            />
        </RigidBody>

    </>

}

export function Level({ count = 5, blockTypes = [TrapSpinner, TrapLimbo, TrapAxe], blockSeed = 0 }) {
    // defaults from props
    // const count =5
    // const blockTypes = [TrapSpinner,TrapLimbo,TrapAxe]

    const blocks = useMemo(() => {
        const myBlocks = []
        // for number of blocks 'count' push a random block type onto array
        for (let i = 0; i < count; i++) {
            const randomTypeSelect = Math.floor(Math.random() * blockTypes.length) //values from 0->block length
            const type = blockTypes[randomTypeSelect]
            myBlocks.push(type)
        }
        return myBlocks

    }, [count, blockTypes, blockSeed])



    return <>
        {/* Block component represents a type of block such as [TrapSpinner, TrapLimbo, TrapAxe] this means we can pass the props in block the same way we would on these vlock types*/}
        <BlockStart position={[0, 0, 0]} />
        {blocks.map((Block, index) => {
            return <Block key={index} position={[0, 0, (index + 1) * -4]} />
        })}
        <BlockEnd position={[0, 0, (count + 1) * -4]} />


        <Bounds length={count + 2} />

        {/* <TrapSpinner position={[0, 0, 8]} />
        <TrapSpinner position={[0, 0, 4]} />
        <TrapSpinner position={[0, 0, 0]} /> */}
        {/* <TrapLimbo position={[0, 0, 8]} /> */}
        {/* <TrapAxe position={[0, 0, 4]} /> */}
        {/* <BlockEnd position={[0, 0, 0]} /> */}




    </>

}