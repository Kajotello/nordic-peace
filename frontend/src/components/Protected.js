import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function Protected(props) {
    const navigate = useNavigate()

    useEffect(() => {
        if (!props.condition) navigate(props.redirectTo)
    }, [])

    return <>{props.condition && props.children}</>
}
