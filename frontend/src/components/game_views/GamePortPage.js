import { Slide, Box, Grow, Button, Fab, Typography } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Picker from 'react-mobile-picker'
import { useContext, useState } from 'react'
import { ShipContext } from '../../contexts/ShipContext'
import { startJourney } from '../../api/startJourney'

export function GamePortPage(props) {
    const shipContext = useContext(ShipContext)
    const [journeyId, setJourneyId] = useState(null)
    const [endType, setEndType] = useState(null)
    const [pickerValue, setPickerValue] = useState({
        minutes: 0,
        seconds: 0,
    })

    const selections = {
        minutes: Array.from(Array(120).keys()),
        seconds: Array.from(Array(60).keys()),
    }

    return (
        <>
            <Slide
                direction="down"
                in={true}
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

            <div
                style={{
                    width: '100vw',
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Slide
                    direction="right"
                    in={true}
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

                <Slide
                    direction="left"
                    in={true}
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
            </div>
            <Grow in={true}>
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
                        props.setTimeLeft(
                            pickerValue.minutes * 60 + pickerValue.seconds
                        )
                        setEndType(null)
                    }}
                >
                    GO
                </Button>
            </Grow>
        </>
    )
}
