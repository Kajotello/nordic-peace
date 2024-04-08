import { SERVER_ADRESS } from './const'

export const loginGoogle = async () => {
    return await fetch(`${SERVER_ADRESS}/login/google`, {
        method: 'GET',
    }).then((res) => res.json())
}
