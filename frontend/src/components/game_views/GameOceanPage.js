import { useContext, useEffect, useRef, useState } from 'react'
import { ShipContext } from '../../contexts/ShipContext'
import { Grow, Button, Typography } from '@mui/material'

export function GameOceanPage(props) {
    const shipContext = useContext(ShipContext)
    const [lastLeftTime, setLastLeftTime] = useState(null)
    const intervalTimer = useRef(null)
    const timerInterval = useRef(null)

    window.onblur = function () {
        clearInterval(intervalTimer.current)
        intervalTimer.current = null
        if (shipContext.type === 'ocean') setLastLeftTime(Date.now())
    }

    window.onfocus = function () {
        const timeOutsideApp = Date.now() - lastLeftTime
        shipContext.setParams((oldParams) => ({
            ...oldParams,
            instability: Math.min(
                oldParams.instability + timeOutsideApp / 2000,
                10
            ),
        }))
        if (shipContext.instability + timeOutsideApp / 2000 >= 10)
            props.setEndType(2)

        intervalTimer.current = setInterval(
            () =>
                shipContext.setParams((prevParams) => ({
                    ...prevParams,
                    instability:
                        prevParams.instability === 10
                            ? 10
                            : Math.max(prevParams.instability - 0.5, 3),
                })),
            1000
        )
    }

    useEffect(() => {
        if (timerInterval.current === null) {
            timerInterval.current = setInterval(
                () =>
                    props.setTimeLeft((prevTimeLeft) => {
                        if (prevTimeLeft === 0) {
                            clearInterval(timerInterval.current)
                            console.log('setting to success')

                            shipContext.setType('success')

                            return prevTimeLeft
                        }
                        if (prevTimeLeft > 0) {
                            return prevTimeLeft - 1
                        }
                    }),
                1000
            )
        }
        return () => {
            clearInterval(timerInterval.current)
            timerInterval.current = null
        }
    }, [shipContext])

    return (
        <>
            <Grow in={true}>
                <Typography
                    sx={{ mt: 10, ml: 'auto', mr: 'auto' }}
                    variant="h1"
                >
                    {Math.floor(props.timeLeft / 60)
                        .toString()
                        .padStart(2, '0')}
                    :{(props.timeLeft % 60).toString().padStart(2, '0')}
                </Typography>
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
                    sx={{
                        mt: 5,
                        mx: 20,
                        mb: 5,
                    }}
                    onClick={() => {
                        shipContext.setParams((oldParams) => ({
                            ...oldParams,
                            instability: 10,
                        }))
                        props.setEndType(1)
                    }}
                >
                    SINK 💀
                </Button>
            </Grow>
        </>
    )
}
