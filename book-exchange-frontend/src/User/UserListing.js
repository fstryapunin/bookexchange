import React from "react";
import { Link } from "react-router-dom";
import moment from 'moment'
import styled from "styled-components";

const StyledLink = styled(Link)` 
    text-decoration: none;
    color: inherit;
    flex-grow: 1;
    flex-basis: 50px;
    > button{
        width: 100%;
    }
`

const ListingElement = styled.p`
    flex-grow: ${props => props.fr};
    flex-basis: ${props => props.basis};
`

const ListingContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    .listing-details{
        flex-grow: 1;
        flex-basis: 80%
    }
    .listing-buttons{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-grow: 1;
        gap: 20px
    }
    .listing-buttons > button {
        flex-grow: 1;
        flex-basis: 50px;
    }
`
const DetailsContainer = styled.div` 
    display: flex;
    flex-wrap: wrap;
    gap: 10px;    
`

const UserListing = ({ data }) => {    
    
    return (
        <ListingContainer>
            <DetailsContainer className="listing-details">
                <ListingElement fr="0.5" basis="30px">{moment(data.added).format('DD.MM.YYYY')}</ListingElement>
                <ListingElement fr="1" basis="100px">{data.name}</ListingElement>
                <ListingElement fr="0.5" basis="30px">{data.status}</ListingElement>
                <ListingElement fr="0.5" basis="30px">{data.price} Kč</ListingElement>
            </DetailsContainer>
            <div className="listing-buttons">
                <StyledLink to={`editor/${data.id}`}>
                    <button>Upravit</button>
                </StyledLink>
                <button>Smazat</button>
            </div>
        </ListingContainer>
    )

}

export default UserListing