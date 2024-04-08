import React, { useContext, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import { Avatar, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import { useNavigate } from 'react-router'
import { ShipContext } from '../ShipContext'

export function ToolBar(props) {
    const navigate = useNavigate()

    const [anchorElNav, setAnchorElNav] = useState(null)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    const shipContext = useContext(ShipContext)

    const SUBPAGES = [
        {
            name: 'Profile',
            path: '/profile',
        },
        {
            name: 'Friends',
            path: '/friends',
        },
    ]

    // const navigate = useNavigate();

    return (
        <div>
            <AppBar
                sx={{
                    mb: 0,
                    opacity: 0.7,
                    position: 'static',
                }}
            >
                <Toolbar>
                    <Box>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            {SUBPAGES.map((data) => (
                                <MenuItem
                                    key={data.name}
                                    onClick={() => {
                                        navigate(data.path)
                                        window.scrollTo(0, 0)
                                        handleCloseNavMenu()
                                    }}
                                >
                                    <Typography textAlign="center">
                                        {data.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box
                        component="img"
                        src="viking-helmet.png"
                        sx={{
                            ml: 5,
                            mr: 2,
                            height: '5vh',
                        }}
                        onClick={() => {
                            navigate('/app')
                        }}
                    ></Box>
                    <Typography>NORDIC PEACE</Typography>
                    {props.isLogged ? (
                        <Avatar
                            sx={{ ml: 'auto' }}
                            alt="Remy Sharp"
                            src="/static/images/avatar/1.jpg"
                            onClick={() => navigate('/profile')}
                        />
                    ) : (
                        <Button
                            sx={{ ml: 'auto', opacity: 1 }}
                            variant="contained"
                            onClick={() => navigate('/sign-in')}
                        >
                            Sign in
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    )
}
