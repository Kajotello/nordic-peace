import { SERVER_ADDRESS } from './const'

export const getAllBoats = async () => {
    return await fetch(`${SERVER_ADDRESS}/ships/`, {
        method: 'GET',
    }).then((res) => res.json())
}
