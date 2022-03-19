const ws = require('ws')
const { db } = require('../middleware/knex')
const {websocketAuth} = require('../middleware/auth')

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

            return Object.assign(responseObject, {status: 'success'})
        
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
