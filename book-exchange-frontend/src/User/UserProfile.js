import React, {useEffect} from "react";
import styled from "styled-components";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router";

const StyledProfile = styled.div`
    width: 100%;
    box-sizing: border-box;
    max-width: 1140px;
    display: flex;
    justify-content: center;
`
const Center = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const UserProfile = ({ user }) => {
    const navigate = useNavigate()

    const checkUser = () => {
        if(user.loaded && !user.isLogged) navigate('/')
    }

    useEffect(checkUser, [user])

    if (user.loaded) {
        return (
            <StyledProfile>
                <div>
                    <h1>Logged in</h1>
                    <h2>{`Jméno`}</h2>
                </div>
            </StyledProfile>
        )
    } else {
        return (
            <Center>
                <Loader />
            </Center>
        )
    }
}

export default UserProfile