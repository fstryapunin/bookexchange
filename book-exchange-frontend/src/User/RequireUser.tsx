import React, {useEffect} from "react";
import { useAppSelector, useAppDispatch } from "../Hooks/hooks";
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

const RequireUser: React.FC = () => {   
    const userStatus = useAppSelector(state => state.user.info.status)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (userStatus === 'idle') {
            dispatch(fetchUserData())
        }
    }, [userStatus, dispatch])

    if (userStatus === 'loaded') {
        return <Outlet/>
    } else if (userStatus === 'failed') {
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