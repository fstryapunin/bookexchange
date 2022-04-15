import React from "react";
import styled from "styled-components";
import { useAppDispatch } from "../Hooks/hooks";
import { unauthenticateUser } from "../User/userSlice";
import { SecondaryButton } from "../Styles/GlobalStyles";

//styles copied from google button
const StyledLogoutButton = styled(SecondaryButton)`
    width: 100%;
    box-sizing: border-box;
    margin: 25px 0px;
    text-transform: uppercase;
`

const LogoutButton: React.FC = () => {
    const dispatch = useAppDispatch()

    //send request to destroy refresh token cookie
    const onLogout = () => {
        dispatch(unauthenticateUser())
    }

    return (
        <StyledLogoutButton onClick={onLogout}>
            <p>Odhlásit se</p>
        </StyledLogoutButton>
    )
}

export default LogoutButton