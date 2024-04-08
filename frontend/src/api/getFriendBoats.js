import { SERVER_ADRESS } from './const'

export const getFriendBoats = async (userId) => {
    const body = JSON.stringify({
        user_id: userId,
    })

    return await fetch(`${SERVER_ADRESS}/ships/get_other_users_ships`, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())
}
