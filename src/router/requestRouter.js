'use strict';

const express = require('express');
const Request = require('../../db/models/Request');
const { checkPetExistenceInDb } = require('../middleware/petMiddleware');

const router = express.Router();

router.post('/:petUuid', checkPetExistenceInDb, async (req, res) => {
    const {
        userFirstName,
        userLastName,
        userCity,
        userState,
        userPostalCode,
        userDirection,
        userAge,
        userCouple,
        userChildrenQty,
        userEmail
    } = req.body;
    const { petUuid } = req.params;

    if (
        !userFirstName ||
        !userLastName ||
        !userCity ||
        !userState ||
        !userPostalCode ||
        !userDirection ||
        !userAge ||
        !userCouple ||
        userChildrenQty < 0 ||
        !userEmail
    ) {
        res.status(400).json({ error: 'Missing attributes' });
        return;
    }

    const requestData = {
        userFirstName,
        userLastName,
        userCity,
        userState,
        userPostalCode,
        userDirection,
        userAge,
        userCouple,
        userChildrenQty,
        userEmail,
        petUuid
    };

    try {
        const request = await Request.createRequest(petUuid, requestData);
        res.status(201).json(request);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:petUuid', checkPetExistenceInDb, async (req, res) => {
    try {
        const requests = await Request.findRequestsByPetUuid(
            req.params.petUuid
        );
        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/request/:requestId', async (req, res) => {
    const { requestId } = req.params;

    try {
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json(request);
    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/request/:requestId', async (req, res) => {
    const { requestId } = req.params;

    try {
        const deletedRequest = await Request.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ message: 'Request deleted successfully' });
    } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
