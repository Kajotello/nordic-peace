import { SERVER_ADDRESS } from './const'
import Cookie from 'js-cookie'

export const startJourney = async (duration, boatType) => {
    const data = new Date()
    const body = JSON.stringify({
        duration: duration,
        start_date: new Date().toISOString().slice(0, -1),
        ship_tier: boatType,
    })

    return await fetch(`${SERVER_ADDRESS}/journeys/create`, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Cookie.get('token')}`,
        },
    }).then((res) => res.json())
}
