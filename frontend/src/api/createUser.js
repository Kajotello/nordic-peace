import { SERVER_ADDRESS } from './const'

export const createUser = async (username, password) => {
    const body = JSON.stringify({
        nick: username,
        password: password,
        is_premium: false,
        experience: 0,
    })

    return await fetch(`${SERVER_ADDRESS}/users/register `, {
        method: 'POST',
        body: body,
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
}
