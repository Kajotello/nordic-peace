import { SERVER_ADRESS } from './const'

export const login = async (username, password) => {
    return await fetch(`${SERVER_ADRESS}/users/login`, {
        method: 'POST',
        body: JSON.stringify({ nick: username, password: password }),
        headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.json())
}
