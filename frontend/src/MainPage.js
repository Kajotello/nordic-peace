import { Box, Typography } from '@mui/material'
import { ToolBar } from './components/Toolbar'

export function MainPage(props) {
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
