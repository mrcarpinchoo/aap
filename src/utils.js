'use strict';

// Imports
// libraries
const jwt = require('jsonwebtoken');

function signToken(_id, uuid, email) {
    return jwt.sign({ _id, uuid, email }, process.env.JWT_PRIVATE_KEY, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
}

module.exports = { signToken };
