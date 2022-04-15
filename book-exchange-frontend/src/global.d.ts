

interface Tag {    
    id: number,
    text: string,
    creator_id: number,
    times_used: number,
    added: string    
}

interface User {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    img_link: string
}

interface ListingImage {
    id: number,
    file_name: string,
    listing_id: number,
    user_id: number,
    added: string,
    deleted: boolean
}

interface Listing {
    id: number,
    name: string,
    type: string,
    description: string,
    status: 'active' | 'engaged' | 'inactive',
    title_image: string,
    price: number,
    added: string,
    tags?: Tag[],
    user?: User,
    images: ListingImage[]
}

interface NewListing {
    name: string,
    price: string,
    description: string,
    tags: (Tag | {text: string})[],            
    images: any[]
}

interface Message {
    added: string,
    addressant: number,
    conversation_id: number,
    deleted: boolean,
    embedded: number | null,
    id: number,
    notification_sent: boolean,
    seen: boolean,
    text: string,
    creator_id: number
}

interface Conversation {
    id: number,
    creator_id: number,
    deleted: boolean,
    added: string,
    messages: Message[],
    users: User[]
}