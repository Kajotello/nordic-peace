import { SERVER_ADRESS } from './const'

export const getBoats = async () => {
    return await fetch(`${SERVER_ADRESS}/ships/get_self_ships`, {
        method: 'GET',
    }).then((res) => res.json())
}
