const ws = require('ws')
const { db } = require('../middleware/knex')

const wss = new ws.WebSocketServer({ noServer: true });

const upgradeConnection = async (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, function done(ws) {
        wss.emit('connection', ws, request);
    });
}

const handleWebsocketMessage = async (payload) => {
    const responseObject = {
        type: payload.type
    }

    switch (payload.type) {
        case 'GET_TAGS':
            responseObject.type = 'GOT_WEBSOCKET_TAGS'
            try {
                const data = await db('tags').select('*').whereRaw(`LOWER(text) LIKE LOWER(?)`, [`${payload.text}%`]).orderBy('times_used')
                
                return Object.assign(responseObject, {
                    status: 'success',
                    data: data
                })
            } catch {                 
                return Object.assign(responseObject, {
                    status: 'error',
                    error: 'database error'
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
    ws.on('message', async function message(data) {
        const messageData = JSON.parse(String(data))
        const response = await handleWebsocketMessage(messageData)
        ws.send(JSON.stringify(response))        
    });    
}); 

module.exports = upgradeConnection 
