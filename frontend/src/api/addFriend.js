import { SERVER_ADRESS } from './const'

export const addFriend = async (username) => {
    const body = JSON.stringify({
        followed_user_nick: username,
    })

    return await fetch(`${SERVER_ADRESS}/users/follow_user `, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
}
