import axios from 'axios'
import { SERVER_ADDRESS } from './const'
import Cookie from 'js-cookie'

export const getBoats = async () => {
    return await axios
        .get(`${SERVER_ADDRESS}/boats/get-my-journeys-with-boats`, {
            headers: { Authorization: `Bearer ${Cookie.get('token')}` },
        })
        .then((res) => res.data)
}
