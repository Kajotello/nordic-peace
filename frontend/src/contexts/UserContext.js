import { useState } from "react"

export const UserContext = React.createContext(null)

export function UserContextProvider(props) {

    const [userData, setUserData] = useState({
        nick: null,
        experience: null,
    }) 

    return (
        <UserContext.Provider
            value={{
                userData,
                setUserData
            }}
        >
            {props.children}
        </UserContexts.Provider>
    )
}
