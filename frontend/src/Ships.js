import * as THREE from 'three'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import useMeasure from 'react-use-measure'
import { createNoise3D } from 'simplex-noise'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { useSpring } from '@react-spring/web'
import { ShipContext } from './ShipContext'

const noise = createNoise3D()
const swingNoise = createNoise3D()
const boatColorMap = ['peru', 'darkgray', 'dimgray', 'goldenrod', 'deepskyblue']

const WaterChunk = (props) => {
    const [time, setTime] = useState(0)
    const [geometry, setGeometry] = useState(() => {
        return new THREE.PlaneGeometry(
            props.size,
            props.size,
            props.resolution,
            props.resolution
        )
    })

    useFrame(({ clock }) => {
        setTime(clock.getElapsedTime() / 3)
    })

    useMemo(() => {
        const position = geometry.getAttribute('position')

        for (let i = 0; i < position.count; i++) {
            let x = position.getX(i)
            let y = position.getY(i)
            let z = position.getZ(i)

            z =
                noise(
                    (x +
                        Math.floor(
                            props.pos[0] - props.offset[0] / props.size
                        ) *
                            props.size) *
                        props.scale,
                    (y +
                        Math.floor(
                            -props.pos[1] + props.offset[1] / props.size
                        ) *
                            props.size) *
                        props.scale,
                    time
                ) * props.height

            position.setXYZ(i, x, y, z)
            position.needsUpdate = true
        }
    }, [time, geometry, props])

    return (
        <mesh
            geometry={geometry}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[
                (props.offset[0] % props.size) + props.pos[0] * props.size,
                0,
                (props.offset[1] % props.size) + props.pos[1] * props.size,
            ]}
            receiveShadow={true}
        >
            <meshStandardMaterial
                color={'steelblue'}
                flatShading={true}
            />
        </mesh>
    )
}

const Water = (props) => {
    const size = 8
    const resolution = 16
    const scale = 1
    const height = 0.1

    const gridSize = 7

    const state = useThree()

    const [chunks, setChunks] = useState([])
    const [waterOffset, setWaterOffset] = useState([0, 0])
    const shipContext = useContext(ShipContext)

    const failTimeout = useRef(null)

    useFrame(() => {
        const offset = [
            Math.round((state.camera.position.x - 100) / size),
            Math.round((state.camera.position.z - 100) / size),
        ]

        const result = []
        for (let x = -gridSize; x <= gridSize; x++) {
            for (let y = -gridSize; y <= gridSize; y++) {
                result.push([x + offset[0], y + offset[1]])
            }
        }

        setChunks(result)
        if (['main', 'ocean'].indexOf(shipContext.type) !== -1) {
            setWaterOffset((waterOffset) => [
                waterOffset[0],
                waterOffset[1] + 0.02,
            ])
        }

        if (
            failTimeout.current === null &&
            shipContext.instability.get() === 10
        ) {
            failTimeout.current = setTimeout(() => {
                shipContext.setType('failure')
                shipContext.setParams((oldParams) => ({
                    ...oldParams,
                    instability: 3,
                }))

                failTimeout.current = null
            }, 2000)
        }
    }, [])

    return (
        <>
            {chunks.map(([x, y]) => (
                <WaterChunk
                    key={`${x},${y}`}
                    pos={[x, y]}
                    offset={waterOffset}
                    size={size}
                    resolution={resolution}
                    scale={scale}
                    height={height * shipContext.instability.get()}
                />
            ))}
        </>
    )
}

const Camera = (props) => {
    const ratio = props.bounds.height / props.bounds.width
    const frustum = 800
    const horizonal = ratio < 1 ? frustum / ratio : frustum
    const vertical = ratio < 1 ? frustum : frustum * ratio

    const shipContext = useContext(ShipContext)

    const { x, y, z, zoom } = useSpring({
        x: shipContext.cameraPosition[0] + 100,
        y: shipContext.cameraPosition[1] + 82,
        z: shipContext.cameraPosition[2] + 100,
        zoom: shipContext.cameraZoom,
        config: {
            mass: 1,
            friction: 50,
            tension: 60,
        },
    })

    const { camera } = useThree()

    /*
    useEffect(() => {
        setInterval(() => setMove((move) => !move), 2000)
    }, [])
    */

    useFrame(() => {
        camera.position.setX(x.get())
        camera.position.setY(y.get())
        camera.position.setZ(z.get())
        camera.zoom = zoom.get()
        camera.updateProjectionMatrix()
    })

    return (
        <OrthographicCamera
            makeDefault
            top={vertical}
            bottom={-vertical}
            left={-horizonal}
            right={horizonal}
            near={0.1}
            far={2000}
            rotation={new THREE.Euler(-Math.PI / 6, Math.PI / 4, 0, 'YXZ')}
        />
    )
}

const Boat = (props) => {
    const geometry = useLoader(STLLoader, '/assets/low poly benchy.stl')
    const wakeTexture = useLoader(THREE.TextureLoader, '/assets/wake.png')

    const [swing, setSwing] = useState([0, 0])
    const shipContext = useContext(ShipContext)

    const spring = useSpring({
        x: props.position[0],
        y: -0.2,
        z: props.position[1],
        config: {
            mass: 1,
            friction: 70,
            tension: 60,
        },
    })

    useFrame(({ clock }) => {
        setSwing([
            (shipContext.instability.get() *
                (Math.PI *
                    (swingNoise(
                        props.position[0],
                        props.position[1] + 3,
                        clock.getElapsedTime() / 3
                    ) -
                        0.5))) /
                50,
            (shipContext.instability.get() *
                (Math.PI *
                    (swingNoise(
                        props.position[0] + 3,
                        props.position[1],
                        clock.getElapsedTime() / 3
                    ) -
                        0.5))) /
                50,
        ])
    })

    const boatPosition = [spring.x.get(), spring.y.get(), spring.z.get()]

    return (
        <>
            <mesh
                geometry={geometry}
                scale={0.05}
                rotation={[-Math.PI / 2 + swing[0], swing[1], Math.PI / 2]}
                position={boatPosition}
                castShadow={true}
                receiveShadow={true}
            >
                <meshPhongMaterial
                    color={props.color}
                    flatShading={true}
                />
            </mesh>
        </>
    )
}

const BoatFleet = (props) => {
    const shipContext = useContext(ShipContext)

    const boats = useMemo(() => {
        const result = []
        let i = 0
        for (const type of props.boats) {
            result.push({
                type,
                pos: shipContext.shipPositions[i],
                index: i,
            })
            i += 1
        }

        return result
    }, [props.boats, shipContext.shipPositions])

    return (
        <>
            {boats.map(({ type, pos, index }) => (
                <Boat
                    key={`${index}`}
                    color={boatColorMap[type]}
                    position={pos}
                />
            ))}
        </>
    )
}

function ShipBackground() {
    const [ref, bounds] = useMeasure()
    const shipContext = useContext(ShipContext)

    const type = shipContext.type

    return (
        <Canvas
            style={{
                height: '100vh',
            }}
            ref={ref}
            shadows={true}
        >
            <ambientLight intensity={Math.PI / 3} />
            <directionalLight
                intensity={1}
                position={[1, 0.5, 1]}
            />
            <directionalLight
                intensity={1}
                position={[-1, 2, 1]}
                castShadow={true}
            />

            <Water />

            {shipContext.mainBoatPosition && (
                <Boat
                    color={boatColorMap[shipContext.params.boatType]}
                    position={shipContext.mainBoatPosition}
                />
            )}

            {['ocean', 'empty'].indexOf(type) === -1 && (
                <BoatFleet boats={shipContext.boats} />
            )}

            <Camera bounds={bounds} />
        </Canvas>
    )
}

export default ShipBackground
