import { Box } from '@mui/material'
import SignUp from './SignUp'
import { ToolBar } from './components/Toolbar'
import { useContext, useEffect, useState } from 'react'
import { ShipContext } from './ShipContext'

export default function SignUpPage(props) {
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
                <SignUp
                    isLogged={props.isLogged}
                    setUserData={props.setUserData}
                />
            </Box>
        </div>
    )
}
