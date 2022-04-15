import React, {useEffect} from "react";
import { useAppSelector, useAppDispatch } from "../Hooks/hooks";
import { Outlet, Navigate } from "react-router-dom";
import { authenticateUser } from "./userSlice";
import Loader from "../Loader/Loader";
import styled from "styled-components";

const LoaderContainer = styled.div` 
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`

const RequireAuth = () => {   
    const status = useAppSelector(state => state.user.auth.status)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (status === 'idle') {
            dispatch(authenticateUser())
        }
    }, [status, dispatch])

    if (status === 'authenticated') {
        return <Outlet/>
    } else if (status === 'unauthenticated') {
        return <Navigate to="/"/>
    } else {
        return (
            <LoaderContainer>
                <Loader/>
            </LoaderContainer>
        )
    }
}

export default RequireAuth