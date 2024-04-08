import { SERVER_ADDRESS } from './const'

export const verifyUser = async () => {
    console.log('plapal')
    return await fetch(`${SERVER_ADDRESS}/users/user-data`, {
        method: 'GET',
    }).then((res) => res)
}
