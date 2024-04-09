import axios from 'axios'
import { SERVER_ADDRESS } from './const'

export const login = async (form) => {
    return await axios
        .post(`${SERVER_ADDRESS}/users/user-data`, form)
        .then((res) => res)
}
