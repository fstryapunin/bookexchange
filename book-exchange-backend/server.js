const express = require('express');


//require middlewares
const {corsMiddleware} = require('./middleware/cors')
const cookieParser = require('cookie-parser')

//require routes
const authRoutes = require('./routes/auth')
const publicRoutes = require('./routes/public')
const userRoutes = require('./routes/user')
const listingRoutes = require('./routes/listing')
const upgradeConnection = require('./websocket/websocket')


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

//listen on port
const server = app.listen(port, () => console.log('Listening on port', port));

server.on('upgrade', upgradeConnection)