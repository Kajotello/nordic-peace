import { Box } from '@mui/material'
import SignIn from './SignIn'
import { ToolBar } from './components/Toolbar'
import { useContext, useEffect, useState } from 'react'
import { ShipContext } from './ShipContext'

export default function SignInPage(props) {
    const shipContext = useContext(ShipContext)

    useEffect(() => {
        shipContext.setType('empty')
    }, [])

    return (
        <div>
            <Box
                position="absolute"
                top="0px"
                width="100%"
                display="flex"
                flexDirection="column"
            >
                <ToolBar isLogged={props.isLogged} />

                <SignIn
                    isLogged={props.isLogged}
                    setUserData={props.setUserData}
                    setToken={props.setToken}
                />
            </Box>
        </div>
    )
}
