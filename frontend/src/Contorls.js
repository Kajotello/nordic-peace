import { Box, Button, Fab, Grow, Slide, Typography } from '@mui/material'
import { ToolBar } from './components/Toolbar'
import { createRef, useContext, useEffect, useRef, useState } from 'react'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Picker from 'react-mobile-picker'
import { ShipContext } from './ShipContext'
import { startJourney } from './api/startJourney'
import { endJourney } from './api/endJourney'
import { getBoats } from './api/getBoats'
import { getFriendBoats } from './api/getFriendBoats'
import { getAllBoats } from './api/getAllBoats'

const selections = {
    minutes: Array.from(Array(120).keys()),
    seconds: Array.from(Array(60).keys()),
}

export function Controls(props) {
    const shipContext = useContext(ShipContext)
    const [lastLeftTime, setLastLeftTime] = useState(null)
    const intervalTimer = useRef(null)
    const timerInterval = useRef(null)
    const [journeyId, setJourneyId] = useState(null)
    const [endType, setEndType] = useState(null)
    const [pickerValue, setPickerValue] = useState({
        minutes: 0,
        seconds: 0,
    })
    const [timeLeft, setTimeLeft] = useState(-1)

    useEffect(() => {
        ;(async () => {
            console.log(await getAllBoats())
            if (props.isLogged) {
                if (shipContext.friendId) {
                    shipContext.setBoats(
                        (await getFriendBoats()).map(({ tier }) => tier)
                    )
                } else {
                    shipContext.setBoats(
                        (await getBoats()).map(({ tier }) => tier)
                    )
                }
            } else {
                shipContext.setBoats(
                    (await getAllBoats()).map(({ tier }) => tier)
                )
            }
        })()
    }, [props.isLogged, shipContext.friendId])

    useEffect(() => {
        if (shipContext.type === 'ocean') {
            if (timerInterval.current === null) {
                timerInterval.current = setInterval(
                    () =>
                        setTimeLeft((prevTimeLeft) => {
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
        } else if (timerInterval.current !== null) {
            clearInterval(timerInterval.current)
            timerInterval.current = null
        }

        return () => {}
    }, [shipContext])

    window.onblur = function () {
        clearInterval(intervalTimer.current)
        intervalTimer.current = null
        if (shipContext.type === 'ocean') setLastLeftTime(Date.now())
    }

    window.onfocus = function () {
        if (shipContext.type === 'ocean') {
            const timeOutsideApp = Date.now() - lastLeftTime
            shipContext.setParams((oldParams) => ({
                ...oldParams,
                instability: Math.min(
                    oldParams.instability + timeOutsideApp / 2000,
                    10
                ),
            }))
        }

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

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%"
        >
            {shipContext.type === 'main' && (
                <Slide
                    direction="down"
                    in={shipContext.type === 'main'}
                >
                    <Box>
                        <ToolBar isLogged={props.isLogged} />
                    </Box>
                </Slide>
            )}
            {shipContext.type === 'port' && (
                <Slide
                    direction="down"
                    in={shipContext.type === 'port'}
                >
                    <Fab
                        size="small"
                        color="primary"
                        onClick={() => shipContext.setType('main')}
                        sx={{ ml: 5, mt: 5 }}
                    >
                        <ArrowUpwardIcon fontSize="small" />
                    </Fab>
                </Slide>
            )}
            {shipContext.type === 'port' && (
                <Box
                    sx={{ width: '32%', ml: 'auto', mr: 'auto', p: 1, mt: 2 }}
                    bgcolor="white"
                    borderRadius="10px"
                >
                    <Typography>Minutes Seconds</Typography>
                    <Picker
                        value={pickerValue}
                        onChange={setPickerValue}
                        height="100"
                    >
                        {Object.keys(selections).map((name) => (
                            <Picker.Column
                                key={name}
                                name={name}
                            >
                                {selections[name].map((option) => (
                                    <Picker.Item
                                        key={option}
                                        value={option}
                                    >
                                        {({ selected }) => (
                                            /* Use the `selected` state ti conditionally style the selected item */
                                            <div
                                                style={{
                                                    fontWeight: selected
                                                        ? 'bold  '
                                                        : 'normal',
                                                    color: selected
                                                        ? 'black'
                                                        : 'grey',
                                                }}
                                            >
                                                {option}
                                            </div>
                                        )}
                                    </Picker.Item>
                                ))}
                            </Picker.Column>
                        ))}
                    </Picker>
                </Box>
            )}
            {shipContext.type === 'ocean' && (
                <Grow in={shipContext.type === 'ocean'}>
                    <Typography
                        sx={{ mt: 10, ml: 'auto', mr: 'auto' }}
                        variant="h1"
                    >
                        {Math.floor(timeLeft / 60)
                            .toString()
                            .padStart(2, '0')}
                        :{(timeLeft % 60).toString().padStart(2, '0')}
                    </Typography>
                </Grow>
            )}
            {shipContext.type === 'failure' && (
                <Grow in={shipContext.type === 'failure'}>
                    <Box sx={{ mt: 5, ml: 'auto', mr: 'auto' }}>
                        <Typography
                            variant="h4"
                            textAlign="center"
                        >
                            Ups.. Your boat sank
                        </Typography>
                        <Typography
                            sx={{ mt: 2 }}
                            variant="h5"
                            textAlign="center"
                        >
                            Don't give up, it will be better next time.
                        </Typography>
                    </Box>
                </Grow>
            )}
            {shipContext.type === 'success' && (
                <Grow in={shipContext.type === 'success'}>
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
            )}
            <div
                style={{
                    width: '100vw',
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {shipContext.type === 'port' && (
                    <Slide
                        direction="right"
                        in={shipContext.type === 'port'}
                    >
                        <Fab
                            color="primary"
                            size="small"
                            onClick={() =>
                                shipContext.setParams((oldParams) => ({
                                    ...oldParams,
                                    boatType: (oldParams.boatType + 4) % 5,
                                }))
                            }
                            sx={{ ml: 5 }}
                        >
                            <KeyboardArrowLeftIcon />
                        </Fab>
                    </Slide>
                )}

                {shipContext.type === 'port' && (
                    <Slide
                        direction="left"
                        in={shipContext.type === 'port'}
                    >
                        <Fab
                            color="primary"
                            size="small"
                            onClick={() =>
                                shipContext.setParams((oldParams) => ({
                                    ...oldParams,
                                    boatType: (oldParams.boatType + 1) % 5,
                                }))
                            }
                            sx={{ mr: 5, ml: 'auto' }}
                        >
                            <KeyboardArrowRightIcon />
                        </Fab>
                    </Slide>
                )}
            </div>
            {shipContext.type === 'main' && (
                <Grow in={shipContext.type === 'main'}>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 5,
                            mx: 20,
                            mb: 5,
                        }}
                        onClick={() => shipContext.setType('port')}
                    >
                        START
                    </Button>
                </Grow>
            )}
            {shipContext.type === 'port' && (
                <Grow in={shipContext.type === 'port'}>
                    <Button
                        variant="contained"
                        sx={{
                            mt: 5,
                            mx: 20,
                            mb: 5,
                        }}
                        onClick={async () => {
                            shipContext.setType('ocean')
                            setJourneyId(
                                (
                                    await startJourney(
                                        pickerValue.minutes * 60 +
                                            pickerValue.seconds,
                                        shipContext.params.boatType
                                    )
                                ).id
                            )
                            setTimeLeft(
                                pickerValue.minutes * 60 + pickerValue.seconds
                            )
                            setEndType(null)
                        }}
                    >
                        GO
                    </Button>
                </Grow>
            )}
            {shipContext.type === 'ocean' && (
                <Grow in={shipContext.type === 'ocean'}>
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
                            setEndType(1)
                        }}
                    >
                        SINK 💀
                    </Button>
                </Grow>
            )}
            {shipContext.type === 'failure' && (
                <Grow in={shipContext.type === 'failure'}>
                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            mt: 5,
                            mx: 20,
                            mb: 5,
                        }}
                        onClick={async () => {
                            await endJourney(journeyId, endType || 2)
                            shipContext.setType('main')
                        }}
                    >
                        BACK TO MAIN MENU
                    </Button>
                </Grow>
            )}
            {shipContext.type === 'success' && (
                <Grow in={shipContext.type === 'success'}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{
                            mt: 5,
                            mx: 20,
                            mb: 5,
                        }}
                        onClick={async () => {
                            await endJourney(journeyId, 0)
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
            )}
        </Box>
    )
}
