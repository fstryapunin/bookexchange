const express = require('express');
const jwt = require("jsonwebtoken");
const { cookieAuth } = require('../middleware/auth')
const { OAuth2Client } = require('google-auth-library')
const { googleClientId, tokenKey } = require('../config');
const { db } = require('../middleware/knex')

const googleClient = new OAuth2Client(googleClientId)

const router = express.Router()

const upsertUser = async (payload) => {
    
    const firstName = payload.given_name
    const lastName = payload.family_name
    const email = payload.email
    const imageLink = payload.picture

    const exists = await db.select('*').from('users').where('email', email)
    
        if (exists.length === 0) {
            const newUserId = await db('users').insert({
                email: email,
                first_name: firstName,
                last_name: lastName,
                img_link: imageLink
            }, 'id')            
            return parseInt(newUserId[0])
        } else {
            const userId = await db('users').where('email', email).update({
                email: email,
                first_name: firstName,
                last_name: lastName,
                img_link: imageLink
            }, 'id')            
            return parseInt(userId[0])
        }
}

router.post('/google/login', async (req, res) => {
    
    const { token } = req.body   
    if (token) {      
        
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: googleClientId
        });
        
        const payload = ticket.getPayload()      
        
        const userId = await upsertUser(payload)      

        const refreshToken = jwt.sign(
            {
                email: payload.email,
                id : userId
            },
            tokenKey,
            {
              expiresIn: "30d",
            }
        );
        
        const accessToken = jwt.sign(
            {
                id: userId
            },
            tokenKey,
            {
                expiresIn: '12h'
            }
        ) 

        res.cookie('token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 * 13 })
        res.status(200).json({token: accessToken})
        
    } else {
        res.sendStatus(400)
    }
})

router.get('/getAccessToken', cookieAuth, async (req, res) => {
    const accessToken = jwt.sign(
        {
            id: req.user.id
        },
        tokenKey,
        {
            expiresIn: '12h'
        }
    )    
   
    res.status(200).json({token : accessToken})
   
})

router.get('/logout', async (req, res) => {
    res.clearCookie('token')
    res.sendStatus(200)
})

module.exports = router