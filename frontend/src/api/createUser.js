import { SERVER_ADDRESS } from './const'
import qs from 'qs'

export const createUser = async (form) => {
    return await fetch(`${SERVER_ADDRESS}/register`, {
        method: 'POST',
        body: form,
    }).then((res) => res.json())
}
