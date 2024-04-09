import { Box, Grow, Button, Typography } from '@mui/material'
import { useContext } from 'react'
import { ShipContext } from '../../contexts/ShipContext'
import { endJourney } from '../../api/endJourney'

export function GameSuccessPage(props) {
    const shipContext = useContext(ShipContext)
    return (
        <>
            <Grow in={true}>
                <Box sx={{ mt: 5, ml: 'auto', mr: 'auto' }}>
                    <Typography
                        variant="h4"
                        textAlign="center"
                    >
                        Well done! You expanded your fleet!
                    </Typography>
                    <Typography
                        sx={{ mt: 2 }}
                        variant="h5"
                        textAlign="center"
                    >
                        Keep going and make it stronger!!
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
                    color="success"
                    sx={{
                        mt: 5,
                        mx: 20,
                        mb: 5,
                    }}
                    onClick={async () => {
                        await endJourney(props.journeyId, 0)
                        shipContext.setType('main')
                        shipContext.setBoats((boats) => [
                            ...boats,
                            shipContext.params.boatType,
                        ])
                    }}
                >
                    BACK TO MAIN MENU
                </Button>
            </Grow>
        </>
    )
}
