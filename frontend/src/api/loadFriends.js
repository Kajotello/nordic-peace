import { SERVER_ADDRESS } from './const'

export const getFollowed = async () => {
    return await fetch(`${SERVER_ADDRESS}/users/list_followed `, {
        method: 'GET',
    }).then((res) => res.json())
}
