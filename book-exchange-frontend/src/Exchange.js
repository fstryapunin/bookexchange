import React, {useState} from "react";
import Navbar from "./Navbar/Navbar";

const Exchange = () => {
    const [user, updateUser] = useState({
        isLogged: false
    })

    const onLogin = (userData) => {
        const newUser = { ...user, isLogged: true, data: userData }
        updateUser(newUser)
    }

    const onLogout = () => {
        updateUser({
            isLogged: false
        })
    }

    return (
        <div>
            <Navbar isLogged={user.isLogged} onLogin={onLogin} onLogout={onLogout}/>
        </div>
    )
}

export default Exchange