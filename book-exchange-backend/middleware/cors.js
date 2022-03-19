const cors = require('cors')

const corsConfig = {
    origin: ['http://localhost:3000', 'https://kepler-x.vercel.app'],
    methods: "GET,PUT,POST,DELETE, OPTIONS",
    optionsSuccessStatus: 200,
    credentials: true
}

const corsMiddleware = cors(corsConfig)

module.exports = {
    corsMiddleware: corsMiddleware  
}

