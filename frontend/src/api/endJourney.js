import { SERVER_ADDRESS } from './const'

export const endJourney = async (journeyId, endType) => {
    const body = JSON.stringify({
        id: journeyId,
        end_type: endType,
    })

    return await fetch(`${SERVER_ADDRESS}/journeys/end_journey`, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json())
}
