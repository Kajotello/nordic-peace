import { SERVER_ADDRESS } from './const'

export const getBoats = async () => {
    return await fetch(`${SERVER_ADDRESS}/ships/get_self_ships`, {
        method: 'GET',
    }).then((res) => res.json())
}
