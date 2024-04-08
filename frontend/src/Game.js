import { Box } from '@mui/material'
import { Controls } from './Contorls'
import { useEffect } from 'react'
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
