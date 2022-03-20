const express = require('express');
const { tokenAuth } = require('../middleware/auth')
const { conversationModel } = require('../models')

const router = express.Router()

router.get('/conversations', async (req, res) => {
    try { 
        const data = await conversationModel.query()
            .withGraphFetched('users')
            .withGraphJoined('messages')
            .where('conversations.creator_id', 5)
            .andWhere('conversations.deleted', false)
            .where('messages.deleted', false)
            
        res.json(data)
    }
    catch (e) {
        console.log(e)
        res.status(500).json('database error')
    }
   
})

module.exports = router