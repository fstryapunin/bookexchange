const express = require('express');
const { tokenAuth } = require('../middleware/auth')
const { conversationModel } = require('../models')
const { body } = require('express-validator');
const { db } = require('../middleware/knex')
const router = express.Router()

router.get('/conversations', tokenAuth, async (req, res) => {
    try { 
        const userConvoIds = await db('user_conversations').where('user_id', req.user.id).andWhere('deleted', false).pluck('conversation_id')
        
        const data = await conversationModel.query()
            .withGraphFetched('users')
            .withGraphJoined('messages')
            .where('conversations.id', 'in', userConvoIds)
            .andWhere('conversations.deleted', false)
            .where('messages.deleted', false)
            .orderBy('conversations.added', 'desc')
        
        res.json(data)
    }
    catch (e) {
        console.log(e)
        res.status(500).json('database error')
    }
   
})

router.post('/read', tokenAuth, body('id').notEmpty().escape().toInt(), async (req, res) => {
    try {
        await db('messages').where('conversation_id', req.body.id).where('creator_id', '!=', req.user.id).update('seen', true)
        const messages = await db('messages').select('*').where('conversation_id', req.body.id)
        
        res.status(200).json({
            id: req.body.id,
            data: messages
        })
    } catch (e) {
        console.log(e)
        res.status(500).json('database error')
    }
})

module.exports = router