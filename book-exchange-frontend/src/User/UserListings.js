import React from "react";
import { selectUserListings } from "./userSlice";
import { useSelector } from "react-redux";
import { Card, SectionHeading } from "../Styles/GlobalStyles";
import styled from "styled-components";

const StyledMessage = styled.h5`
    text-align: center;

`

const UserListings = ({ text, type }) => {
    const listings = useSelector(state => selectUserListings(state.user.listings, type))
    
    const getElements = () => {
        const elements = listings.map(listingObj => {
            return (<p key={listingObj.id}>{listingObj.name}</p>)
        })
        return elements
    }

    return (
        <Card margin="25px 0px 0px 0px">
            <SectionHeading align='left'>
                {`MOJE ${text}`}
            </SectionHeading>
            {listings.length > 0 ? getElements() : 
                <StyledMessage>
                   {`Zatím žádné ${text} :(`} 
                </StyledMessage>
            }          
        </Card>
    )
}

export default UserListings