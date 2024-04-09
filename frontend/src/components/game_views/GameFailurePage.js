import { Box, Grow, Button, Typography } from '@mui/material'
import { ShipContext } from '../../contexts/ShipContext'
import { useContext } from 'react'
import { endJourney } from '../../api/endJourney'

export function GameFailurePage(props) {
    const shipContext = useContext(ShipContext)
    return (
        <>
            <Grow in={true}>
                <Box sx={{ mt: 5, ml: 'auto', mr: 'auto' }}>
                    <Typography
                        variant="h4"
                        textAlign="center"
                    >
                        Ups.. Your boat sank
                    </Typography>
                    <Typography
                        sx={{ mt: 2 }}
                        variant="h5"
                        textAlign="center"
                    >
                        Don't give up, it will be better next time.
                    </Typography>
                </Box>
            </Grow>
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
                    color="error"
                    sx={{
                        mt: 5,
                        mx: 20,
                        mb: 5,
                    }}
                    onClick={async () => {
                        await endJourney(props.journeyId, props.failureEndType)
                        shipContext.setType('main')
                    }}
                >
                    BACK TO MAIN MENU
                </Button>
            </Grow>
        </>
    )
}
