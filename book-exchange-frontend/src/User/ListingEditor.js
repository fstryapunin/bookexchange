import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectListingById } from "./userSlice";
import { SectionHeading, Card } from "../Styles/GlobalStyles";
import moment from "moment";
import styled from "styled-components";
const apiAdress = process.env.REACT_APP_API_ADRESS;

const StyledEditor = styled.div` 
    max-width: 1140px;
    margin-left: auto;
    margin-right: auto;
    padding:25px;
    box-sizing: border-box;    
`

const EditorCard = styled(Card)`     
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const StyledInput = styled.input`
    padding: 5px;   
    font-size: 1rem;    
    border: 1px solid;
    outline: none;
    height: 20px;
    width: 2.5rem;
`

const NameInput = styled(StyledInput)` 
    flex-grow: 1;
    max-width:350px;
    min-width:30%;
`

const NameContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
`

const ListingAdded = styled.p`
    margin: 0px 0px 0px auto;
    white-space: nowrap;
`

const ListingEditor = () => {
    const [listingData, updateListingData] = useState({
        status: 'idle',
        data: null,
        errror: null
    })
    const params = useParams();
    const token = useSelector(state => state.user.auth.token)
    const listing = useSelector(state => selectListingById(state.user.listings.data, params.id))

    const fetchListing = async () => {
        const response = await fetch(`${apiAdress}/user/listing/${params.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token
            })
        })
        if (response.ok) {
            const data = await response.json()
            updateListingData({
                status: 'loaded',
                data: data
            })
        } else {
            updateListingData({
                status: 'failed',
                error: response.status
            })
        }
       
    }

    useEffect(() => {
        if (!listing) {
            fetchListing()
        } else {
            updateListingData({
                status: 'loaded',
                data: listing
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listing])

    if (listingData.status === 'loaded') {
        return (
            <StyledEditor>                
                <EditorCard>
                    <SectionHeading>Upravit příspěvek</SectionHeading>                    
                    <NameContainer>
                        <NameInput value={listingData.data.name}></NameInput>
                        <StyledInput value={listingData.data.price}></StyledInput> KČ
                        <ListingAdded>Přidáno {moment.utc(listingData.data.added).format('DD.MM.YYYY')}</ListingAdded>
                    </NameContainer>                   
                    <textarea value={listingData.data.description}></textarea>
                </EditorCard>
                {JSON.stringify(listingData)}
            </StyledEditor>
        )
    } else {
        return (
            <h2>Loading</h2>
        )
    }
}

export default ListingEditor