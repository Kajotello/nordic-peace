import { SERVER_ADRESS } from './const'

export const getFollowed = async () => {
    return await fetch(`${SERVER_ADRESS}/users/list_followed `, {
        method: 'GET',
    }).then((res) => res.json())
}
