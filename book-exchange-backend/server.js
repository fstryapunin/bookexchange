const express = require('express');


//require middlewares
const {corsMiddleware} = require('./middleware/cors')
const cookieParser = require('cookie-parser')

//require routes
const authRoutes = require('./routes/auth')
const publicRoutes = require('./routes/public')
const userRoutes = require('./routes/user')
const listingRoutes = require('./routes/listing')
const messageRoutes = require('./routes/messages')

//require wss
const upgradeConnection = require('./websocket/websocket')

//requie tasks
const { notificationTask } = require('./tasks/notifications')

/////////////////////////////////////////////////////////////////////


const { port } = require('./config');

const app = express();

app.use(corsMiddleware)
//parse cookies
app.use(cookieParser())
//parse json
app.use(express.json())
//serve user upoladed images
app.use('/public/uploads', express.static('public/uploads'))

//use routes
app.use('/auth', authRoutes)
app.use('/public', publicRoutes)
app.use('/user', userRoutes)
app.use('/listing', listingRoutes)
app.use('/messages', messageRoutes)

//listen on port
const server = app.listen(port, () => console.log('Listening on port', port));

//upgrade connection to websocket
server.on('upgrade', upgradeConnection)

//run scheduled tasks
notificationTask.start()