import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const storedToken = sessionStorage.getItem('token')
        const storedUserId = sessionStorage.getItem('userId')
        if(storedToken){
            setToken(storedToken)
        }
        if(storedUserId){
            setUserId(storedUserId)
        }
    }, [])

    const login = (newToken, newUserId) => {
        sessionStorage.setItem('token', newToken)
        sessionStorage.setItem('userId', newUserId)
        setToken(newToken)
        setUserId(newUserId)
    }

    const logout = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('userId')
        setToken(null)

    }
    
    return(
        <AuthContext.Provider value={{token, login, logout, userId}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)