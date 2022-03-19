const express = require('express');
const multer = require('multer');
const { tokenAuth } = require('../middleware/auth')
const { listingModel } = require('../models')
const { promisify } = require('../util/util')
const { db } = require('../middleware/knex')
const { multerUploader } = require('../middleware/multer')

const { checkSchema, validationResult } = require('express-validator');
const router = express.Router()
const uploadEditImages = multerUploader.array('newImages', 5)
const uploadNewImages = multerUploader.array('images', 5)

//check edit listing request with this schema
const editSchema = {
    'info.id': {
        in: 'body',
        trim: true,
        escape: true,
        notEmpty: true,
        toInt: true
    },
    'info.name': {
        in: 'body',
        trim: true,
        escape: true,
        optional: true,
        isLength: {
            errorMessage: 'Name too long',           
            options: { min: 1, max: 40 },
        }
    },    
    'info.price' : {
        in: 'body',
        trim: true,
        escape: true,
        toInt: true,
        optional: true
    },
    'info.description': {
        in: 'body',
        trim: true,
        escape: true,        
        optional: true,
        isLength: {
            errorMessage: 'Description too long',           
            options: { min: 1, max: 1000 },
        },
    },
    newTags: {
        in: 'body',       
        optional: true,
        isArray: {
            options: { max: 5 },
        }
    },
    'newTags.*.text': {
        in: 'body',
        trim: true,
        escape: true, 
        isLength: {
            errorMessage: 'Tag too long',           
            options: { min: 1, max: 15 },
        },
    },
    assignedTags: {
        in: 'body',       
        optional: true,
        isArray: {
            options: { max: 5 },
        }
    },
    'assignedTags.*.id': {
        in: 'body',
        trim: true,
        escape: true,
        toInt: true,
        notEmpty: true
    },
    removedTags: {
        in: 'body',       
        optional: true,
        isArray: {
            options: { max: 5 },
        }
    },
    'removedTags.*.id': {
        in: 'body',
        trim: true,
        escape: true,
        toInt: true,
        notEmpty: true
    },
    removedImages: {
        in: 'body',       
        optional: true,
        isArray: {
            options: { max: 5 },
        }
    },
    'removedImages.*.id': {
        in: 'body',
        trim: true,
        escape: true,
        toInt: true,
        notEmpty: true
    }    
}

router.post('/new',    
    tokenAuth,
    async (req, res) => {       
        uploadNewImages(req, res, async function (err) {       
            if (err instanceof multer.MulterError) {               
                res.status(400).json(err.code)
            } else if (err) {                
                res.status(400).json(err.message)
            } else {
                const listingInfo = req.body
                listingInfo.tags = JSON.parse(listingInfo.tags)
                listingInfo.newTags = JSON.parse(listingInfo.newTags)                
                if (listingInfo.name.length > 0
                    && listingInfo.name.length <= 50
                    && listingInfo.price.length > 0
                    && listingInfo.description.length > 0
                    && listingInfo.titleImage.length > 0
                    && (listingInfo.tags.length > 0 || listingInfo.newTags.length > 0)
                    && req.files.length > 0
                ) {
                    

                    const trx = await promisify(db.transaction.bind(db));

                    const titleImageFile = req.files.find(file => {
                        if (file.originalname === listingInfo.titleImage) {
                            return file
                        }
                    })                    
                    
                    const newTags = listingInfo.newTags.map(tagObj => { return { ...tagObj, creator_id: req.user.id } })
                    const existingTags = await db('tags').select('*').whereIn('id', listingInfo.tags.map(tag => tag.id))                    
                    
                    const listing = {
                        name: listingInfo.name,
                        description: listingInfo.description,
                        title_image: titleImageFile.filename,
                        poster_id: req.user.id,
                        price: listingInfo.price,
                        type: listingInfo.type,
                    }

                    try { 
                        const listingId = await trx('listings').insert(listing).returning('id')

                        let newTagsIds;
                        if (newTags.length > 0) {
                            const response = await trx('tags').insert(newTags).returning('id')
                            newTagsIds = response
                        }                        

                        const updateTagPromises = []                            
                        
                        existingTags.forEach(tag => {
                            updateTagPromises.push(trx('tags').update('times_used', parseInt(tag.times_used) + 1).where('id', tag.id).returning('id'))
                        })                       

                        
                        const updatedTagIds = await Promise.all(updateTagPromises)
                       

                        const tagIds = [...updatedTagIds.flat()]

                        if (newTagsIds) {
                            tagIds.push(...newTagsIds)
                        }
                        
                        const tagListingPairs = tagIds.map(tagId => { return { listing_id: listingId[0], tag_id : tagId } })
                        
                        const tagListingPromises = []                        
                        tagListingPairs.forEach(pair => {                                                      
                            tagListingPromises.push(trx('listing_tags').insert(pair).returning('id'))
                        }) 

                        const pairing = await Promise.all(tagListingPromises)                    
                        
                        const imagePromises = []

                        req.files.forEach(newImage => {        
                            const data = {
                                file_name: newImage.filename,
                                listing_id: listingId[0],
                                user_id: req.user.id
                            }                            
                            imagePromises.push(trx('user_images').insert(data).returning('id'))
                        })                        

                        const images = await Promise.all(imagePromises)                        
                        
                        await trx.commit()
                        
                        const newListing = await listingModel.query().withGraphFetched('tags').withGraphFetched('user').withGraphFetched('images').select('*').from('listings').where('id', listingId[0])
                        
                        res.status(201).json(newListing[0])
                    }
                    catch (e) {     
                        console.log(e)
                        await trx.rollback();
                        res.sendStatus(500).json('failed listing upload')
                        //clean up images
                        req.files.forEach(file => asyncFs.unlink(`../public/uploads/${file.filename}`))                       
                    }                   
                } else { 
                    //clean up files
                    res.sendStatus(400)
                    req.files.forEach(file => asyncFs.unlink(`../public/uploads/${file.filename}`))
                }                  
            }           
        })    
       
})

router.post('/edit', tokenAuth, async (req, res) => {
    uploadEditImages(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            res.status(400).json(err.code)
        } else if (err) {
            res.status(400).json(err.message)
        } else {
            
            for (const property in req.body) {              
                req.body[property] = JSON.parse(req.body[property])                             
            }
            

            await checkSchema(editSchema).run(req)
            
            const valResult = await validationResult(req)

            if (valResult.errors.length === 0) {
                const info = req.body.info                
                const originalListing = await listingModel.query().withGraphFetched('tags').withGraphFetched('images').select('*').from('listings').where('id', info.id)
                
                if (req.user.id == parseInt(originalListing[0].poster_id))                
                { 
                    const trx = await promisify(db.transaction.bind(db));
                    try {                         
                        const newInfo = { ...info }
                        delete newInfo.id

                        if (Object.keys(newInfo).length > 0) {
                            await trx('listings').where('id', info.id).update(newInfo)
                        }

                        if (req.body.removedImages) {
                            const ids = req.body.removedImages.map(img => img.id)
                            await trx('user_images').where('id', 'in', ids).update('deleted', true)
                        }
                        
                        if (req.files) {
                            const imagePromises = []
                            req.files.forEach(newImage => {        
                            const data = {
                                file_name: newImage.filename,
                                listing_id: info.id,
                                user_id: req.user.id
                            }                            
                            imagePromises.push(trx('user_images').insert(data))
                            })
                            await Promise.all(imagePromises)    
                            
                            const titleImageFile = req.files.find(file =>  file.originalname === info.title_image)
                           

                            if (titleImageFile) {
                               await trx('listings').where('id', info.id).update('title_image', titleImageFile.filename).returning('title_image')                               
                            }
                        }
                        
                        let newTagIds = []
                        if (req.body.newTags) {
                            req.body.newTags.forEach(tag => tag.creator_id = req.user.id)
                            const ids = await trx('tags').insert(req.body.newTags).returning('id')
                            newTagIds = ids
                        }

                        let oldTagIds = []
                        if (req.body.assignedTags) {
                            const updateTagPromises = []                            
                        
                            req.body.assignedTags.forEach(tag => {
                                updateTagPromises.push(trx('tags').update('times_used', parseInt(tag.times_used) + 1).where('id', tag.id).returning('id'))
                            })                       

                        
                            const ids = await Promise.all(updateTagPromises)
                            oldTagIds = ids
                        }                        
                        
                        const allTagIds = [...oldTagIds.flat(), ...newTagIds]

                        if (allTagIds.length > 0) {
                            const pairing = allTagIds.map(tagId => { return { listing_id: info.id, tag_id: tagId } })
                            await trx('listing_tags').insert(pairing)
                        }                      
                        
                        if (req.body.removedTags) {
                            const ids = req.body.removedTags.map(tag => tag.id)
                            await trx('listing_tags').where('tag_id', 'in', ids).andWhere('listing_id', info.id).del()
                        }

                        await trx.commit()
                        const modifiedListing = await listingModel.query().withGraphFetched('tags').withGraphFetched('user').withGraphJoined('images').where('listings.id', info.id).where('images.deleted', false)
                        res.status(200).json(modifiedListing)
                    }
                    catch (e) {
                        console.log(e)
                        res.sendStatus(500)
                        await trx.rollback();
                        req.files.forEach(file => asyncFs.unlink(`../public/uploads/${file.filename}`))
                    }
                    
                } else {
                    res.sendStatus(403)
                    req.files.forEach(file => asyncFs.unlink(`../public/uploads/${file.filename}`))
                }         
                
            } else {
                //clean up images                
                res.status(400).json(valResult.errors)
                req.files.forEach(file => asyncFs.unlink(`../public/uploads/${file.filename}`))
            }
        }
    })
   
    
})

module.exports = router