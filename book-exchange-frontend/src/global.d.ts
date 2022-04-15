

interface Tag {    
    id: string | number,
    text: string,
    creator_id: string | number,
    times_used:string | number,
    added: string    
}

interface User {
    id: string | number,
    email: string,
    first_name: string,
    last_name: string,
    img_link: string
}

interface ListingImage {
    id: string | number,
    file_name: string,
    listing_id: string | number,
    user_id: string | number,
    added: string,
    deleted: boolean
}

interface Listing {
    id: string | number,
    name: string,
    type: string,
    description: string,
    status: 'active' | 'engaged' | 'inactive',
    title_image: string,
    price: string | number,
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
    addressant: number | string,
    conversation_id: number | string,
    deleted: boolean,
    embedded: string | number | null,
    id: number | string,
    notification_sent: boolean,
    seen: boolean,
    text: string,
    creator_id: string | number
}

interface Conversation {
    id: number | string,
    creator_id: number | string,
    deleted: boolean,
    added: string,
    messages: Message[],
    users: User[]
}