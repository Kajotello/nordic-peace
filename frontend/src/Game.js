import logo from './logo.svg'
import { ToolBar } from './components/Toolbar'
import { Background } from './Backgrounnd'
import { Box, Button } from '@mui/material'
import { Controls } from './Contorls'
import { useContext, useEffect, useState } from 'react'
import { ShipContext } from './ShipContext'
import { useNavigate } from 'react-router'

function Game(props) {
    const navigate = useNavigate()
    useEffect(() => {
        if (!props.isLogged) navigate('/')
    }, [])

    return (
        <div>
            <Box
                position="absolute"
                top="0px"
                height="100vh"
            >
                <Controls
                    token={props.token}
                    isLogged={props.isLogged}
                />
            </Box>
        </div>
    )
}

export default Game
