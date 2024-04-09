import { ToolBar } from '../Toolbar'
import { Slide, Box, Grow, Button } from '@mui/material'
import { useContext } from 'react'
import { ShipContext } from '../../contexts/ShipContext'

export function GameMainPage(props) {
    const shipContext = useContext(ShipContext)
    return (
        <>
            <Slide
                direction="down"
                in={true}
            >
                <Box>
                    <ToolBar isLogged={props.isLogged} />
                </Box>
            </Slide>
            <div
                style={{
                    width: '100vw',
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            />

            <Grow in={true}>
                <Button
                    variant="contained"
                    sx={{
                        mt: 5,
                        mx: 20,
                        mb: 5,
                    }}
                    onClick={() => shipContext.setType('port')}
                >
                    START
                </Button>
            </Grow>
        </>
    )
}
