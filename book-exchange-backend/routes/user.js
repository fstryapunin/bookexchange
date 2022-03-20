const express = require('express');
const { listingModel } = require('../models')
const { tokenAuth } = require('../middleware/auth')
const { db } = require('../middleware/knex')
const { param, body } = require('express-validator');


const router = express.Router()

router.post('/listings', tokenAuth, async (req, res) => {
    //limit ammount    
    const userListings = await listingModel.query().withGraphFetched('tags').withGraphJoined('images').where('images.deleted', false).where('listings.poster_id', req.user.id).andWhere('listings.deleted', false).orderBy('added', 'desc') 
    res.status(200).json(userListings)
})

router.post('/profile', tokenAuth, async (req, res) => {
    const userData = await db.select('*').from('users').where('id', req.user.id)
    const user = userData[0]    
    const resBody = {
        id: parseInt(user.id),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        link: user.img_link
    }
    res.status(200).json(resBody)
})

router.post('/listing/:listingId', tokenAuth, param('listingId').escape().toInt(), async (req, res) => {
    const { listingId } = req.params
    if (Number.isInteger(listingId)) {        
        const listing = await listingModel.query().withGraphFetched('tags').withGraphJoined('images').where('images.deleted', false).where('listings.id', listingId)
        if(listing.length > 0){
            if (parseInt(listing[0].poster_id) === req.user.id && !listing[0].deleted) {
                res.json(listing[0])
            } else {
                res.sendStatus(403)
            }
        } else {
            res.sendStatus(404)
        }        
    } else {
        res.sendStatus(400)
    }
})

router.delete('/listing/delete/:listingId', tokenAuth, param('listingId').escape().toInt(), async (req, res) => {
    const { listingId } = req.params
    const response = await db('listings').where('id', listingId).update('deleted', true).returning('id')
    res.status(200).json(response)
})

router.post('/listing/update/status', tokenAuth, body('status').escape().notEmpty(), async (req, res) => {
    const response = await db('listings').update('status', req.body.status).where('id', req.body.id).returning('id')
    res.status(200).json({
        id: response,
        status: req.body.status
    })
})

module.exports = router