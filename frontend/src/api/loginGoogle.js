import { SERVER_ADDRESS } from './const'

export const loginGoogle = async () => {
    return await fetch(`${SERVER_ADDRESS}/login/google`, {
        method: 'GET',
    }).then((res) => res.json())
}
