'use strict';

// Imports
// libraries
const express = require('express');
const jwt = require('jsonwebtoken');

// project modules
const {
    validateReqBody,
    getUserFromDb,
    checkEmailExistence,
    validatePassword
} = require('../middleware/authMiddleware');

const router = express.Router();

// POST requests
// authenticates user
router.post(
    '/login',
    validateReqBody,
    getUserFromDb,
    checkEmailExistence,
    validatePassword,
    (req, res) => {
        const { _id, uuid, email } = req.body.user; // req.body.user is declared in the getUserFromDb middleware function

        const token = jwt.sign(
            { _id, uuid, email },
            process.env.JWT_PRIVATE_KEY,
            {
                algorithm: 'HS256',
                expiresIn: '1h'
            }
        );

        return res.status(200).send({ token });
    }
);

module.exports = router;
