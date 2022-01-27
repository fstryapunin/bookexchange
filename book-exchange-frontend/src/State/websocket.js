const apiAdress = process.env.REACT_APP_API_ADRESS.replace("http", "ws");

export const createSocketMiddleware = () => {
    return store => {
        
        const socket = new WebSocket(apiAdress);
        
        socket.addEventListener("message", (message) => {
            const response = JSON.parse(message.data)
            
            store.dispatch({
                type : response.type,
                payload: {
                    status: response.status,
                    data: response.data
                }
            });
        });

        return next => action => {            
            if (action.type === "SEND_WEBSOCKET_MESSAGE") {
                if (socket.readyState === 1) {
                    socket.send(action.payload);
                    return;
                }
                return;
            }
            if (action.type === "GET_WEBSOCKET_TAGS") {
                if (socket.readyState === 1) {
                    const getTagsPayload = {
                        type: 'GET_TAGS',
                        text: action.payload
                    }                    
                    socket.send(JSON.stringify(getTagsPayload));
                    return;
                }
                return;
            }            
            
            return next(action);
        }
    }
}