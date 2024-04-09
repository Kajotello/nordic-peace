import axios from 'axios'
import { SERVER_ADDRESS } from './const'
import Cookie from 'js-cookie'

export const verifyUser = async () => {
    return await axios
        .get(`${SERVER_ADDRESS}/users/user-data`, {
            headers: { Authorization: `Bearer ${Cookie.get('token')}` },
        })
        .then((res) => res)
}
