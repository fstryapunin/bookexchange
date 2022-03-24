const cors = require('cors')
const { corsOrigins } = require('../config.js')

const corsConfig = {
    origin: corsOrigins,
    methods: "GET,PUT,POST,DELETE, OPTIONS",
    optionsSuccessStatus: 200,
    credentials: true
}

const corsMiddleware = cors(corsConfig)

module.exports = {
    corsMiddleware: corsMiddleware  
}

