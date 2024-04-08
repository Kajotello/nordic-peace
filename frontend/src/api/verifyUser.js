import { SERVER_ADRESS } from './const'

export const verifyUser = async (token) => {
    return await fetch(`${SERVER_ADRESS}/users/user`, {
        method: 'GET',
    }).then((res) => res.json())
}
