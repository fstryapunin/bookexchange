import React, {useState} from "react";
import { selectUserListings } from "./userSlice";
import { useSelector } from "react-redux";
import { Card, SectionHeading } from "../Styles/GlobalStyles";
import PageControl from "./PageControl";
import UserListing from './UserListing'
import styled from "styled-components";

const TableHeading = styled.div` 
    display: flex;
    justify-content: space-between;
    gap: 20px;
`

const StyledMessage = styled.h5`
    text-align: center;
`
const LabelContainer = styled.div`
    width:  100%;
    display: flex;
    
    #labels {
        flex-basis: 80%;
        flex-grow: 1;
        display: flex;
        gap: 10px;
    }
    #hidden-buttons{
        display: flex;
        flex-grow: 1;
        gap: 20px;
        visibility: hidden;
    }
    #hidden-buttons > button {
        flex-grow: 1;
        flex-basis: 50px;
    }
    @media (max-width: 771px) {
    display: none;
  }
`

const GridLabel = styled.h6`
    color: var(--dark-gray);
    flex-grow: ${props => props.fr};
    flex-basis: ${props => props.basis};
    font-weight: normal;  
    margin: 20px 0px;
`

const UserListings = ({ text, type }) => {
    const [currentPage, updateCurrentPage] = useState(0)
    const [pageSize,] = useState(10)
    const listings = useSelector(state => selectUserListings(state.user.listings, type))
    
    const getElements = () => {
        const currentData = listings.slice(pageSize * currentPage, pageSize * currentPage + pageSize)        
        const elements = currentData.map(listingObj => {
            return (<UserListing key={listingObj.id} data={listingObj}/>)
        })
        return elements
    }

    return (
        <Card margin="25px 0px 0px 0px">
            <TableHeading>
                <SectionHeading align='left'>
                    {`MOJE ${text}`}                
                </SectionHeading>
                {listings.length > pageSize ? <PageControl dataLength={listings.length} pageSize={pageSize} currentPage={currentPage} updateCurrentPage={updateCurrentPage} />: null}
            </TableHeading>
            {listings.length > 0 ?
                <>
                <LabelContainer>
                    <div id="labels">     
                        <GridLabel fr="0.5" basis="30px">Přidáno</GridLabel>
                        <GridLabel fr="1" basis="100px">Jméno</GridLabel>
                        <GridLabel fr="0.5" basis="30px">Aktivní</GridLabel>
                        <GridLabel fr="0.5" basis="30px">Cena</GridLabel>
                    </div>   
                    <div id="hidden-buttons">
                        <button>Detail</button>
                        <button>Smazat</button>
                    </div>
                </LabelContainer>
                {getElements()}
                </>  
                :
                <StyledMessage>
                   {`Zatím žádné ${text} :(`} 
                </StyledMessage>
            }          
        </Card>
    )
}

export default UserListings