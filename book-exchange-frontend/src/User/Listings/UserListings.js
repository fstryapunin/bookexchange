import React, {useState} from "react";
import { selectUserListings } from "../userSlice";
import { useSelector } from "react-redux";
import { Card, SectionHeading } from "../../Styles/GlobalStyles";
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
const StyledListingList = styled.div` 
    
`

const UserListings = ({ text, type }) => {
    const [currentPage, updateCurrentPage] = useState(0)
    const [pageSize,] = useState(10)
    const listings = useSelector(state => selectUserListings(state.user.listings.data, type))
    
    //get right ammount of jsx elements based on page size (max. ammount of elements on a page) and current page index
    const getListingElements = () => {
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
                <StyledListingList>
                    {getListingElements()}
                </StyledListingList>  
                :
                <StyledMessage>
                   {`Zatím žádné ${text} :(`} 
                </StyledMessage>
            }          
        </Card>
    )
}

export default UserListings