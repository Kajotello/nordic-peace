import { SERVER_ADRESS } from './const'

export const getAllBoats = async () => {
    return await fetch(`${SERVER_ADRESS}/ships/`, {
        method: 'GET',
    }).then((res) => res.json())
}
