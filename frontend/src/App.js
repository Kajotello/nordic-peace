import React, { useEffect, useState } from 'react'
import './index.css'
import Game from './layouts/Game'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Friends } from './layouts/Friends'
import { Box } from '@mui/material'
import Profile from './layouts/Profile'
import SignInPage from './layouts/SignInPage'
import SignUpPage from './layouts/SignUpPage'
import ShipBackground from './components/Ships'
import { ShipContextProvider } from './contexts/ShipContext'
import { verifyUser } from './api/verifyUser'
import Cookie from 'js-cookie'
import { amber } from '@mui/material/colors'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MainPage } from './layouts/MainPage'
import Protected from './components/Protected'

export default function App() {
    const fetchData = async () => {
        await verifyUser()
            .then((res) => {
                console.log(res)
                const userData = res.data
                setUserData(userData)
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    Cookie.remove('token', { path: '/' })
                }
            })
        setIsLoading(false)
    }
    useEffect(() => {
        fetchData()
    }, [])

    const [isLoading, setIsLoading] = useState(true)
    const [userDataState, setUserData] = useState(null)

    const theme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: amber[700],
            },
            secondary: {
                main: '#f50057',
            },
        },
    })

    const router = createBrowserRouter([
        {
            path: '/',
            element: <MainPage isLogged={userDataState !== null} />,
        },
        {
            path: '/app',
            element: (
                <Protected
                    condition={userDataState !== null}
                    redirectTo="/"
                >
                    <Game isLogged={userDataState !== null} />
                </Protected>
            ),
        },
        {
            path: '/profile',
            element: (
                <Protected
                    condition={userDataState !== null}
                    redirectTo="/"
                >
                    <Profile
                        userData={userDataState}
                        isLogged={userDataState !== null}
                        logOut={() => {
                            Cookie.remove('token', { path: '/' })
                            setUserData(null)
                        }}
                        setUserData={setUserData}
                    />
                </Protected>
            ),
        },
        {
            path: '/friends',
            element: (
                <Protected
                    condition={userDataState !== null}
                    redirectTo="/"
                >
                    <Friends isLogged={userDataState !== null} />
                </Protected>
            ),
        },
        {
            path: '/sign-in',
            element: (
                <Protected
                    condition={userDataState === null}
                    redirectTo="profile"
                >
                    <SignInPage
                        isLogged={userDataState !== null}
                        setUserData={setUserData}
                    />
                </Protected>
            ),
        },
        {
            path: '/sign-up',
            element: (
                <Protected
                    condition={userDataState === null}
                    redirectTo="profile"
                >
                    <SignUpPage
                        setUserData={setUserData}
                        isLogged={userDataState !== null}
                    />
                </Protected>
            ),
        },
    ])

    return (
        <div>
            {!isLoading && (
                <ThemeProvider theme={theme}>
                    <ShipContextProvider>
                        <Box
                            maxWidth
                            sx={{
                                minHeight: '100vh',
                                zIndex: 0,
                            }}
                        >
                            <ShipBackground />
                        </Box>
                        <RouterProvider router={router} />
                    </ShipContextProvider>
                </ThemeProvider>
            )}
        </div>
    )
}
