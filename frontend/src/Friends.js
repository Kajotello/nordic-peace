import {
    Box,
    Button,
    Fab,
    Grow,
    Slide,
    TextField,
    Typography,
} from '@mui/material'
import { ToolBar } from './components/Toolbar'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useContext, useState } from 'react'
import { ShipContext } from './ShipContext'
import { useNavigate } from 'react-router'
import { getFollowed } from './api/loadFriends'
import { addFriend } from './api/addFriend'
import { getBoats } from './api/getBoats'
import { getFriendBoats } from './api/getFriendBoats'
import { getAllBoats } from './api/getAllBoats'

const columns = [
    {
        field: 'nick',
        headerName: 'Name',
        width: 150,
        editable: false,
        hideable: false,
    },
    {
        field: 'experience',
        headerName: 'Ex',
        width: 90,
        editable: false,
        hideable: false,
    },
    {
        width: 70,
        editable: false,
        sortable: false,
        hideable: false,
        filterable: false,
        renderCell: (params) => {
            return <Button onClick={params.row.onClick}>Visit</Button>
        },
    },
]

export function Friends(props) {
    const shipContext = useContext(ShipContext)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const friend = new FormData(event.currentTarget)
        console.log(friend)
        const addedFriend = await addFriend(friend.get('username'))
        if (addedFriend.hasOwnProperty('followed_user_id')) {
            setIsAddingFriend(false)
        } else {
            setIsUserNotFound(true)
        }
    }

    useEffect(() => {
        ;(async () => {
            console.log(await getAllBoats())
            if (props.isLogged) {
                if (shipContext.friendId) {
                    shipContext.setBoats(
                        (await getFriendBoats(shipContext.friendId)).map(
                            ({ tier }) => tier
                        )
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
        const fetchData = async () => {
            const userFriends = await getFollowed()
            if (userFriends.length > 0) {
                setFriendList(userFriends)
            }
        }
        fetchData()
        if (!props.isLogged) navigate('/')
        shipContext.setType('empty')
    }, [])

    const [friendList, setFriendList] = useState([])
    const [isAddingFriend, setIsAddingFriend] = useState(false)
    const [isShowingFleet, setIsShowingFleet] = useState(false)
    const [isUserNotFound, setIsUserNotFound] = useState(false)
    const [isUserAddedSuccessfully, setIsUserAddedSuccessfully] =
        useState(false)

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
                <Slide in={isShowingFleet}>
                    <Button
                        sx={{ mt: 5, mb: 5, width: '50%', mx: 'auto' }}
                        variant="contained"
                        onClick={() => setIsShowingFleet(false)}
                    >
                        Return
                    </Button>
                </Slide>
                <Slide in={!isAddingFriend && !isShowingFleet}>
                    <Button
                        sx={{ mt: 5, mb: 5, width: '50%', mx: 'auto' }}
                        variant="contained"
                        onClick={() => setIsAddingFriend(true)}
                    >
                        Add new friend
                    </Button>
                </Slide>
                {!isAddingFriend && !isShowingFleet && (
                    <Grow in={!isAddingFriend && !isShowingFleet}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            bgcolor="white"
                            borderRadius="20px"
                            sx={{ mx: 'auto', mt: 2, width: '30hw' }}
                        >
                            <Typography
                                variant="h5"
                                sx={{ mb: 2, mt: 3, mb: 2, ml: 4 }}
                            >
                                Your Friends:{' '}
                            </Typography>
                            <DataGrid
                                sx={{ ml: 2, mr: 2, mb: 3 }}
                                disableColumnMenu
                                bulkActionButtons={false}
                                rows={friendList.map((params) => ({
                                    ...params,
                                    onClick: () => {
                                        shipContext.setFriendId(params.id)
                                        shipContext.setType('friend')
                                        setIsShowingFleet(true)
                                    },
                                }))}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 5,
                                        },
                                    },
                                }}
                                pageSizeOptions={[5]}
                                disableRowSelectionOnClick
                            />
                        </Box>
                    </Grow>
                )}
                <Grow in={isAddingFriend}>
                    <Box
                        sx={{
                            bgcolor: 'white',
                            mx: 'auto',
                            mt: 2,
                            p: 2,
                            borderRadius: '20px',
                            width: '30hw',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        component="form"
                        onSubmit={handleSubmit}
                    >
                        <TextField
                            id="username"
                            name="username"
                            required
                            autoComplete="username"
                        ></TextField>
                        <Box
                            marginTop={2}
                            flexDirection="row"
                            display="flex"
                            justifyItems="center"
                            justifyContent="center"
                        >
                            <Button type="submit">Add Friend</Button>
                            <Button
                                onClick={() => {
                                    setIsUserNotFound(false)
                                    setIsAddingFriend(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                        {isUserNotFound && (
                            <Typography>
                                User not found or already on friend list
                            </Typography>
                        )}
                    </Box>
                </Grow>
                {isUserAddedSuccessfully && (
                    <Typography>Friend added successfully</Typography>
                )}
            </Box>
        </div>
    )
}
