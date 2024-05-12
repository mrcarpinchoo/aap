'use strict';

const express = require('express');
const Message = require('../../db/models/Message');
const { checkPetExistenceInDb } = require('../middleware/petMiddleware');

const router = express.Router();

router.post('/:petUuid', checkPetExistenceInDb, async (req, res) => {
    const { userEmail, ownerEmail, date, content } = req.body;
    const { petUuid } = req.params;

    if (!userEmail || !content) {
        res.status(400).json({ error: 'Missing attributes' });
        return;
    }

    const messageData = {
        userEmail,
        ownerEmail,
        date,
        content,
        petUuid
    };

    try {
        const message = await Message.createMessage(petUuid, messageData);
        res.status(201).json(message);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:petUuid', checkPetExistenceInDb, async (req, res) => {
    try {
        const messages = await Message.findMessagesByPetUuid(
            req.params.petUuid
        );
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/message/:messageId', async (req, res) => {
    const { messageId } = req.params;

    try {
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
