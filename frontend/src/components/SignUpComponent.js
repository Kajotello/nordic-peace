import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createUser } from '../api/createUser'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { verifyUser } from '../api/verifyUser'
import Cookie from 'js-cookie'

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignUp(props) {
    const navigate = useNavigate()
    const [emptyInput, setEmptyInput] = useState(false)
    const [duplicatedUsername, setDuplicatedUsername] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        if (
            data.get('username').length === 0 ||
            data.get('password').length === 0
        )
            setEmptyInput(true)
        else {
            await createUser(data)
                .then((res) => {
                    console.log(res.jwt)
                    Cookie.set('token', res.jwt)
                })
                .catch((error) => {
                    setDuplicatedUsername(true)
                })
            await verifyUser()
                .then((res) => {
                    const userData = res.json()
                    props.setUserData(userData)
                })
                .catch((error) => {})
        }
    }

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'white',
                    p: 2,
                    borderRadius: 8,
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography
                    component="h1"
                    variant="h5"
                >
                    Sign up
                </Typography>
                {emptyInput && (
                    <Typography sx={{ color: 'red' }}>
                        Username and password cannot be empty
                    </Typography>
                )}
                {duplicatedUsername && (
                    <Typography sx={{ color: 'red' }}>
                        Username already exist
                    </Typography>
                )}
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ mt: 3 }}
                >
                    <TextField
                        required
                        fullWidth
                        id="username"
                        marginBottom
                        label="Username"
                        name="username"
                        autoComplete="username"
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        sx={{ mb: 3 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid
                        container
                        justifyContent="flex-end"
                    >
                        <Grid item>
                            <Link
                                href="sign-in"
                                variant="body2"
                            >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    )
}
