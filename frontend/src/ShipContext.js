import React, { useEffect, useMemo, useState } from 'react'
import { useSpring } from '@react-spring/web'
import PoissonDiskSampling from 'poisson-disk-sampling'

export const ShipContext = React.createContext(null)

export function ShipContextProvider(props) {
    const [type, setType] = useState('main')
    const [params, setParams] = useState({
        instability: 3,
        boatType: 0,
    })

    const cameraPosition = {
        main: [0, 0, 0],
        port: [20, 0, 60],
        ocean: [0, 0, 40],
        failure: [0, 0, 40],
        success: [0, 0, 0],
    }[type] || [0, 0, 0]

    const [boats, setBoats] = useState([])

    const cameraZoom = type === 'main' ? 60 - Math.sqrt(boats.length) : 100

    const { smoothInstability } = useSpring({
        smoothInstability: params.instability || 3,
        config: {
            mass: 1,
            friction: 60,
            tension: 50,
        },
    })

    const shipPositions = useMemo(() => {
        const p = new PoissonDiskSampling({
            shape: [200, 200],
            minDistance: 4,
            maxDistance: 100,
            tries: 10,
            distanceFunction: function (point) {
                return Math.abs(point[0] - point[1]) / 1000
            },
            bias: 0,
        })
        p.addPoint([25, 25])
        return p.fill().map(([x, y]) => [x - 25, y - 25])
    }, [])

    const mainBoatPosition = {
        port: [20, 60],
        ocean: [0, 40],
        success: shipPositions[boats.length],
    }[type]

    const [friendId, setFriendId] = useState(null)

    return (
        <ShipContext.Provider
            value={{
                type,
                setType,
                params,
                setParams,
                cameraPosition,
                cameraZoom,
                boats,
                setBoats,
                instability: smoothInstability,
                shipPositions,
                mainBoatPosition,
                friendId,
                setFriendId,
            }}
        >
            {props.children}
        </ShipContext.Provider>
    )
}
