const express = require('express');
const knex = require('knex')
const cors = require('cors')
const multer = require('multer');
const jwt = require("jsonwebtoken");
const { Model } = require('objection');
const { cookieAuth, tokenAuth } = require('./middleware/auth')
const cookieParser = require('cookie-parser')
const { OAuth2Client } = require('google-auth-library')
const { port, googleClientId, dbUrl, tokenKey } = require('./config');
const { listingModel } = require('./models')
const { body, param, validationResult } = require('express-validator');
const asyncFs = require('fs').promises
const ws = require('ws')

const app = express();
const googleClient = new OAuth2Client(googleClientId)
const db = knex({
   
    client: 'pg',
    connection : dbUrl,      
    
});
Model.knex(db)

const corsConfig = {
    origin: ['http://localhost:3000', 'https://kepler-x.vercel.app'],
    methods: "GET,PUT,POST,DELETE, OPTIONS",
    optionsSuccessStatus: 200,
    credentials: true
}

//turn function into a promise
const promisify = (fn) => new Promise((resolve, reject) => fn(resolve));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const uniquePrefix = `${req.user?.id}_${Date.now()}_${Math.round(Math.random() * 1E9)}`  
        cb(null, uniquePrefix + '_' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {     
    if ((file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')) {        
        return cb(null, true)
    }
    else {         
        cb(new Error("WRONG_FILE_TYPE"), false)
    }  
}
  
const multerUploader = multer({
    storage: storage,
    limits: {fileSize : 5242880},
    fileFilter: fileFilter,   
})

app.use(cors(corsConfig))
//parse cookies
app.use(cookieParser())
//parse json
app.use(express.json())
//server static images
app.use('/public/uploads', express.static('public/uploads'))

const server = app.listen(port, () => console.log('Listening on port', port));
const wss = new ws.WebSocketServer({ noServer: true });

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


server.on('upgrade', async function upgrade(request, socket, head) {   
   
    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request);
    });
})

app.get('/', (req, res) => {    
    res.sendStatus(200)
})

app.get('/public/listings/new/:page', param('page').escape().toInt(), async (req, res) => {   
    const { page } = req.params
    
    if (Number.isInteger(page) && page >= 0) {
        const listings = await listingModel.query().withGraphFetched('tags').withGraphFetched('user').withGraphFetched('images').select('*').from('listings').orderBy('added', 'desc').offset(page * 20).limit(20)         
        res.json(listings)        
    } else {
        res.sendStatus(400)
    }
})

app.get('/public/listing/:listingId', param('listingId').escape().toInt(), async (req, res) => {
    const { listingId } = req.params
    if (Number.isInteger(listingId)) {
        const data = await listingModel.query().withGraphFetched('tags').withGraphFetched('user').withGraphFetched('images').select('*').from('listings').where('id', listingId)
        if (data.length > 0) {
            res.json(data[0])
        } else {
            res.sendStatus(404)
        }
    } else {
        res.sendStatus(400)
    } 
})

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

app.post('/auth/google/login', async (req, res) => {
    
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

app.get('/auth/getAccessToken', cookieAuth, (req, res) => {
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

app.get('/auth/logout', (req, res) => {
    res.clearCookie('token')
    res.sendStatus(200)
})

app.post('/user/listings', tokenAuth, async (req, res) => {
    //limit ammount    
    const userListings = await listingModel.query().withGraphFetched('tags').withGraphFetched('images').select('*').from('listings').where('poster_id', req.user.id).orderBy('added', 'desc') 
    res.status(200).json(userListings)
})

app.post('/user/profile', tokenAuth, async (req, res) => {
    const userData = await db.select('*').from('users').where('id', req.user.id)
    const user = userData[0]    
    const resBody = {
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        link: user.img_link
    }
    res.status(200).json(resBody)
})

app.post('/user/listing/:listingId', tokenAuth, param('listingId').escape().toInt(), async (req, res) => {
    const { listingId } = req.params
    if (Number.isInteger(listingId)) {        
        const listing = await listingModel.query().withGraphFetched('tags').withGraphFetched('images').select('*').from('listings').where('id', listingId)
        if(listing.length > 0){
            if (parseInt(listing[0].poster_id) === req.user.id) {
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

const upload = multerUploader.array('images', 5)
app.post('/new/listing',    
    tokenAuth,
    async (req, res) => {       
        upload(req, res, async function (err) {       
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
                        req.files.forEach(file => asyncFs.unlink(`./public/uploads${file.filename}`))                       
                    }                   
                } else { 
                    //clean up files
                    res.sendStatus(400)
                    req.files.forEach(file => asyncFs.unlink(`./public/uploads${file.filename}`))
                }                  
            }           
        })    
       
})

app.get('/public/tags/:name', param('name').escape(), async (req, res) => {
    const { name } = req.params
    const data = await db('tags').select('*').whereRaw(`LOWER(text) LIKE LOWER(?)`, [`${name}%`]).orderBy('times_used')    
    res.json(data)
})
