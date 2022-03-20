const ws = require('ws')
const { db } = require('../middleware/knex')
const { websocketAuth } = require('../middleware/auth')
const { promisify } = require('../util/util')

const wss = new ws.WebSocketServer({ noServer: true });

const upgradeConnection = async (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });
}

const getTags = async (text) => {
    try { 
        const data = await db('tags').select('*').whereRaw(`LOWER(text) LIKE LOWER(?)`, [`${text}%`]).orderBy('times_used')
        return {
            status: 'success',
            data: data
        }
    }
    catch {
        return  {
            status: 'error',
            error: 'database error'
        }
    }
}

const getIniqueId = () => {
    const id = Math.floor(Math.random() * 1000) + Date.now()
    return id
}


const getClientData = async (payload) => {
    const client = websocketAuth(payload.token)
            if (client.status === 'authorized') {                
                return {
                    status: 'authorized',
                    client: client
                }
            }
            else {
                return {
                    status: 'error',
                    error: client.text
                }
            }
}

const handleMessageUpload = async (message, user) => {
    
    try { 
        
        if (message.conversationId && message.text && user.id) {
            const sentMessage = await db('messages').insert({
                conversation_id: message.conversationId,
                creator_id: user.id,
                text: message.text
            }).returning('*')

            return {
                status: 'success',
                data : sentMessage
            }
        } else {
            return {
                status: 'error',
                error: 'invalid data'
            }
        }

    }
    catch {
        return {
            status: 'error',
            error: 'database error'
        }
    }
}

const handleWebsocketMessage = async (payload, wss, ws) => {
    const responseObject = {
        type: payload.type        
    }    

    switch (payload.type) {

        case 'GET_TAGS':
            responseObject.type = 'GOT_WEBSOCKET_TAGS'

            const tagsData = await getTags(payload.text)

            return Object.assign(responseObject, tagsData)
        
        case 'AUTHORIZE_CLIENT':
            responseObject.type = 'GOT_WEBSOCKET_AUTHORIZATION'

            const clientData = await getClientData(payload)

            if (clientData.status === 'authorized') {
                wss.clients.forEach(client => {
                    if (client.serverId === ws.serverId) {
                        client.user = clientData
                    }
                })                
            }            

            return Object.assign(responseObject, { status: 'success' })
        case 'SEND_MESSAGE':
            responseObject.type = 'SENT_WEBSOCKET_MESSAGE'
            
            const messagerData = await getClientData(payload)
            
            if (messagerData.status === 'authorized' && messagerData.client.user.id === payload.message.from) {

                const messageData = await handleMessageUpload(payload.message, messagerData.client.user)               
                
                if (messageData.status === 'success') {

                    wss.clients.forEach(client => {
                        const id = client.user.client.user.id
                        if (id === parseInt(payload.message.to)) {
                            if (client.readyState === 1) {
                                client.send(JSON.stringify(
                                    {
                                        type: 'GOT_WEBSOCKET_MESSAGE',
                                        data: messageData.data,
                                        status: 'success'
                                    }
                                ))
                            }
                        }
                    })

                }
                return Object.assign(responseObject, messageData) 
                

            } else {
                return Object.assign(responseObject, {
                    status: 'error',
                    error: 'no auth or wrong user'
                }) 
            }
        
        default:

            return Object.assign(responseObject, {
                status: 'error',
                error: 'unrecognized request type'
            })            
    }
}

wss.on('connection', function connection(ws, request) {   
    ws.serverId = getIniqueId()
    ws.on('message', async function message(data) {
        const messageData = JSON.parse(String(data))
        const response = await handleWebsocketMessage(messageData, wss, ws)        
        
        ws.send(JSON.stringify(response))        
    });    
}); 

module.exports = upgradeConnection 
