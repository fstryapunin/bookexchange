import React, {useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, Navigate } from "react-router-dom";
import { fetchUserData } from "./userSlice";
import Loader from "../Loader/Loader";
import styled from "styled-components";

const LoaderContainer = styled.div` 
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

const RequireUser = () => {   
    const userStatus = useSelector(state => state.user.info.status)
    const dispatch = useDispatch()

    useEffect(() => {
        if (userStatus === 'idle') {
            dispatch(fetchUserData())
        }
    }, [userStatus, dispatch])

    if (userStatus === 'loaded') {
        return <Outlet/>
    } else if (userStatus === 'error') {
        return <Navigate to="/"/>
    } else {
        return (
            <LoaderContainer>
                <Loader/>
            </LoaderContainer>
        )
    }
}

export default RequireUser