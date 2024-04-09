import { getBoats } from '../api/getBoats'
import { getFriendBoats } from '../api/getFriendBoats'
import { getAllBoats } from '../api/getAllBoats'
import { Box } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ShipContext } from '../contexts/ShipContext'
import { GameMainPage } from '../components/game_views/GameMainPage'
import { GamePortPage } from '../components/game_views/GamePortPage'
import { GameOceanPage } from '../components/game_views/GameOceanPage'
import { GameSuccessPage } from '../components/game_views/GameSuccessPage'
import { GameFailurePage } from '../components/game_views/GameFailurePage'

function Game(props) {
    const shipContext = useContext(ShipContext)
    const [failureEndType, setFailureEndType] = useState(1)
    const [timeLeft, setTimeLeft] = useState(-1)
    const [journeyId, setJourneyId] = useState(null)

    const navigate = useNavigate()
    useEffect(() => {
        if (!props.isLogged) navigate('/')
    }, [])

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

    return (
        <div>
            <Box
                position="absolute"
                top="0px"
                width="100%"
                height="100vh"
                display="flex"
                flexDirection="column"
            >
                {
                    {
                        main: <GameMainPage />,
                        port: <GamePortPage setTimeLeft={setTimeLeft} />,
                        ocean: (
                            <GameOceanPage
                                setTimeLeft={setTimeLeft}
                                setEndType={setFailureEndType}
                                timeLeft={timeLeft}
                            />
                        ),
                        success: (
                            <GameSuccessPage
                                journeyId={journeyId}
                                setJourneyId={setJourneyId}
                            />
                        ),
                        failure: (
                            <GameFailurePage
                                failureType={failureEndType}
                                journeyId={journeyId}
                            />
                        ),
                    }[shipContext.type]
                }
            </Box>
        </div>
    )
}

export default Game
