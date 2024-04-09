import { Box } from '@mui/material'
import SignIn from '../components/SignInComponent'
import { ToolBar } from '../components/Toolbar'
import { useContext, useEffect, useState } from 'react'
import { ShipContext } from '../contexts/ShipContext'

export default function SignInPage(props) {
    const shipContext = useContext(ShipContext)

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
