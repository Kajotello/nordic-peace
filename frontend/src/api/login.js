import { SERVER_ADDRESS } from './const'

export const login = async (username, password) => {
    return await fetch(`${SERVER_ADDRESS}/users/login`, {
        method: 'POST',
        body: JSON.stringify({ nick: username, password: password }),
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
}
