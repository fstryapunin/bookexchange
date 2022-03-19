const express = require('express');
const { listingModel } = require('../models')
const { param, validationResult, checkSchema } = require('express-validator');

const router = express.Router()

router.get('/listings/new/:page', param('page').escape().toInt(), async (req, res) => {   
    const { page } = req.params
    
    if (Number.isInteger(page) && page >= 0) {
        const listings = await listingModel.query().withGraphFetched('tags').withGraphFetched('user').withGraphFetched('images').select('listings.id', 'listings.name', 'listings.type', 'listings.description', 'listings.status', 'listings.title_image', 'listings.price').where('deleted', false).andWhereNot('status', 'inactive').orderBy('edited', 'desc').offset(page * 20).limit(20)         
        res.json(listings)        
    } else {
        res.sendStatus(400)
    }
})

router.get('/listing/:listingId', param('listingId').escape().toInt(), async (req, res) => {
    const { listingId } = req.params
    if (Number.isInteger(listingId)) {
        const data = await listingModel.query().withGraphFetched('tags').withGraphFetched('user').withGraphJoined('images').select('listings.id', 'listings.name', 'listings.type', 'listings.description', 'listings.status', 'listings.title_image', 'listings.price').where('images.deleted', false).andWhere('listings.id', listingId)
        if (data.length > 0 && !data[0].deleted) {
            res.json(data[0])
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(400)
    } 
})


//schema for checking filter args from request
const filterSchema = {
    name: {
        in: 'body',
        trim: true,
        escape: true,
        optional: true
    },
    type: {
        in: 'body',
        trim: true,
        escape: true,
        optional: true
    },
    'price.min': {
        in: 'body',
        trim: true,
        escape: true,
        toInt: true,
        optional: true
    },
    'price.max': {
        in: 'body',
        trim: true,
        escape: true,
        toInt: true,
        optional: true
    },
    'tags.*.id': {
        in: 'body',
        trim: true,
        escape: true,
        toInt: true,
        notEmpty: true,
        bail: true,
        optional: true
    },
    'tags': {       
        custom: {
            options: (value) => {                
                if (value.length > 5) return false
                else return true
            },
            errorMessage: "Too many tags"
        },
        optional: true
    }
}

router.post('/listings/filter', checkSchema(filterSchema), async (req, res) => {
    const result = validationResult(req)
    const filters = req.body    
    let tagIds;
    if (filters.tags) {
        const idArray = filters.tags.map(obj => obj.id)
        tagIds = idArray
    }

    if (result.errors.length === 0) {
        const listings = await
            listingModel
                .query()                
                .withGraphFetched('user')
                .withGraphFetched('images') 
                .withGraphJoined('tags')                
                .where((qb) => {
                    if (filters.name) {
                        qb.where('name', 'like', `%${filters.name}%`)
                    }
                    if (filters.type) {
                        qb.where('type', filters.type)
                    }
                    if (filters.price) {
                        qb.where('price', '>=', filters.price.min).andWhere('price', '<=', filters.price.max)
                    }
                    if (filters.tags) {
                        qb.where('tags.id', 'in', tagIds)
                    }
                    qb.where('listings.deleted', '=', false)
                    
                })
                
                
        
        const listingIds = listings.map(obj => obj.id)
        
        const completeListings = await listingModel
            .query()
            .select('listings.id', 'listings.name', 'listings.type', 'listings.description', 'listings.status', 'listings.title_image', 'listings.price')
            .withGraphFetched('user')
            .withGraphFetched('images') 
            .withGraphFetched('tags')
            .where('id', 'in', listingIds)
        
       
        res.status(200).json(completeListings)
    } else {
        res.status(400).json(result.errors)
    }
})

module.exports = router
