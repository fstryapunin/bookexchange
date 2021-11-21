import React from "react";
import styled from "styled-components";

//styles copied from google button
const StyledLogoutButton = styled.div`
    -webkit-border-radius: 4px;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-transition: background-color .218s,border-color .218s;
    transition: background-color .218s,border-color .218s;
    -webkit-user-select: none;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border: 1px solid #dadce0;
    color: #3c4043;
    cursor: pointer;
    font-family: 'Google Sans',arial,sans-serif;
    font-size: 14px;
    height: 40px;
    letter-spacing: 0.25px;
    outline: none;
    overflow: hidden;
    padding: 0 12px;
    position: relative;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    width: auto;
    font-size: 14px;
    height: 32px;
    letter-spacing: 0.25px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 600;
`

const LogoutButton = ({onLogout}) => {
    return (
        <StyledLogoutButton onClick={onLogout}>
            Odhlásit
        </StyledLogoutButton>
    )
}

export default LogoutButton