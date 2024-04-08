import { Box, Typography } from '@mui/material'
import { ToolBar } from './components/Toolbar'

import { useEffect, useContext, useState } from 'react'
import { ShipContext } from './ShipContext'
import { getBoats } from './api/getBoats'
import { getFriendBoats } from './api/getFriendBoats'
import { getAllBoats } from './api/getAllBoats'

export function MainPage(props) {
    const shipContext = useContext(ShipContext)
    useEffect(() => {
        ;(async () => {
            shipContext.setBoats((await getAllBoats()).map(({ tier }) => tier))
        })()
    }, [])

    return (
        <div>
            <Box
                position="absolute"
                top="0px"
                height="100vh"
                width="100%"
                display="flex"
                flexDirection="column"
            >
                <ToolBar
                    isLogged={props.isLogged}
                    width="100%"
                />
                <Typography
                    alignItems="center"
                    textAlign="center"
                    sx={{ mx: 'auto', mt: 10 }}
                    variant="h3"
                >
                    Start your journey to peace with us
                </Typography>
            </Box>
        </div>
    )
}
