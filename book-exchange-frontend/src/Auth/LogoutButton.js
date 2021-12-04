import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { unauthenticateUser } from "../State/authSlice";
import { SecondaryButton } from "../Styles/GlobalStyles";

//styles copied from google button
const StyledLogoutButton = styled(SecondaryButton)`
    width: 100%;
    box-sizing: border-box;
    margin: 25px 0px;
`

const LogoutButton = () => {
    const dispatch = useDispatch()

    const onLogout = () => {
        dispatch(unauthenticateUser())
    }

    return (
        <StyledLogoutButton onClick={onLogout}>
            Odhlásit se
        </StyledLogoutButton>
    )
}

export default LogoutButton